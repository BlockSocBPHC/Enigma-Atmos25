import mongoose, { Schema } from "mongoose";
const MONGO_URI = "mongodb://127.0.0.1:27017/Enigma";

mongoose.connect(MONGO_URI);

const UserSchema = new mongoose.Schema({
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    firstName: {type: String, default: ""},
    started: {type: Boolean, default: false},
    points: { type: Number, default: 100000 },
    rewards: { type: Number, default: 0 },
    questions: { type: [Object], default: [] }, 
    attackAfterWhichQuestion: {type: Number, default: null},
    attack1Done: {type: Boolean, default: false},
});
const AdminSchema = new mongoose.Schema({
    name: String,
    password: String,
})

export const UserData = mongoose.model("UserData", UserSchema);
export const AdminData = mongoose.model("AdminData", AdminSchema)