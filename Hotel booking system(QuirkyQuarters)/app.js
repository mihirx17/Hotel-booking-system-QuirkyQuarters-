const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = 8000;
const fs=require('fs');
const MongoUrl = "mongodb://127.0.0.1:27017/wanderlust";
app.use(express.urlencoded({ extended: true }));
var methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.use("/", (req, res, next) => {
    const logData = `${req.method} ${new Date()}\n`;
    fs.appendFileSync('log.txt', logData);
    next();
});

const Listing = require('./models/listing');
const { error } = require('console');
app.set('view engine', 'ejs');
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

app.get("/Listing", async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index", { allListing });
});

app.get("/Listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show", { listing });
});
app.get("/Listing/new",async(req,res)=>{
    await res.render("listings/newListings");
})

app.get("/Listings/:id/Edit", async(req,res)=>{
    try{
        let id=req.params.id;
        console.log(id);
        const EditListings= await Listing.findById(id);
        console.log(EditListings);
        if(!EditListings)
        {
            res.status(500).send("Internal Server Problem");

        }
        await res.render("listings/edit",{EditListings});
    }catch(error)
    {
        console.log(error);
        res.status(500).send("Internal Server Problem");
    }
});

app.post("/Listings/New", async (req, res) => {
    try {
        let { title, description, price, location, country } = req.body;
        let newListings = new Listing({
            title: title,
            description: description,
            price: price,
            location: location,
            country: country
        });
        await newListings.save();
        console.log("Your newListings Has been saved...");
        res.redirect("/Listing");  // Redirect to the listing page after successful submission
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
app.put("/Listings/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const { title, description, price, location, country } = req.body;
        console.log(id);
        console.log(`Updated title is ${title}`);
        
        // Update the listing with the new data
        const updatedListing = await Listing.findByIdAndUpdate(id, {
            title: title,
            description: description,
            price: price,
            location: location,
            country: country
        }, { runValidators: true, new: true });

        if (!updatedListing) {
            return res.status(500).send("Internal Server Problem");
        }

        // Redirect to the chat page or any other desired page
        res.redirect("/Listing");
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Problem");
    }
});
app.listen(PORT, (err) => {
    if (err) {
        console.error("Some internal server error", err);
    } else {
        console.log("Listening on PORT " + PORT);
    }
});
