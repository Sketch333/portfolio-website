import { MongoClient } from 'mongodb';
import { getMongoEnv } from '@/lib/ai/env';

let clientPromise: Promise<MongoClient> | undefined;

/** CLI cleanup only; server requests retain the cached connection. */
export async function closeMongoConnection() {
  const pending = clientPromise;
  clientPromise = undefined;
  if (pending) await (await pending).close();
}

/** Only explicit server database calls read credentials or open a connection. */
export async function getMongoDb() {
  const { MONGODB_URI, MONGODB_DB } = getMongoEnv();
  if (!clientPromise) {
    clientPromise = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 5000 }).connect().catch((error: unknown) => {
      clientPromise = undefined;
      throw error;
    });
  }
  return (await clientPromise).db(MONGODB_DB);
}
