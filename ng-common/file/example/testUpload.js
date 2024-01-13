'use strict';
/* eslint-disable no-console */
const request = require('request-promise-any');
const fs = require('fs');

/**
 * Get session token.
 * @return {Promise<token>} Session token
 */
async function getToken() {
  const options = {
    uri: 'https://dev-2.0.project.com/auth/login',
    method: 'POST',
    body: {
      isLdap: false,
      password: "project.design",
      remember_me: false,
      username: "user1"
    },
    contentType: 'application/json',
    json: true
  };
  const res = await request(options);
  return res.token;
}

/**
 * Get access token by session token.
 * @return {Promise<string>} JWT token as value for HTTP header
 */
async function getJwtToken() {
  const token = await getToken();
  const options = {
    uri: 'https://dev-2.0.project.com/auth/access',
    method: 'POST',
    body: {
      token
    },
    contentType: 'application/json',
    json: true
  };
  const res = await request(options);
  return `JWT ${res.token}`;
}

const httpModule = {
  async rawUpload(uri, content, headers) {
    const jwtToken = await getJwtToken();
    const options = {};
    options.uri = `https://dev-2.0.project.com${uri}`;
    options.headers = {
      "authorization": jwtToken,
      'content-type': 'application/octet-stream',
      ...headers
    };
    options.body = content;
    options.method = 'POST';
    const res = await request(options);
    console.log(res);
  }
};

const fileService = require('./index').fileService({}, httpModule);

/**
 * Upload test content
 * @return {any} something
 */
async function upload() {
  const content = await readFile();
  const file = {
    key: new Uint8Array([76, 143, 26, 127, 222, 180, 21, 150, 49, 215, 100, 32, 177, 185, 240, 248, 78, 1, 168, 152, 226, 219, 33, 198, 60, 7, 174, 81, 162, 167, 112, 105]),
    content,
    size: 2404,
    blocksCount: 1
  };
  return fileService.upload(file, true);
}

/**
 * Read index.js file.
 * @return {Promise<any>} data
 */
function readFile() {
  return new Promise((resolve, reject) => {
    fs.readFile('index.js', (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

upload().then(res => console.log('res:', res)).catch(err => console.log('err:', err));
