const mongoose = require('mongoose');
const { Schema } = mongoose;

async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/RelationDemo');
        console.log('Connected to MongoDB...');
    } catch (error) {
        console.error('Something happened with the internal server:', error);
    }
}

main();

const addressSchema = new Schema({
    location: String,
    city: String,
    
});

const userSchema = new Schema({
    username: {
        type: String,
      
    },
    addresses: [addressSchema],
});

const User = mongoose.model('User', userSchema);

const addUser = async () => {
    try {
    const user = new User({
        username: 'Mihir Gupta',
        addresses: [
            {
                location: '221 B Strak Tower',
                city: 'London',
            },
        ],
    });

    user.addresses.push({
        location: 'p32 Wall_Street',
        city: 'New York',
    });
 

     let result= await user.save();
     console.log(result);
}
catch(error)
{
console.log("Something happen with internal server.."+ error);
}
};
addUser();
module.exports = User;
