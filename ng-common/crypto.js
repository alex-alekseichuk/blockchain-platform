'use strict';

const bs58 = require('bs58');
const _sodium = require('libsodium-wrappers');
let sodium;

const _crypto = {
  generate_bs58: function() {
    const keypair = this.generate();
    return {
      prvkey: this.bs58_encode(keypair.prvkey),
      pubkey: this.bs58_encode(keypair.pubkey)
    };
  },
  generate_seed_bs58: function(seed) {
    const keypair = this.generate(seed);
    return {
      prvkey: this.bs58_encode(keypair.prvkey),
      pubkey: this.bs58_encode(keypair.pubkey)
    };
  },
  generate: function() {
    const keypair = sodium.crypto_sign_keypair();
    return {
      prvkey: keypair.privateKey,
      pubkey: keypair.publicKey
    };
  },
  generate_seed: function(seed) {
    const keypair = sodium.crypto_sign_seed_keypair(seed);
    return {
      prvkey: keypair.privateKey,
      pubkey: keypair.publicKey
    };
  },
  get_sign_SEEDBYTES: () => sodium.crypto_sign_SEEDBYTES,
  pubenc: function(prvkey) {
    return sodium.crypto_sign_ed25519_pk_to_curve25519(prvkey);
  },
  prvenc: function(pubkey) {
    return sodium.crypto_sign_ed25519_sk_to_curve25519(pubkey);
  },
  nonce: function() {
    return sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
  },
  bs58_encode: function(key) {
    return bs58.encode(Buffer.from(key));
  },
  bs58_decode: function(str) {
    return new Uint8Array(bs58.decode(str));
  },
  crypto_hash: function(content) {
    return sodium.crypto_hash(content);
  },

  async_sign: function(content, key) {
    return sodium.crypto_sign_detached(content, key);
  },
  async_verify: function(signature, content, key) {
    return sodium.crypto_sign_verify_detached(signature, content, key);
  },
  async_encrypt: function(content, pubkey) {
    return sodium.crypto_box_seal(content, pubkey);
  },
  async_decrypt: function(content, pubkey, prvkey) {
    return sodium.crypto_box_seal_open(content, pubkey, prvkey);
  },
  async_encrypt_sign: function(content, nonce, pubkey, prvkey) {
    return sodium.crypto_box_easy(content, nonce, pubkey, prvkey);
  },
  async_decrypt_verify: function(content, nonce, pubkey, prvkey) {
    return sodium.crypto_box_open_easy(content, nonce, pubkey, prvkey);
  },

  symNonceLen: function() {
    return sodium.libsodium._crypto_secretbox_noncebytes();
  },
  symNonce: function() {
    return sodium.randombytes_buf(sodium.libsodium._crypto_secretbox_noncebytes());
  },
  symKey: function() {
    return sodium.randombytes_buf(sodium.libsodium._crypto_secretbox_keybytes());
  },
  symEncrypt: function(content, key, nonce) {
    return sodium.crypto_secretbox_easy(content, nonce, key);
  },
  symDecrypt: function(content, key, nonce) {
    try {
      return sodium.crypto_secretbox_open_easy(content, nonce, key);
    } catch (err) {
      return null;
    }
  },

  hexToUint: hexString => new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16))),
  // uintToHex: bytes => bytes.map(byte => byte.toString(16).padStart(2, '0')).join(''),
  hexToBytes: function(hex) {
    const bytes = [];
    for (var c = 0; c < hex.length; c += 2)
      bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
  },
  bytesToHex: function(bytes) {
    const hex = [];
    for (var i = 0; i < bytes.length; i++) {
      hex.push((bytes[i] >>> 4).toString(16));
      hex.push((bytes[i] & 0xF).toString(16));
    }
    return hex.join("");
  },
  bytesToStr: function(bytes) {
    /* eslint-disable no-undef */
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(bytes);
  },
  to_base64: content => sodium.to_base64(content),
  base64ToBytes: function(base64url) {
    return Buffer.from(sodium.from_base64(base64url));
  },
  bytesToBase64: function(data) {
    return sodium.to_base64(data instanceof Uint8Array ? data : new Uint8Array(data));
  },
  randomBytes: len => {
    len = len || 32;
    return sodium.randombytes_buf(len);
  }
};

module.exports = async function crypto() {
  if (sodium)
    return _crypto;
  await _sodium.ready;
  sodium = _sodium;
  return _crypto;
};
