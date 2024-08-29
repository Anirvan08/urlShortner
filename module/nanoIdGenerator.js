const crypto = require('crypto');

function customNanoid(size = 21) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    const id = [];

    // Generate cryptographically strong random values
    const bytes = crypto.randomBytes(size);

    // Map each random byte to a character in the alphabet
    for (let i = 0; i < size; i++) {
        const index = bytes[i] % alphabet.length;
        id.push(alphabet[index]);
    }

    return id.join('');
}


module.exports = customNanoid;
