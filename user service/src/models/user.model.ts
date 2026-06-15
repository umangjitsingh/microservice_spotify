import mongoose from 'mongoose';
import {Schema, Document} from 'mongoose';


export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role?: string;
    playlist?: string[]
}

const userSchema: Schema<IUser> = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true,select:false},
    role: {type: String,default:'user', enum:['user','admin']},
    playlist: [{
        type: String,
    }]
}, {timestamps: true});

const User = mongoose.model('User', userSchema);
export default User;