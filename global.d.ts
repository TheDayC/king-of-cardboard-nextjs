/* eslint-disable no-var */
import type { MongoClient } from 'mongodb';

declare global {
    var _mongoClientPromise: Promise<MongoClient>;
    /* interface Window {
        gtag?: any;
    } */
}
