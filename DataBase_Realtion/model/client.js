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

const Client = mongoose.model('Client', clientSchema); // Use 'Client' as the model name

const addClient = async () => {
    try {
        const res = await Client.insertMany([
            { item: 'samosa', price: 12 },
            { item: 'chips', price: 32 },
            { item: 'drink', price: 22 }, // Corrected 'dink' to 'drink'
            { item: 'chocolate', price: 10 }
        ]);
        console.log('Added clients:', res);
        
    } catch (error) {
        console.error('Error adding clients:', error);
    }
};

addClient(); // Call the addClient function to insert data
