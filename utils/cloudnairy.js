import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'


import dotenv from 'dotenv'
dotenv.config();


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });



export const uploadOnCloudinary = async (localpath) => {

    try {
        const result = await cloudinary.uploader.upload(localpath)
        fs.unlinkSync(localpath);
        console.log(result);
        return result;
    } catch (error) {
        fs.unlinkSync(localpath);
        console.log('Error in image uploading to Cloudinary', error)
        return null;
    }


}


