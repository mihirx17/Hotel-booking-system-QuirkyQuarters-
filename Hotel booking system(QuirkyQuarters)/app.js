const express = require('express');
const mongoose = require('mongoose');
const path=require("path");
const app = express();
const PORT = 8000;
const MongoUrl = "mongodb://127.0.0.1:27017/wanderlust";
app.use(express.urlencoded({extended:true}));
// Assuming you have a Listing model defined
const Listing = require('./models/listing'); // Replace with the actual path to your Listing model
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));
async function main() {
    try {
        await mongoose.connect(MongoUrl);
        console.log("Connected to MongoDB Database");
    } catch (error) {
        console.error("Internal Server Problem", error);
    }
}

main();

// app.get("/testListing", async (req, res) => {
//     try {
//         let sampleListing = new Listing({
//             title: "My Food House",
//             description: "Eat only",
//             price: 2000,
//             location: "My bed",
//             country: "India",
//         });

//         await sampleListing.save();
//         console.log("Sample listing was saved");
//         res.send("Successful Testing");
//     } catch (error) {
//         console.error("Error saving sample listing", error);
//         res.status(500).send("Internal Server Error");
//     }
// });
app.get("/Listing",async (req,res)=>{
   const allListing= await Listing.find({});
        res.render("listings/index",{allListing});
    });

    app.get("/Listings/:id",async (req,res)=>{
        let {id}=req.params;
        const listing =await Listing.findById(id);
        res.render("listings/show",{listing});

    })


app.listen(PORT, (err) => {
    if (err) {
        console.error("Some internal server error", err);
    } else {
        console.log("Listening on PORT " + PORT);
    }
});
