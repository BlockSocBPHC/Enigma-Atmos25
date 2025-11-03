import mongoose, { Schema } from "mongoose";
const MONGO_URI = "mongodb://127.0.0.1:27017/Enigma";

mongoose.connect(MONGO_URI);

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    points: Number,
    rewards: Number,
})
const AdminSchema = new mongoose.Schema({
    name: String,
    password: String,
})

export const UserData = mongoose.model("UserData", UserSchema);
export const AdminData = mongoose.model("AdminData", AdminSchema)