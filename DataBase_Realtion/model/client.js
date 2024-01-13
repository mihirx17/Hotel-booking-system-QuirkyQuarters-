const mongoose = require('mongoose');
const { Schema } = mongoose;

async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/Client');
        console.log('Connected to MongoDB...');
    } catch (error) {
        console.error('Something happened with the internal server:', error);
    }
}

main();

const clientSchema = new Schema({
    item: String,
    price: Number
});

const coustomerSchema = new Schema({
    name: String,
    oder: [{
        type: Schema.Types.ObjectId,
        ref: "Client",
    }],
});

const Client = mongoose.model('Client', clientSchema);
const Coustomer = mongoose.model('Coustomer', coustomerSchema);

let addCoustomer = async () => {
    try {
        let newCoustomer = new Coustomer({
            name: "Mihir",
        });

        let order1 = await Client.findOne({ item: "chips" });
        let order2 = await Client.findOne({ item: "drink" });

        newCoustomer.oder.push(order1._id, order2._id);

        let result = await newCoustomer.save();

        // Populate the "oder" field to get the items associated with the customer
        let populatedResult = await Coustomer.findById(result._id).populate('oder');

        console.log(populatedResult);
    } catch (error) {
        console.error('Error adding customer:', error);
    }
};

addCoustomer();
