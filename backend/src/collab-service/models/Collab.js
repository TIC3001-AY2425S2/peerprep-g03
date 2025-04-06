import mongoose from 'mongoose';

const collabSchema = new mongoose.Schema({
    _id : {
        type: String,
        unique: true,
    },
    data: {
        type: String,
    },
    //may add question id and user id in this later on, data type may consider to change to object if we are not using String (?)
});

const Collab = mongoose.model('Collab', collabSchema);
export default Collab;