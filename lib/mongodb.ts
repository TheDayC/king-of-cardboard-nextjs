/* eslint-disable @typescript-eslint/ban-ts-comment */
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB = process.env.DB_NAME || '';
const isDev = process.env.NODE_ENV === 'development';

if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env.local');
}

const client = new MongoClient(MONGODB_URI);

if (isDev && !global._mongoClientPromise) {
    global._mongoClientPromise = client.connect();
}

const clientPromise = isDev ? global._mongoClientPromise : client.connect();

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
