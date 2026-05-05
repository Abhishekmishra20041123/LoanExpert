const mongoose = require('mongoose');
const fs = require('fs');

async function migrateData() {
  const LOCAL_URI = 'mongodb://localhost:27017/Loanexp';
  
  // Load ATLAS_URI from .env
  const envContent = fs.readFileSync('.env', 'utf-8');
  const ATLAS_URI = envContent.match(/MONGODB_URL=(.*)/)[1].trim();

  try {
    console.log('Connecting to LOCAL database...');
    const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
    console.log('Connected to Local!');

    const AgentProfileLocal = localConn.model('AgentProfile', new mongoose.Schema({}, { strict: false }), 'agentprofiles');
    const profile = await AgentProfileLocal.findOne({ key: 'main' }).lean();

    if (!profile) {
      console.log('No "main" profile found in local database.');
      await localConn.close();
      return;
    }

    console.log('Found profile for:', profile.fullName);
    console.log('Connecting to ATLAS database...');
    const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
    console.log('Connected to Atlas!');

    const AgentProfileAtlas = atlasConn.model('AgentProfile', new mongoose.Schema({}, { strict: false }), 'agentprofiles');
    
    // Remote original _id to avoid collision
    delete profile._id;
    if (profile.__v) delete profile.__v;

    await AgentProfileAtlas.findOneAndUpdate({ key: 'main' }, profile, { upsert: true, new: true });
    console.log('Successfully migrated About page data to Atlas!');

    await localConn.close();
    await atlasConn.close();
  } catch (err) {
    console.error('Migration failed:', err.message);
  }
}

migrateData();
