'use strict';
/* eslint-disable */
var request = require("request");
const logger = require('log4js').getLogger('ng-rt-digitalAsset-sdk.SC_Explorer');
const { apiUtil } = require('ng-rt-digitalAsset-sdk');
const args = require('yargs').argv;

const templateName = ['SC_HelloWorld_Part1', 'SC_HelloWorld_Part2', 'SC_HelloWorld_Part3'];
let data = ['Hello World', 'Hello', 'Hi, i am Here'];
var url = args.url;
if (!url) {
    throw new Error('Please set your URL by --url=YOUR_URL');
}
var contracts = args.contracts;
if (!contracts) {
    throw new Error('Please set number of contracts you want to post by --contracts=NO_OF_CONTRACTS');
}
var appkey = args.appkey;
if (!appkey) {
    throw new Error('Please set your appkey for authentication by --appkey=YOUR_APPKEY');
}

var options = {
    method: 'POST',
    url: url + '/auth/applogin',
    form:
    {
        appID: 'ng-rt-smartContracts',
        appKey: appkey
    },
    headers: {
        'Content-Type': 'application/json'
    },
    json: true
};
const createContracts = async () => {
    let token = await apiUtil.getToken(options);
    for (let i = 1; i <= contracts; i++) {
        if (i % 20 === 0) {
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
        var options1 = {
            method: 'POST',
            url: url + `/ng-rt-smartContracts/contracts/app/${templateName[Math.floor(Math.random() * templateName.length)]}`,
            headers:
            {
                'content-type': 'application/json',
                'Authorization': `JWT ${token}`
            },
            body:
            {
                args: data[Math.floor(Math.random() * data.length)],
                pubKey: '8HouGB1piizDEsREbRHYgPXZyxR5RYzSbWUYmuNSbSNd',
                clientSigning: false
            },
            json: true
        };

        request(options1, function (error, response, body) {
            logger.debug(body);
        })
    }
}
createContracts();

