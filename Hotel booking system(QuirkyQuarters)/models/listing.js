const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        // Corrected typo from 'require' to 'required'
    },
    listing: String, // It seems like you intended 'listing' to be a type String, if not, adjust accordingly
    description: String,
    image: {
        type: String,
        default: "https://unsplash.com/photos/a-man-and-a-woman-are-kissing-on-a-rock-kl5OFLU0fEo",
        set: (v) => (v === "" ? "https://unsplash.com/photos/a-man-and-a-woman-are-kissing-on-a-rock-kl5OFLU0fEo" : v),
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
