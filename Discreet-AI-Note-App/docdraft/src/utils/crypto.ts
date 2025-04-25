import CryptoJS from 'crypto-js';

// This salt would ideally be more complex in a production app
const SALT = 'DOCDRAFT_SECURE_STORAGE';

/**
 * Encrypts a string value using AES encryption
 */
export const encrypt = (value: string): string => {
  try {
    return CryptoJS.AES.encrypt(value, SALT).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
};

/**
 * Decrypts an encrypted string value
 */
export const decrypt = (encryptedValue: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedValue, SALT);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
};
