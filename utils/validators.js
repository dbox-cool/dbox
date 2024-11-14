/* eslint-disable no-useless-escape */

/**
 * 
 * @param {string} email 
 * @returns {boolean}
 */
const validateEmail = (email) => {
  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
};

/**
 * 
 * @param {string} cedula 
 * @returns {boolean}
 */
const validateCedula = (cedula) => {
  return /^[V|E][0-9]{5,9}$/.test(cedula);
};

/**
 * 
 * @param {string} phone 
 * @returns {boolean}
 */
const validatePhone = (phone) => {
  return /^(0?(416|426|414|424|412|212))\d{7}$/.test(phone);
};

/**
 * returns true if the guardian is indeed, empty... lol
 * @param {Contact?} guardian 
 * @returns 
 */
const isGuardianEmpty = (guardian) => {
  if(!guardian)
    return true;

  return (!guardian.address || guardian.address?.trim() == "") &&
         (!guardian.email || guardian.email?.trim() == "") &&
         (!guardian.idCard || guardian.idCard?.trim() == "") &&
         (!guardian.name || guardian.name?.trim() == "") &&
         (!guardian.phone || guardian.phone?.trim() == "");
}

export { validateEmail, validateCedula, validatePhone, isGuardianEmpty };