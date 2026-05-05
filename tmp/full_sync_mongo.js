const mongoose = require('mongoose');
const fs = require('fs');

async function migrateAllData() {
  const LOCAL_URI = 'mongodb://localhost:27017/Loanexp';
  
  // Load ATLAS_URI from .env
  const envContent = fs.readFileSync('.env', 'utf-8');
  const ATLAS_URI_MATCH = envContent.match(/MONGODB_URL=(.*)/);
  if (!ATLAS_URI_MATCH) {
    console.error('Could not find MONGODB_URL in .env');
    return;
  }
  const ATLAS_URI = ATLAS_URI_MATCH[1].trim();

  try {
    console.log('Connecting to LOCAL database...');
    const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
    const collections = await localConn.db.listCollections().toArray();
    console.log(`Found ${collections.length} collections in LOCAL database.`);

    console.log('Connecting to ATLAS database...');
    const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
    console.log('Connected to ATLAS!');

    for (const collInfo of collections) {
      const collName = collInfo.name;
      if (collName.startsWith('system.')) continue; // Skip system collections

      console.log(`Migrating collection: ${collName}...`);
      const localColl = localConn.db.collection(collName);
      const atlasColl = atlasConn.db.collection(collName);

      const docs = await localColl.find({}).toArray();
      if (docs.length === 0) {
        console.log(`  - No documents found in ${collName}. Skipping.`);
        continue;
      }

      console.log(`  - Clearing Atlas ${collName}...`);
      await atlasColl.deleteMany({});
      
      console.log(`  - Copying ${docs.length} documents...`);
      await atlasColl.insertMany(docs);
      console.log(`  - Successfully migrated ${collName}.`);
    }

    console.log('\nMigration Task Complete!');
    await localConn.close();
    await atlasConn.close();
  } catch (err) {
    console.error('Migration failed:', err.message);
  }
}

migrateAllData();
