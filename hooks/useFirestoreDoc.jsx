import { getDoc, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

/**
 * @template T
 * @typedef {object} useFirestoreDocReturn
 * @property {import("firebase/firestore").DocumentData | undefined | T} data
 * @property {import("firebase/firestore").DocumentReference|string} ref
 * @property {boolean} fetching
 * @property {()=>Promise<void>} refetch
 * @property {({docData:T, options: import("firebase/firestore").SetOptions})=>Promise<void>} update
 * @property {({docData:T, options: import("firebase/firestore").SetOptions})=>Promise<void>} nonBlockUpdate
 * @property {({docData:T, options: import("firebase/firestore").SetOptions})=>Promise<void>} overwrite
 * @property {Error?} error
 * @property {()=>Promise<void>} remove
*/

/**
 * @template [T=object]
 * @param {string} path
 * @param {{fetch: boolean, new: boolean}|any} conf
 * @returns {useFirestoreDocReturn<T>}
*/
export const useFirestoreDoc = (path, conf={fetch:true, new:false}) => {
  
  const queryClient = useQueryClient();
  const [loadingState, setLoadingState] = useState(true);

  const refetch = async () => {
    queryClient.invalidateQueries({queryKey: [path]});
    if(conf.fetch)
      await refetchOriginalQuery();
  }

  const {data, isLoading, error, refetch:refetchOriginalQuery} = useQuery({
    queryKey: [path, ...path.split("/")],
    queryFn: async () => {
      
      if(!conf.fetch || conf.new)
        return {};

      if(!path || !path.length || path == ""){
        console.warn(`useFirestoreDoc called with empty path`);
        return {};
      }

      try {
        
        const docSnap = await getDoc(doc(db, path));
  
        if(docSnap.exists()){
          return {...docSnap.data(), docId: docSnap.id};
        }

      } catch (error) {
        console.error(`Error fetching ${path}: ${error}`);      
      }
      
      return {};
    },
  });

  const {mutateAsync: update, isPending: loadingUpdate} = useMutation({

    /** 
     * @param {object} props
     * @returns 
     */
    mutationFn: async ({docData, options = {merge: true}}) => {
      
      const docRef = doc(db, path);
      await setDoc(docRef, docData, options);
      return {docRef, docData}
    },
    onSuccess: async ({docRef}) => {
      refetch();
      return docRef
    },
  });

  const {mutateAsync: nonBlockUpdate} = useMutation({

    /** 
     * @param {object} props
     * @returns 
     */
    mutationFn: async ({docData, options = {merge: true}}) => {
      
      const docRef = doc(db, path);
      await setDoc(docRef, docData, options);
      return {docRef, docData}
    },
    onSuccess: async ({docRef}) => {
      await refetch();
      return docRef
    },
  });

  const {mutateAsync: overwrite, isPending: loadingOverwrite} = useMutation({

    /** 
     * @param {object} props
     * @returns 
     */
    mutationFn: async ({docData, options = {merge: false}}) => {
      const docRef = doc(db, path);
      await setDoc(docRef, docData, options);
      return {docRef, docData}
    },
    onSuccess: async ({docRef}) => {
      refetch();
      return docRef
    },
  });

  const {mutateAsync: remove, isPending: loadingRemove} = useMutation({

    mutationFn: async () => {
      const docRef = doc(db, path);
      await deleteDoc(docRef);
    },
    onSuccess: async () => {},
  });

  useEffect( () => { 
      setLoadingState(
        isLoading ||
        loadingUpdate || 
        loadingOverwrite || 
        loadingRemove
      )
    },
    [isLoading, loadingUpdate, loadingOverwrite, loadingRemove]
  );

  return { fetching: loadingState, data, ref: path? doc(db, path):"" , refetch, update, overwrite, remove, error, nonBlockUpdate };

}
