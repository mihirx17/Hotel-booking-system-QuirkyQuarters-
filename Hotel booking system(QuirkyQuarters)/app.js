const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = 8000;
const ip=require('ip');
const fs=require('fs');
const ejsMate=require("ejs-mate");
const MongoUrl = "mongodb://127.0.0.1:27017/wanderlust";
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.set('trust proxy', true);

app.use(express.urlencoded({ extended: true }));
var methodOverride = require('method-override');
app.use(methodOverride('_method'));

const ipv4Address = ip.address();
app.use("/", (req, res, next) => {
    const logData = `${req.method} ${req.url},|| pv4Address:${ipv4Address}|| ${new Date()}\n`;

    // Use asynchronous file writing to avoid blocking the event loop
    fs.appendFile('log.txt', logData, (err) => {
        if (err) {
            console.error(`Error writing to log file: ${err}`);
        }

        // Continue to the next middleware or route
        next();
    });
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
app.delete("/Listings/:id", async (req, res) => {
    try {
        const deleteID = req.params.id;
        
        // Use await to make sure the deletion is completed before redirecting
        const deleteListing = await Listing.findByIdAndDelete(deleteID);

        if (!deleteListing) {
            return res.status(404).send("Listing not found");
        }

        console.log(`Listing with ID ${deleteID} has been deleted`);
        res.redirect("/Listing");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(PORT, (err) => {
    if (err) {
        console.error("Some internal server error", err);
    } else {
        console.log("Listening on PORT " + PORT);
    }
});
