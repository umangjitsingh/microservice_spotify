import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import generateToken from "../generateToken.js";
import type {AuthenticatedRequest} from "../AuthM.js";

export const getSafeUser = (user: any) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role || "user",
    playlist: user.playlist || [],
    createdAt: user.createdAt
});


export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        if (!name || name.length < 2) {
            return res.status(400).json({ message: "Name must be at least 2 characters long" });
        }

        if (!password || password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        const token = generateToken(newUser);

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const SAFE_USER_DATA=getSafeUser(newUser)

        return res.status(201).json({
            message: "User created successfully",
            user: SAFE_USER_DATA
        });

    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = generateToken(user);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        const SAFE_USER_DATA=getSafeUser(user)
        return res.status(200).json({
            message: "Login successful",
            user:SAFE_USER_DATA
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const loggedInUser=req.user;
        if(!loggedInUser) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        return res.status(200).json({
            message: "User found",
            user: loggedInUser
        });
    } catch (error) {
        console.error("Get Me Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}