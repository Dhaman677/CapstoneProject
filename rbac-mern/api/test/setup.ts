// api/test/setup.ts
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import path from "path";

jest.setTimeout(120_000); // plenty for first binary download on Windows

let mongo: MongoMemoryServer | null = null;

beforeAll(async () => {
  // Cache the MongoDB binary so subsequent runs are fast
  mongo = await MongoMemoryServer.create({
    binary: {
      version: "7.0.5",
      downloadDir: path.join(__dirname, ".mongo-binaries"),
    },
    // You can force a free port with instance: { port: 0 } if needed
  });

  const uri = mongo.getUri();

  // Use a test secret so your code that expects JWT_SECRET is happy
  process.env.JWT_SECRET = "test-secret";
  process.env.NODE_ENV = "test";

  // Make sure we *actually* wait for a successful server selection
  await mongoose.connect(uri, {
    dbName: "rbac_test",
    serverSelectionTimeoutMS: 60_000, // fail if server not ready in 60s
  } as any);

  // Ping to guarantee the connection is fully open
  await mongoose.connection.db.admin().ping();
});

afterEach(async () => {
  if (mongoose.connection.readyState !== 1) return;
  const collections = await mongoose.connection.db.collections();
  await Promise.all(collections.map((c) => c.deleteMany({})));
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
  }
  if (mongo) {
    await mongo.stop();
    mongo = null;
  }
});
