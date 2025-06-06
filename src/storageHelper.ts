import CryptoJS from "crypto-js";

const SECRET_KEY = "sk-92fa8c33a4f140c7b478acb8e8123456";

export const encryptData = (data: any): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

export const decryptData = (ciphertext: string | null): any => {
  if (!ciphertext) return null; // nothing to decrypt

  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedStr) return null; // failed to decrypt or wrong key
    return JSON.parse(decryptedStr);
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};
