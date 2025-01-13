import { circularClamp } from "./moreMath";

const formatDate = (date, separator="/") => {
  const stringDate = date.toLocaleString(
    "es-ES", 
    { timeZone: "America/Caracas" }
  )
  return date = stringDate.split(',')[0].split("/").join(separator);
}

const formatTimestamp = tm => {
  return formatDate(new Date(tm.seconds * 1000));
}

const getDate = date => {
  if(date instanceof Date)
    return date;
  return new Date(date.seconds * 1000);
}
  
const getWeekDates = (index) => {
  const today = new Date();
  today.setHours(0,0,0,0);
  const day = circularClamp(today.getDay()-1, 0, 6); // Get day (0 for Sunday) and normalize to 0-6
  today.setDate(today.getDate()+(index*7-day));
  
  let dates = [];
  const days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'] 
  for (let i = 0; i <= 6; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    dates.push({
      day: days[i],
      date: date
    });
  }
  
  return dates;
}

function getWeekOfMonth(date) {
  // Copy date so don't modify original
  let d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
  // Get first day of year
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  // Calculate full weeks to nearest Thursday
  var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
  // Return array of year and week number
  return weekNo;
//   const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
//   const firstDayOfWeek = firstDayOfMonth.getDay();
//  // 0 (Sunday) to 6 (Saturday)

//   const currentDayOfMonth = date.getDate();
//   const offset = (currentDayOfMonth + firstDayOfWeek - 1) % 7;

//   return Math.floor((currentDayOfMonth + offset) / 7) + (offset === 0 && firstDayOfWeek !== 0 ? 0 : 1);
}

/**
 * get unix timestamp
 * @param {Date} date 
 * @returns 
 */
function getTimestamp(date){
  return Math.floor(date.getTime()/1000);
}

/**
 * 
 * @param {string} birthdate 
 * @returns {number}
 */
function calculateAge(birthdate){
  const today = new Date();
  const bdate = new Date(birthdate);
  let age = today.getFullYear() - bdate.getFullYear();
  if(
    today.getMonth() < bdate.getMonth() ||
    (today.getMonth() === bdate.getMonth() && today.getDate() < bdate.getDate())
  )
    age--;
  return age; 
}

/**
 * @param {Date} date
 * @returns {string}
*/
function getTimeAsString(date) {
  if(!date) return "";
  if(!(date instanceof Date))
    date = getDate(date);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * @param {Date} date
 * @returns {string}
*/
function getYYYYMMDD(date){
  return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${(date.getDate()).toString().padStart(2, '0')}`;
}

export {getYYYYMMDD, getTimeAsString,  calculateAge, formatDate, getWeekDates, getWeekOfMonth, getTimestamp, formatTimestamp, getDate };
