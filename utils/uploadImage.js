const User = require('../models/User.model');
const {StatusCodes } = require('http-status-codes');
const path = require('path');
const cloudinary = require('./cloudinary')
const fs = require('fs')

const uploadImage = async(req, res) =>{
    if(!req.files){
        throw new CustomError.BadRequestError('No file Uploaded');
    }

    const profileImage = req.files.image;

    if(!profileImage.mimetype.startsWith('image')){
        throw new CustomError.BadRequestError('upload an image')
    }

    const maxSize = 1024 * 1024;

    if(profileImage.size > maxSize){
        throw new CustomError.BadRequestError(
            'Please upload image smaller than 1mb'
        );
    }

    const imagePath = path.join(__dirname, '../public/profile/' + `${profileImage.name}`)

    await profileImage.mv(imagePath);
    res.status(StatusCodes.OK).json({ image: `/profile/${profileImage.name}` });
};

const uploadProductImage = async(req, res) =>{
    const result = await cloudinary.uploader.upload(
        req.files.image.tempFilePath,
        {
            use_filename: true,
            folder: 'file-upload'
        }
    );

    fs.unlinkSync(req.files.image.tempFilePath);
    return res.status(StatusCodes.OK).json({ image: {src: result.secure_url}})
}

module.exports = {
    uploadImage,
    uploadProductImage
}