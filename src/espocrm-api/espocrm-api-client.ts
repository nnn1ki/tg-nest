import * as crypto from 'crypto';
import * as querystring from 'querystring';
import * as http from 'http'; // или 'https', в зависимости от протокола вашего EspoCRM-сервера

class Client {
    private url: string;
    private apiKey: string;
    private secretKey?: string;
    private options: any;
    private urlPath: string;
    private isHttps: boolean;

    constructor(url: string, apiKey: string, secretKey?: string, options?: any) {
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

    public async request(method: string, action: string, data?: any): Promise<any> {
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

            let postData = "";

            if (data) {
                if (method === 'GET') {
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

                const h = this.isHttps ? require('https') : require('http');

                const req = h.request(url, o, (res: any) => {
                    let responseData = '';

                    res.on('data', (chunk: any) => {
                        responseData += chunk;
                    });

                    res.on('end', () => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            reject(res);
                            return;
                        }

                        try {
                            responseData = JSON.parse(responseData);
                        } catch (e) {
                            console.error(`Error: Could not parse response`);
                            reject({});
                            return;
                        }

                        // resolve(responseData, res);
                        resolve(responseData);
                    });
                });

                req.on('error', (e: any) => {
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

export = Client;
