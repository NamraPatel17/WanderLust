require("dotenv").config();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mongoUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongoUrl);
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    
    // Transform the data to match MongoDB schema
    const transformedData = initData.data.map((listing) => ({
      title: listing.title,
      description: listing.description,
      image: {
        filename: listing.image.filename,
        url: listing.image.url
      },
      price: listing.price,
      location: listing.location,
      country: listing.country,
      reviews: listing.reviews.map(review => review.$oid), // Convert $oid to string
      owner: listing.owner.$oid, // Convert $oid to string
      category: listing.category
    }));
    
    await Listing.insertMany(transformedData);
    console.log("Database seeded successfully with", transformedData.length, "listings");
  } catch (error) {
    console.error("Error initializing DB:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
};

initDB();
