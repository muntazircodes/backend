// import { MongoMemoryServer } from 'mongodb-memory-server';
// import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import sinon from 'sinon';

// beforeAll(async () => {
//     const mongod = await MongoMemoryServer.create();

//     await mongoose.connect(mongod.getUri());
// });

// afterAll(async () => {
//     await mongoose.disconnect();
//     await mongoose.connection.close();
// });

afterEach(() => {
    sinon.restore();
});
