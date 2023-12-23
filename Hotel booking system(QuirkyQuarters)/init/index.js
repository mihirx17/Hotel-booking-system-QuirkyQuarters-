const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MongoUrl = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to DB");
    return initDB();
  })
  .then(() => {
    console.log("Data was initialized");
  })
  .catch((err) => {
    console.error("Error:", err);
  })
  .finally(() => {
    mongoose.connection.close();
  });

async function main() {
  try {
    await mongoose.connect(MongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
  } catch (error) {
    throw new Error(`Error connecting to DB: ${error.message}`);
  }
}

async function initDB() {
  try {
    await Listing.deleteMany({});
    const modifiedData = initData.data.map((item) => ({
      ...item,
      image: item.image.url, // Assuming 'url' contains the string URL
    }));
    await Listing.insertMany(modifiedData);
  } catch (error) {
    throw new Error(`Error initializing data: ${error.message}`);
  }
}
