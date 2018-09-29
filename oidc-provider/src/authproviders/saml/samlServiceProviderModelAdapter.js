const cacheStore = new Map();

class ServiceProviderModelAdapter {
  constructor(samlConfiguration) {
    this.spCfg = samlConfiguration.spConfig;
    this.idpCfg = samlConfiguration.idpConfig;
  }

  key() {
    return this.idpCfg.idpEntityId;
  }

  get(key) {
    this.key();
    const modelObject = cacheStore.get(key);
    return modelObject;
  }


  add(key, modelObject) {
    this.key();
    cacheStore.set(key, modelObject);
  }

  update(key, modelObject) {
    this.key();
    cacheStore.set(key, modelObject);
  }

  remove(key) {
    this.key();
    cacheStore.delete(key);
  }


  showActiveSessions() {
    this.key();
    // console.log(`ServiceProviderModelAdapter : showActiveSessions ${JSON.stringify(cacheStore, null, 4)}`);
  }

  async find(requestID) {
    this.showActiveSessions();
    return Promise.resolve(this.get(requestID));
  }

  async upsert(requestID, samlRandomIDObj) {
    // this.key(requestID);
    // cacheStore[key] = Object.assign({}, Object.values(samlRandomIDObj));
    this.add(requestID, samlRandomIDObj);
    this.showActiveSessions();
    return Promise.resolve();
  }

  async getIdentityProvider(idpEntityId) { // SP REQUIRED
    // assert(this.idpCfg.idpEntityId === idpEntityId, 'idp Entity Id mismatch');
    return Promise.resolve(this.idpCfg);
  }

  async storeRequestID(requestID, idpEntityId) { // SP REQUIRED
    const samlRandomIDObj = {
      requestID,
      idp: {
        entityID: idpEntityId,
      },
    };
    this.showActiveSessions();
    this.upsert(requestID, samlRandomIDObj);
    return Promise.resolve();
  }

  async verifyRequestID(requestID, idpEntityId) { // SP REQUIRED
    const samlRandomIDObj = await this.find(requestID);
    this.showActiveSessions();
    if (samlRandomIDObj && samlRandomIDObj.requestID === requestID && samlRandomIDObj.idp.entityID === idpEntityId) {
      return Promise.resolve();
    }
    return Promise.reject();
  }

  async invalidateRequestID(requestID, idpEntityId) { // SP OPTIONAL
    const samlRandomIDObj = await this.find(requestID);
    this.showActiveSessions();
    if (samlRandomIDObj && samlRandomIDObj.requestID === requestID && samlRandomIDObj.idp.entityID === idpEntityId) {
      this.remove(requestID);
    }
    return Promise.resolve();
  }

  getNow() {
    return this.now || new Date();
  }
}

module.exports = ServiceProviderModelAdapter;
