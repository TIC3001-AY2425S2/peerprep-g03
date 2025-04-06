import Collab from "../models/Collab.js";
import mongoose from "mongoose";


// const createNewCollab = async (req, res) => {
//     const collab = req.body;
//     const checkCollabExist = await Collab.findById(collab.id);

//     if(checkCollabExist){
//         return res.status(404).json({success : false, message: "Current Collab Session ID exist, failed to create new collab session"});
//     }
//     const newQuestion = new Question(question);
//     try{
//         await Collab.create({ _id: collab.id, data: "", userId: "", questionId: collab.questionId});
//         res.status(200).json({message: "Collab Session successfully created!"});
//     } catch(error){
//         res.status(500).json({message: "Server error"});
//     }
// }

const createNewOrJoinCollabSession = async (collabId) => {
    if(collabId == null) return;
    const collabData = await Collab.findById(collabId);
    if(collabData) return  collabData;
    return await Collab.create({ _id: collabId, data: "", userId: "", questionId: "" });
}

const saveSessionData = async (collabId, saveData) => {
    return await Collab.findByIdAndUpdate(collabId, {data: saveData}, { new: true });
}



export {
    createNewOrJoinCollabSession,
    saveSessionData,
}