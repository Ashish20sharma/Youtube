var cloudinary = require('cloudinary').v2;
const fs = require("fs");

cloudinary.config({
    cloud_name: process.env.CLOUDNARY_CLOUD_NAME,
    api_key: process.env.CLOUDNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_API_SECRET
});

const cloudinaryUpload = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        // upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: 'auto' });
        // uploaded successfully
        console.log("file uploaded seccessfully",response.url);
        return response;
    } catch (error) {
        fs.unlink(localFilePath) //remove the localy save temporary file as the upload operation failed
        return null;
    }
}

modul.exports={cloudinaryUpload};