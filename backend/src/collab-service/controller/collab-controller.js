import Collab from "../models/Collab.js";
import mongoose from "mongoose";


const createNewCollab = async (req, res) => {
    const collab = req.body;
    const checkCollabExist = await Collab.findById(collab.id);

    if(checkCollabExist){
        return res.status(404).json({success : false, message: "Current Collab Session ID exist, failed to create new collab session"});
    }

    try{
        await Collab.create({ _id: collab.id, data: "", questionId: collab.questionId});
        res.status(200).json({message: "Collab Session successfully created!"});
    } catch(error){
        res.status(500).json({message: "Server error"});
    }
}


const joinCollabSession = async (collabId) => {
    if(collabId == null) return;
    const collabData = await Collab.findById(collabId);
    if(collabData) return collabData;
}


const createNewOrJoinCollabSession = async (collabId) => {
    if(collabId == null) return;
    let collabData = await Collab.findById(collabId);
    if(collabData !== null) return collabData;

    try{
        collabData = await Collab.create({ _id: collabId, data: "", questionId: "" });
        return collabData;
    } catch (error){
        //if duplicate
        if (error.code === 11000) {
            console.log(`Duplicate session creation attempted for ${collabId}, returning existing session.`);
            return await Collab.findById(collabId);
        }

        throw error;
    }
}

const saveSessionData = async (collabId, saveData) => {
    return await Collab.findByIdAndUpdate(collabId, {data: saveData}, { new: true });
}

const deleteCollab = async (collabId) => {
    try {
        await Collab.findByIdAndDelete(collabId);
        res.status(200).json({sucess: true, message: "Collaborative Session deleted!"});

    }   catch(error) {
        res.status(500).json({success: false, message: "Failed to delete Session!"});
    }
};
export {
    createNewOrJoinCollabSession,
    joinCollabSession,
    saveSessionData,
    createNewCollab,
    deleteCollab,
}