const mongoose = require('mongoose');

require('dotenv').config();

const dropDatabase = async () => {
    // connect to mongo server
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Successfully connected to MongoDB.');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }

    // delete the entire database
    await mongoose.connection.db.dropDatabase();
    console.log('Database dropped.');

    // disconnect
    await mongoose.disconnect();
}

dropDatabase();