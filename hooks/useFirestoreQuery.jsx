/* eslint-disable no-case-declarations */
import { getDocs, collection, orderBy, query, limit, startAfter, doc, setDoc, addDoc, deleteDoc, endBefore, where, getDoc, documentId, writeBatch, limitToLast, onSnapshot } from "firebase/firestore";
import { db } from "@/services/firebase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCallback } from "react";
import firestore from "@/services/firestore";

/**
 * @typedef {object} QueryFilterType
 * @property {string} field
 * @property {import("firebase/firestore").WhereFilterOp} op
 * @property {string} value
 * @property {string?} sibling
 */

/**
 * @typedef {object} QuerySpecsType
 * @property {string} [orderByField]
 * @property {string} [orderByDirection]
 * @property {import("firebase/firestore").QueryConstraintType[]} [queryConstraints]
 * @property {number} [batchSize]
 * @property {QueryFilterType[]?} filters
 * @property {boolean} [listen]
*/

/**
 * @typedef {object} useFirestoreQueryReturn
 * @property {import("firebase/firestore").DocumentData[]} data 
 * @property {boolean} loading
 * @property {boolean} loadingFetch
 * @property {Error | null} error
 * @property {()=>Promise<void>} refetch
 * @property {(docData: object) => Promise<{docData: any, docRef: import("firebase/firestore").DocumentReference}>} addDocument
 * @property {(docData: object) => Promise<boolean>} updateBatch update all documents fetched with the specified constraints
 * @property {(docId: string) => Promise<void>} removeDocument
 * @property {({docId: string, docData: any, options:{merge: boolean}}) => Promise<{docData: any, docRef: import("firebase/firestore").DocumentReference}>} overwriteDocument
 * @property {({docId: string, docData: any, options:{merge: boolean}}) => Promise<{docData: any, docRef: import("firebase/firestore").DocumentReference}>} updateDocument
 * @property {number} page
 * @property {number} maxPages
 * @property {boolean} existsNextPage
 * @property {(page: number)=>void} setPage
 * @property {(filterState: QueryFilterType[])=>void} setFilterState
 * @property {()=>void} clearFilterState
 * @property {()=>Map<string, string>} getQueryParamsState
*/

