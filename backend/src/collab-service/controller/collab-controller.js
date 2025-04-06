import Collab from "../models/Collab.js";
import mongoose from "mongoose";


const createNewOrJoinCollabSession = async (collabId) => {
    if(collabId == null) return;
    const collabData = await Collab.findById(collabId);
    if(collabData) return  collabData;
    return await Collab.create({ _id: id, data: ""});
}

const saveSessionData = async (collabId, saveData) => {
    return await Collab.findByIdAndUpdate(collabId, {data: saveData}, { new: true });
}



export {
    createNewOrJoinCollabSession,
    saveSessionData,
}