const mongoose = require('mongoose');

async function checkLocal() {
  const LOCAL_URI = 'mongodb://localhost:27017/Loanexp';
  try {
    console.log('Connecting to local MongoDB...');
    await mongoose.connect(LOCAL_URI, { serverSelectionTimeoutMS: 2000 });
    console.log('Connected!');

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in local Loanexp:', collections.map(c => c.name));

    if (collections.find(c => c.name === 'agentprofiles')) {
       const docs = await mongoose.connection.db.collection('agentprofiles').find({}).toArray();
       console.log('Documents in agentprofiles:', JSON.stringify(docs, null, 2));
    } else {
       console.log('agentprofiles collection not found locally.');
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('Local MongoDB Connection Failed:', err.message);
  }
}

checkLocal();
