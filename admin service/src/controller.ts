import { type Request, type Response } from 'express';
import {v2 as cloudinary} from 'cloudinary';
import getBuffer from './config/dataUri.js';
import {prisma} from "./index.js";

export const addAlbum=async(req:Request, res:Response)=> {
    try {
        console.log(req)
        if (req.user?.role !== 'admin') return res.status(401).json({error: "You are not authorized to perform this action"});

        const {title, description} = req.body;
        const file = req.file;

        if (!file) return res.status(400).json({error: "Please upload a file"});

        const fileBuffer = getBuffer(file);
        if (!fileBuffer || !fileBuffer.content)
            return res.status(400).json({error: "Please upload a valid file"});

        const cloudinaryResponse = await cloudinary.uploader.upload(fileBuffer.content, {
            folder: 'albums',
            resource_type: 'auto',
        });
        const album = await prisma.album.create({
            data: {
                title,
                description,
                thumbnail: cloudinaryResponse.secure_url
            }
        });

        return res.status(201).json({
            message: "Album created successfully",
            album:album
        });
    } catch (error) {
        console.log(error);
    }

}