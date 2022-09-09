import { Injectable } from '@angular/core';

import { openDB, deleteDB, wrap, unwrap } from 'idb';

@Injectable({
  providedIn: 'root',
})
export class IndexDbService {

  dbName: string = 'myindexdb';
  collections = {
    contacts: 'contacts',
    tasks: 'tasks'
  };

  stores: any = {};
  dbVersion = 1;
  constructor() {

    this.init()
        .then(() => {})
        .catch(error => console.error(error));

  }

  async init () {
    const db = await openDB(this.dbName, this.dbVersion, {
        upgrade: async (db, oldVersion, newVersion, transaction) => {
            
            console.log(oldVersion, newVersion, transaction);

            const upgradeDB3fromV0toV1 = () => {
                db.createObjectStore(this.collections.contacts, { autoIncrement: true });
            };
            const upgradeDB3fromV1toV2 = () => {
                db.createObjectStore(this.collections.tasks, { keyPath: 'id' });
            };
            const upgradeDB3fromV2toV3 = async () => {
 
            };

            switch (oldVersion) {
              // @ts-ignore
              case 0:
                upgradeDB3fromV0toV1();
              // falls through
              case 1:
                upgradeDB3fromV1toV2();
                break;
              default:
                console.error('unknown db version');
            }

        },
      });

      this.stores[this.dbName] = db; // await openDB(this.dbName, this.dbVersion);

      // await db.deleteObjectStore(this.collections.contacts);
      // db.clear(this.collections.contacts);
      
  }

  async resetDB() {
    deleteDB(this.dbName);
    // await this.init();
    window.location.reload();
  }


  async clearData(collection: any) {
    const db = await this.getDbInstance();
    await db.clear(collection);
    
  }

  async getDbInstance() {

    if (this.stores[this.dbName]) {
      return this.stores[this.dbName];
    }

    this.stores[this.dbName] = await openDB(this.dbName, this.dbVersion);
    return this.stores[this.dbName];

  }

  /************************************************************************************************
   * Insert and Update
   ************************************************************************************************/
  async insert(collectionName: string, key: any, value: any) {

    const db = await this.getDbInstance();
    await db.add(collectionName, value, key);

  }
  async update(collectionName: string, key: any, value: any) {
    const db = await this.getDbInstance();
    await db.put(collectionName, value, key);
  }

  /************************************************************************************************
   * Insert update without keys
   ************************************************************************************************/
  async insertAutoKey(collectionName: string, value: any) {
    const db = await this.getDbInstance();
    await db.add(collectionName, value);
  }

  async updateAutoKey(collectionName: string, value: any) {
    const db = await this.getDbInstance();
    await db.put(collectionName, value);
  }
  
  /************************************************************************************************
   * Retrieve data
   ************************************************************************************************/
  async get(collectionName: string, key: any) {
    const db = await this.getDbInstance();
    const item = await db.get(collectionName, key);
    return item;
  }

  async getAll(collectionName: string) {
    const db = await this.getDbInstance();
    const list = await db.getAll(collectionName);
    return list;
  }

  async count(collectionName: string) {

    const db = await this.getDbInstance();
    const list = await db.count(collectionName);
    return list;
  }

  /************************************************************************************************
   * Remove data
   ************************************************************************************************/
  async delete(collectionName: string, value: any) {

    const db = await this.getDbInstance();
    const list = await db.delete(collectionName, value);
    return list;
  }
  demo1() {
    openDB('db1', 1, {
      upgrade(db) {
        db.createObjectStore('store1');
        db.createObjectStore('store2');
      },
    });
    openDB('db2', 1, {
      upgrade(db) {
        db.createObjectStore('store3', { keyPath: 'id' });
        db.createObjectStore('store4', { autoIncrement: true });
      },
    });
  }

}