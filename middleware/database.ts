import { Db, MongoClient } from 'mongodb';

interface ConnectReturn {
    client: MongoClient;
    db: Db;
}

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.DB_NAME;

// check the MongoDB URI
if (!MONGODB_URI) {
    throw new Error('Define the MONGODB_URI environmental variable');
}

// check the MongoDB DB
if (!MONGODB_DB) {
    throw new Error('Define the MONGODB_DB environmental variable');
}

export async function connectToDatabase(): Promise<ConnectReturn> {
    const client = new MongoClient(MONGODB_URI || '');
    await client.connect();
    const db = client.db(MONGODB_DB);

    return {
        client,
        db,
    };
}