/**
 * @param {string} path
 * @param {QuerySpecsType?} querySpecs
 * @returns {useFirestoreQueryReturn}
*/
export const useFirestoreQuery = (
  path, 
  { 
    orderByField, 
    orderByDirection = "desc", 
    queryConstraints=[], 
    batchSize=-1, 
    filters=[], 
    fetch=true, 
    listen=false 
  }
) => {

  /** 
   * Manage React query client
   * @type {import("@tanstack/react-query").QueryClient}
  */
  const queryClient = useQueryClient();

  /**
   * Firebase reference to the collection
   * @type {import("firebase/firestore").CollectionReference}
   */
  const collectionRef = collection(db, path);
  
  /**
   * Firebase reference to the first document of the current page
   * @type {React.MutableRefObject<import("firebase/firestore").QueryDocumentSnapshot?>}
   */
  const firstDocRef = useRef(null);
  
  /**
   * Firebase reference to the last document of the current page
   * @type {React.MutableRefObject<import("firebase/firestore").QueryDocumentSnapshot?>}
   */
  const lastDocRef = useRef(null);

  /** @type {ReturnType<typeof useState<boolean>>} */
  const [loadingState, setLoadingState] = useState(false);
  
  /**
   * current page number loaded
   * @type {React.MutableRefObject<number>}
   */
  const pageRef = useRef(-1);

  const [searchParams, setSearchParams] = useSearchParams();
  
  const [unsubListener, setUnsubListener] = useState(undefined);
  useEffect( () => {
    if(unsubListener)
      return ()=>unsubListener();
  }, [unsubListener, listen])

  /**
   * Current displayed page
   * @type {number}
   */
  const page = Number(searchParams.get("page")??0); 
  
  /**
   * Function to set the current displayed page
   * @type {(page:number)=>void}
   */
  const setPage = useCallback( (page) => {
    setSearchParams( (params) => {
      if(page!=undefined)
        params.set('page', page);
      return params;
    } );
  }, []);

  const setFilterState = useCallback( (newFilterState) => {
    setSearchParams( params => {
      newFilterState.forEach( f => params.set(f.field, f.value) );
      return params;
    });
  }, []);

  const clearFilterState = useCallback( () => {
    setSearchParams( params => {
      filters.forEach( f => {
        if(!f.value)
          params.delete(f.field);
      } );
      return params;
    } );
  }, []);

  const getQueryParamsState = () => {
    let ans = {};
    for( const [k, v] of searchParams.entries() )
      ans[k]=v;
    return ans;
  }

  // eslint-disable-next-line no-unused-vars
  const [existsNextPage, setExistsNextPage] = useState(batchSize>0);
  const [maxPages, setMaxPages] = useState(0);

  useEffect(() => {
    const count = async () => {
      const n = await countFunction();
      setMaxPages(Math.ceil(n/batchSize));
    };

    if(fetch)
      count();
  }, [queryConstraints, filters, batchSize]);

  const refetch = async () => {
    if(fetch)
      await refetchOriginalQuery();
    else
      queryClient.invalidateQueries({queryKey: [path]});
  }

  const countFunction = async () => {
    const qConstraints = [...queryConstraints];

    // add all filters as query constraints
    for (let i = 0; i < filters.length; i++) {
      const f = filters[i];
      switch (f.op){
        
        // this was an attempt for a custom query constraint that ended up just being a fucking tech debt
        case "in-sibling-field":  
          let newPath = path.split("/");
          newPath.pop();
          newPath.push(f.sibling);
          newPath.push(f.value);
          const docRef = doc(db, `${newPath.join("/")}`);
          const response = await getDoc(docRef);
          if(response.exists()){
            qConstraints.push(where("__name__", 'in', response.data()[f.field] ));
          } else {
            qConstraints.push(where(documentId(), '==', 'nonexistent-id'));
          }
          break;
        
        default:
          if(searchParams.get(f.field) || f.value)
            qConstraints.push(where( f.field, f.op, searchParams.get(f.field)??f.value ));
      }
    }

    return await firestore.countCollection(path, qConstraints);
  }

  const fetchFunction = async (pagination=batchSize>0) => {

    const qConstraints = [...queryConstraints];

    // add all filters as query constraints
    for (let i = 0; i < filters.length; i++) {
      const f = filters[i];
      switch (f.op){
        
        // this was an attempt for a custom query constraint that ended up just being a fucking tech debt
        case "in-sibling-field":  
          let newPath = path.split("/");
          newPath.pop();
          newPath.push(f.sibling);
          newPath.push(f.value);
          const docRef = doc(db, `${newPath.join("/")}`);
          const response = await getDoc(docRef);
          if(response.exists()){
            qConstraints.push(where("__name__", 'in', response.data()[f.field] ));
          } else {
            qConstraints.push(where(documentId(), '==', 'nonexistent-id'));
          }
          break;
        
        default:
          if(searchParams.get(f.field) || f.value)
            qConstraints.push(where( f.field, f.op, searchParams.get(f.field)??f.value ));
          
      }
    }

    // add orderBy as query constraint
    if(orderByField)
      qConstraints.push( orderBy(orderByField, orderByDirection) );
    
    // if using pagination, add the page logic as query constraints
    if(pagination){
      if(page == 0 || pageRef.current == -1 || Math.abs(pageRef.current-page)>1){
        qConstraints.push( limit(batchSize*(page+1)) );
      }else{
        if(page != 0){
          if(lastDocRef.current != null && pageRef.current < page)
            qConstraints.push(startAfter(lastDocRef.current));
          else if(firstDocRef.current != null && pageRef.current > page)
            qConstraints.push(endBefore(firstDocRef.current));
        }

        if(pageRef.current <= page)
          qConstraints.push(limit(batchSize));
        else
          qConstraints.push(limitToLast(batchSize));
      }
    }
    
    const q = query(collectionRef, ...qConstraints);
    const docSnap = await getDocs(q);
    if(listen && !unsubListener)
      setUnsubListener( () => onSnapshot(q, ()=>refetchOriginalQuery()) )
      // setUnsubListener( () => onSnapshot(q, ()=>queryClient.invalidateQueries({queryKey: [path]})) )
      
    
    if(docSnap.empty){
      return [];
    }
    
    pageRef.current = page;
    let ans = [], docs2use;
    if(pagination){
      if(docSnap.size<=batchSize)
        firstDocRef.current = docSnap.docs[0];
      else
        firstDocRef.current = docSnap.docs[docSnap.size-batchSize];
  
      lastDocRef.current = docSnap.docs[ docSnap.size-1 ];
    }
    docs2use = (!pagination||docSnap.size<=batchSize)? docSnap.docs:docSnap.docs.splice( -batchSize );
    
    docs2use.forEach( doc => {
      const item = doc.data();
      // Object.keys(docData).forEach( key => { item[snake2camel(key)] = docData[key] });
      item.docId = doc.id;
      ans.push(item);
    } );
    return ans;
  }

  const {data, isLoading: loadingFetch, error, refetch: refetchOriginalQuery} = useQuery({
    queryKey: [path, page, `${orderByField} ${orderByDirection}`, JSON.stringify(queryConstraints), JSON.stringify(filters), searchParams.toString() ],
    queryFn: async () => {
      try {

        if(!fetch)
          return [];

        return await fetchFunction();

      } catch (error) {
        console.error(`error fetching firestore query ${path}:`, error)
        return [];
      }
    },
  });

  const {mutateAsync: addDocument, isPending: loadingAdd} = useMutation({
    mutationFn: async (docData) => {
      if( Object.hasOwn(docData, "firestoreDocumentId") ){
        const id = docData.firestoreDocumentId;
        // console.log("id: ", id);
        delete docData.firestoreDocumentId;
        const docRef = await setDoc( doc(db, `${path}/${id}`), docData );
        return {docRef, docData}
      }else{
        const docRef = await addDoc(collectionRef, docData);
        return {docRef, docData}
      }
    },
    onSuccess: async ({docRef}) => {
      refetch();
      return docRef
    },
    onError: (error) => {
      console.error(`Error in useFirestoreQuery adding document to ${path}: ${error}`);
    }
  })

  const {mutateAsync: updateDocument, isPending: loadingUpdate} = useMutation({
    /** 
     * @param {import("./useFirestoreCollection").UpdateDocumentProps} props 
     * @returns 
     */
    mutationFn: async ({docId, docData, options={merge:true}}) => {
      const docRef = doc(collectionRef, docId);
      await setDoc(docRef, docData, options);
      return {docRef, docData}
    },
    onSuccess: async ({docRef}) => {
      refetch();
      return docRef
    }
  })

  const {mutateAsync: updateBatch, isPending: loadingUpdateBatch} = useMutation({
    /** 
     * @param {object} props
     * @param {object} props.docData
     * @param {{merge: boolean}} props.options  
     * @returns 
     */
    mutationFn: async ({docData}) => {
      try {
        let docs2update = data;
        if(!fetch)
          docs2update = await fetchFunction();
        
        const batch = writeBatch(db);
        docs2update.forEach( d => batch.update( doc(db, path, d.id), docData ) );
        await batch.commit();
        return true;
      } catch (error) {
        console.error(`error while updating batch ${error}`);
        return false;
      }
    },
    onSuccess: async (res) => {
      refetch();
      return res
    }
  })

  const {mutateAsync: overwriteDocument, isPending: loadingOverwrite} = useMutation({

    /** 
     * @param {import("./useFirestoreCollection").UpdateDocumentProps} props 
     * @returns 
     */
    mutationFn: async ({docId, docData, options={merge:false}}) => {
      const docRef = doc(collectionRef, docId);
      await setDoc(docRef, docData, options);
      return {docRef, docData}
    },
    onSuccess: async ({docRef}) => {
      refetch();
      return docRef
    }
  })

  const {mutateAsync: removeDocument, isPending: loadingRemove} = useMutation({

    /** 
     * @param {string} docId 
     * @returns 
     */
    mutationFn: async ({docId}) => {
      const docRef = doc(collectionRef, docId);
      await deleteDoc(docRef);
      return {}
    },
    onSuccess: async () => {}
  })

  useEffect(() => {
    setLoadingState(loadingAdd || loadingFetch || loadingOverwrite || loadingRemove || loadingUpdate || loadingUpdateBatch);
  }, [loadingAdd, loadingFetch, loadingOverwrite, loadingRemove, loadingUpdate, loadingUpdateBatch]);

  /** @type {useFirestoreQueryReturn} */
  return { 
    loading: loadingState, 
    loadingFetch, 
    data, 
    error, 
    refetch, 
    removeDocument, 
    overwriteDocument, 
    updateDocument, 
    addDocument, 
    updateBatch, 
    page, 
    setPage, 
    existsNextPage, 
    maxPages, 
    setFilterState, 
    clearFilterState, 
    getQueryParamsState 
  };

}
