import mongoose, { Schema } from "mongoose";
import dotenv from 'dotenv'
dotenv.config({ path: "../.env" });
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI);

const UserSchema = new mongoose.Schema({
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    firstName: {type: String, default: ""},
    started: {type: Boolean, default: false},
    tokens: { type: Number, default: 10000 },
    rewards: { type: Number, default: 0 },
    points: {type: Number, default: 0},
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