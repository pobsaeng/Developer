/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const fs = require("fs");
class TokenCache {
    constructor(_credentialProvider, _credentialServiceKey, _cacheSerializationPath) {
        this._credentialProvider = _credentialProvider;
        this._credentialServiceKey = _credentialServiceKey;
        this._cacheSerializationPath = _cacheSerializationPath;
    }
    // PUBLIC METHODS //////////////////////////////////////////////////////
    add(entries, callback) {
        let self = this;
        this.doOperation(() => {
            return self.readCache()
                .then(cache => self.addToCache(cache, entries))
                .then(updatedCache => self.writeCache(updatedCache))
                .then(() => callback(null, false), (err) => callback(err, true));
        });
    }
    clear() {
        let self = this;
        // 1) Delete encrypted serialization file
        //    If we got an 'ENOENT' response, the file doesn't exist, which is fine
        // 3) Delete the encryption key
        return new Promise((resolve, reject) => {
            fs.unlink(self._cacheSerializationPath, err => {
                if (err && err.code !== 'ENOENT') {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        })
            .then(() => { return self._credentialProvider.deleteCredential(self._credentialServiceKey); })
            .then(() => { });
    }
    find(query, callback) {
        let self = this;
        this.doOperation(() => {
            return self.readCache()
                .then(cache => {
                return cache.filter(entry => TokenCache.findByPartial(entry, query));
            })
                .then(results => callback(null, results), (err) => callback(err, null));
        });
    }
    /**
     * Wrapper to make callback-based find method into a thenable method
     * @param query Partial object to use to look up tokens. Ideally should be partial of adal.TokenResponse
     * @returns {Thenable<any[]>} Promise to return the matching adal.TokenResponse objects.
     *     Rejected if an error was sent in the callback
     */
    findThenable(query) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.find(query, (error, results) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(results);
                }
            });
        });
    }
    remove(entries, callback) {
        let self = this;
        this.doOperation(() => {
            return this.readCache()
                .then(cache => self.removeFromCache(cache, entries))
                .then(updatedCache => self.writeCache(updatedCache))
                .then(() => callback(null, null), (err) => callback(err, null));
        });
    }
    /**
     * Wrapper to make callback-based remove method into a thenable method
     * @param {TokenResponse[]} entries Array of entries to remove from the token cache
     * @returns {Thenable<void>} Promise to remove the given tokens from the token cache
     *     Rejected if an error was sent in the callback
     */
    removeThenable(entries) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.remove(entries, (error, result) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve();
                }
            });
        });
    }
    // PRIVATE METHODS /////////////////////////////////////////////////////
    static findByKeyHelper(entry1, entry2) {
        return entry1._authority === entry2._authority
            && entry1._clientId === entry2._clientId
            && entry1.userId === entry2.userId
            && entry1.resource === entry2.resource;
    }
    static findByPartial(entry, query) {
        for (let key in query) {
            if (entry[key] === undefined || entry[key] !== query[key]) {
                return false;
            }
        }
        return true;
    }
    doOperation(op) {
        // Initialize the active operation to an empty promise if necessary
        let activeOperation = this._activeOperation || Promise.resolve(null);
        // Chain the operation to perform to the end of the existing promise
        activeOperation = activeOperation.then(op);
        // Add a catch at the end to make sure we can continue after any errors
        activeOperation = activeOperation.then(null, err => {
            console.error(`Failed to perform token cache operation: ${err}`);
        });
        // Point the current active operation to this one
        this._activeOperation = activeOperation;
    }
    addToCache(cache, entries) {
        // First remove entries from the db that are being updated
        cache = this.removeFromCache(cache, entries);
        // Then add the new entries to the cache
        entries.forEach((entry) => {
            cache.push(entry);
        });
        return cache;
    }
    getOrCreateEncryptionParams() {
        let self = this;
        return this._credentialProvider.readCredential(this._credentialServiceKey)
            .then(credential => {
            if (credential.password) {
                // We already have encryption params, deserialize them
                let splitValues = credential.password.split('|');
                if (splitValues.length === 2 && splitValues[0] && splitValues[1]) {
                    try {
                        return {
                            key: new Buffer(splitValues[0], 'hex'),
                            initializationVector: new Buffer(splitValues[1], 'hex')
                        };
                    }
                    catch (e) {
                        // Swallow the error and fall through to generate new params
                        console.warn('Failed to deserialize encryption params, new ones will be generated.');
                    }
                }
            }
            // We haven't stored encryption values, so generate them
            let encryptKey = crypto.randomBytes(TokenCache.CipherKeyLength);
            let initializationVector = crypto.randomBytes(TokenCache.CipherAlgorithmIvLength);
            // Serialize the values
            let serializedValues = `${encryptKey.toString('hex')}|${initializationVector.toString('hex')}`;
            return self._credentialProvider.saveCredential(self._credentialServiceKey, serializedValues)
                .then(() => {
                return {
                    key: encryptKey,
                    initializationVector: initializationVector
                };
            });
        });
    }
    readCache() {
        let self = this;
        // NOTE: File system operations are performed synchronously to avoid annoying nested callbacks
        // 1) Get the encryption key
        // 2) Read the encrypted token cache file
        // 3) Decrypt the file contents
        // 4) Deserialize and return
        return this.getOrCreateEncryptionParams()
            .then(encryptionParams => {
            try {
                return self.decryptCache('utf8', encryptionParams);
            }
            catch (e) {
                try {
                    // try to parse using 'binary' encoding and rewrite cache as UTF8
                    let response = self.decryptCache('binary', encryptionParams);
                    self.writeCache(response);
                    return response;
                }
                catch (e) {
                    throw e;
                }
            }
        })
            .then(null, err => {
            // If reading the token cache fails, we'll just assume the tokens are garbage
            console.warn(`Failed to read token cache: ${err}`);
            return [];
        });
    }
    decryptCache(encoding, encryptionParams) {
        let cacheCipher = fs.readFileSync(this._cacheSerializationPath, TokenCache.FsOptions);
        let decipher = crypto.createDecipheriv(TokenCache.CipherAlgorithm, encryptionParams.key, encryptionParams.initializationVector);
        let cacheJson = decipher.update(cacheCipher, 'hex', encoding);
        cacheJson += decipher.final(encoding);
        // Deserialize the JSON into the array of tokens
        let cacheObj = JSON.parse(cacheJson);
        for (let objIndex in cacheObj) {
            // Rehydrate Date objects since they will always serialize as a string
            cacheObj[objIndex].expiresOn = new Date(cacheObj[objIndex].expiresOn);
        }
        return cacheObj;
    }
    removeFromCache(cache, entries) {
        entries.forEach((entry) => {
            // Check to see if the entry exists
            let match = cache.findIndex(entry2 => TokenCache.findByKeyHelper(entry, entry2));
            if (match >= 0) {
                // Entry exists, remove it from cache
                cache.splice(match, 1);
            }
        });
        return cache;
    }
    writeCache(cache) {
        let self = this;
        // NOTE: File system operations are being done synchronously to avoid annoying callback nesting
        // 1) Get (or generate) the encryption key
        // 2) Stringify the token cache entries
        // 4) Encrypt the JSON
        // 3) Write to the file
        return this.getOrCreateEncryptionParams()
            .then(encryptionParams => {
            try {
                let cacheJson = JSON.stringify(cache);
                let cipher = crypto.createCipheriv(TokenCache.CipherAlgorithm, encryptionParams.key, encryptionParams.initializationVector);
                let cacheCipher = cipher.update(cacheJson, 'utf8', 'hex');
                cacheCipher += cipher.final('hex');
                fs.writeFileSync(self._cacheSerializationPath, cacheCipher, TokenCache.FsOptions);
            }
            catch (e) {
                throw e;
            }
        });
    }
}
TokenCache.CipherAlgorithm = 'aes256';
TokenCache.CipherAlgorithmIvLength = 16;
TokenCache.CipherKeyLength = 32;
TokenCache.FsOptions = { encoding: 'ascii' };
exports.default = TokenCache;
//# sourceMappingURL=https://ticino.blob.core.windows.net/sourcemaps/887f4e8985023602e599cf86bdb44df48bb28569/extensions/azurecore/out/account-provider/tokenCache.js.map
