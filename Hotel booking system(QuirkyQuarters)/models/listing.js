const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true // Corrected typo from 'require' to 'required'
    },
    listing: String, // It seems like you intended 'listing' to be a type String, if not, adjust accordingly
    description: String,
    image: {
        type: String,
        default: "https://unsplash.com/photos/a-man-and-a-woman-are-kissing-on-a-rock-kl5OFLU0fEo",
        set: (v) => (v === "" ? "https://unsplash.com/photos/a-man-and-a-woman-are-kissing-on-a-rock-kl5OFLU0fEo" : v),
    },
    price: {
        type: Number,
        default: 0 // Provide a default value for price, adjust as needed
    },
    location: String,
    country: String,
    review: [ {
        type: Schema.Types.ObjectId,
        ref: "Review" // Make sure this matches the name of your Review model
    }]
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
