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
                db.createObjectStore(this.collections.tasks);
            };
            const upgradeDB3fromV2toV3 = async () => {
 
            };

            if (oldVersion === 0) {
                upgradeDB3fromV0toV1();
                upgradeDB3fromV1toV2();
            }

            if (oldVersion === 1) {
                upgradeDB3fromV1toV2();
            }

        },
      });
      db.close();
  }

  async insert(collectionName: string, key: any, value: any) {

    const db = await openDB(this.dbName, 1);
    await db.add(collectionName, value, key);
    db.close();

  }

  async insertAutoKey(collectionName: string, value: any) {

    const db = await openDB(this.dbName, 1);
    await db.add(collectionName, value);
    db.close();

  }
  
  async get(collectionName: string, key: any) {
    const db = await openDB(this.dbName, this.dbVersion);
    // retrieve by key:
    const item = await db.get(collectionName, key);
    return item;
  }

  async getAll(collectionName: string) {
    const db = await openDB(this.dbName, this.dbVersion);
    // retrieve by key:
    const list = await db.getAll(collectionName);
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