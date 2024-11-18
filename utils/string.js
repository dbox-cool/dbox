/**
 * Capitalize the first letter of each word
 * @param {string} str 
 * @returns 
 */
const capitalizeAll = (str) => {

  if(!str || str == "")
    return "";

  // Split the input string into an array of words
  str = str.toLowerCase().trim().split(" ");

  // Iterate through each word in the array
  for (var i = 0, x = str.length; i < x; i++) {
    // Capitalize the first letter of each word and concatenate it with the rest of the word
    str[i] = String(str[i][0]).toUpperCase() + str[i].substring(1);
  }

  // Join the modified array of words back into a string
  return str.join(" ");
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
    !str? undefined : str
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