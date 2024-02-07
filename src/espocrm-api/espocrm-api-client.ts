import * as crypto from 'crypto';
import * as http from 'http';
import * as https from 'https';
import {Controller, Get} from "@nestjs/common";


export default class Client {
    private url: string;
    private apiKey: string;
    private secretKey: string;
    private options: any;
    private urlPath: string;
    private isHttps: boolean;

    constructor(url: string, apiKey: string, secretKey: string, options?: any) {
        this.url = url;
        this.apiKey = apiKey;
        this.secretKey = secretKey;

        if (this.url.substr(-1) === '/') {
            this.url = this.url.substr(0, this.url.length - 1);
        }

        this.options = options || {};

        this.urlPath = '/api/v1/';
        this.isHttps = url.toLowerCase().indexOf('https') === 0;
    }


    request(method: string, action: string, data: any): Promise<any> {
        method = method || 'GET';
        method = method.toUpperCase();

        let url = this._buildUrl(action);

        let headers: any = {};

        if (this.apiKey && this.secretKey) {
            let string = method + ' /' + action;

            let b2 = crypto
                .createHmac('sha256', this.secretKey)
                .update(string)
                .digest();

            let b1 = Buffer.from(this.apiKey + ':');

            let authPart = Buffer.concat([b1, b2]).toString('base64');

            headers['X-Hmac-Authorization'] = authPart;
        } else if (this.apiKey) {
            headers['X-Api-Key'] = this.apiKey;
        } else {
            throw new Error('Api-Key is not set.');
        }

        let postData: string | undefined;

        if (data) {
            if (method === 'GET') {
                const querystring = require('querystring');
                url += '?' + querystring.stringify({ searchParams: JSON.stringify(data) });
            } else {
                postData = JSON.stringify(data);

                headers['Content-Type'] = 'application/json';
                headers['Content-Length'] = Buffer.byteLength(postData);
            }
        }

        return new Promise((resolve, reject) => {
            let o: any = {
                headers: headers,
                method: method,
            };

            if (this.options.port) {
                o.port = this.options.port;
            }

            if (this.options.timeout) {
                o.timeout = this.options.timeout;
            }

            const h = this.isHttps ? https : http;

            const req = h.request(url, o, (res) => {
                let responseData = '';

                res.on('data', (chunk) => {
                    responseData += chunk;
                });

                res.on('end', () => {
                    // if (res.statusCode > 299 || res.statusCode < 200) {
                    //     reject(res);
                    //
                    //     return;
                    // }
                    // reject(res);
                    try {
                        responseData = JSON.parse(responseData);
                    } catch (e) {
                        console.error(`Error: Could not parse response`);
                        reject({});

                        return;
                    }

                    resolve(responseData);
                });
            });

            req.on('error', (e) => {
                console.error(`Error: ${e.message}`);
                reject(e);
            });

            if (data && method !== 'GET') {
                req.write(postData);
            }

            req.end();
        });
    }

    private _buildUrl(action: string): string {
        return this.url + this.urlPath + action;
    }
}

// // export = Client;


// class Client {
//
//     constructor (url, apiKey, secretKey, options) {
//         this.url = url;
//         this.apiKey = apiKey;
//         this.secretKey = secretKey;
//
//         if (this.url.substr(-1) === '/') {
//             this.url = this.url.substr(0, this.url.length -1);
//         }
//
//         this.options = options || {};
//
//         this.urlPath = '/api/v1/';
//         this.isHttps = url.toLowerCase().indexOf('https') === 0;
//     }
//
//     request (method, action, data) {
//         method = method || 'GET';
//         method = method.toUpperCase();
//
//         let url = this._buildUrl(action);
//
//         let headers = {};
//
//         if (this.apiKey && this.secretKey) {
//             let string = method + ' /' + action;
//
//             const crypto = require('crypto');
//
//             let b2 = crypto
//                 .createHmac('sha256', this.secretKey)
//                 .update(string)
//                 .digest();
//
//             let b1 = Buffer.from(this.apiKey + ':');
//
//             let authPart = Buffer.concat([b1, b2]).toString('base64');
//
//             headers['X-Hmac-Authorization'] = authPart;
//         }
//         else if (this.apiKey) {
//             headers['X-Api-Key'] = this.apiKey;
//         }
//         else {
//             throw new Error('Api-Key is not set.');
//         }
//
//         let postData;
//
//         if (data) {
//             if (method === 'GET') {
//                 const querystring = require('querystring');
//
//                 url += '?' + querystring.stringify({searchParams: JSON.stringify(data)});
//             }
//             else {
//                 postData = JSON.stringify(data);
//
//                 headers['Content-Type'] = 'application/json';
//                 headers['Content-Length'] = Buffer.byteLength(postData);
//             }
//         }
//
//         return new Promise((resolve, reject) => {
//             let o = {
//                 headers: headers,
//                 method: method,
//             };
//
//             if (this.options.port) {
//                 o.port = this.options.port;
//             }
//
//             if (this.options.timeout) {
//                 o.timeout = this.options.timeout;
//             }
//
//             const h = this.isHttps ? require('https') : require('http');
//
//             const req = h.request(url, o, res => {
//                 let data = '';
//
//                 res.on('data', chunk => {
//                     data += chunk;
//                 });
//
//                 res.on('end', () => {
//                     if (res.statusCode < 200 || res.statusCode > 299) {
//                         reject(res);
//
//                         return;
//                     }
//
//                     try {
//                         data = JSON.parse(data);
//                     }
//                     catch (e) {
//                         console.error(`Error: Could not parse response`);
//                         reject({});
//
//                         return;
//                     }
//
//                     resolve(data, res);
//                 });
//             });
//
//             req.on('error', e => {
//                 console.error(`Error: ${e.message}`);
//                 reject(e);
//             });
//
//             if (data && method !== 'GET') {
//                 req.write(postData);
//             }
//
//             req.end();
//         });
//     }
//
//     _buildUrl (action) {
//         return this.url + this.urlPath + action;
//     }
// }
//
// if (module && module.exports) {
//     module.exports = Client;
// }