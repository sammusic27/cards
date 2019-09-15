const crypto = require('crypto');

const algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
const ENCRYPTED_KEY = 'fod[bjrmvualw;fodmsbgybunorrkfne'; // 32 characters
const IV_LENGTH = 16;
const encoding = 'utf8';

let iv = Buffer.alloc(IV_LENGTH); // iv should be 16
// randomize the iv, for best results
iv = Buffer.from(Array.prototype.map.call(iv, () => {return Math.floor(Math.random() * 256)}));

function encrypt(text){
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(ENCRYPTED_KEY), iv);
  return cipher.update(text, encoding, 'hex') + cipher.final('hex');
}

function decrypt(encrypted){
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(ENCRYPTED_KEY), iv);
  return decipher.update(encrypted, 'hex', encoding) + decipher.final(encoding);
}

module.exports = {
  encrypt,
  decrypt
};
