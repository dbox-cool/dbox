/**
 * Capitalize the first letter of each word
 * @param {string} str 
 * @returns 
 */
const capitalizeAll = (str) => {
  
  if(!str || str == "")
    return "";

  let strArr = str.trim().toLowerCase().split(" ");
  for (let i = 0; i < strArr.length; i++) 
    if(strArr[i].length)
      strArr[i] = String(strArr[i][0]).toUpperCase() + strArr[i].substring(1);

  // Join the modified array of words back into a string
  return strArr.filter(s => s.length && s!="UNDEFINED").join(" ");
};

const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const snake2camel = (str) => {
  const words = str.split("_");
  return [words[0], ...words.slice(1).map( substr => capitalizeFirst(substr) ) ].join("");
}

const itoa = (n) => {
  
  let ans = ""+n;
  while(ans.length < 5)
    ans = "0"+ans;
  return ans;

}
/**
 * @param {string} str
 * @returns {string}
 */
const normalize = 
  str => 
    !str || typeof str != "string"?
      undefined
      :
      str
        .split(" ")
        .join("")
        .toUpperCase()
        .trim()
        .replace("Á","A")
        .replace("É","E")
        .replace("Í","I")
        .replace("Ó","O")
        .replace("Ú","U")

/**
 * compares to strings to determine if they are the same-ish word or phrase
 * @param {string} str1 
 * @param {string} str2 
 * @returns {boolean}
 */
const wordcmp = (str1, str2) => normalize(str1) == normalize(str2);

export { wordcmp, capitalizeAll, capitalizeFirst, snake2camel, itoa, normalize };
