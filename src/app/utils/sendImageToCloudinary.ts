import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import configs from '../configs';
import multer from 'multer';
import path from 'path';

import fs from 'fs';
import { removeWhiteSpace } from './RemoveWhiteSpace';

cloudinary.config({
  cloud_name: configs.cloud_name,
  api_key: configs.cloudinary_api_key,
  api_secret: configs.cloudinary_api_secret,
});

const sendImageToCloudinary = (
  imageName: string,
  path: string,
): Promise<Record<string, unknown>> => {
  console.log(removeWhiteSpace(imageName), 'public_id');
  return new Promise((resolve, reject) => {
    // upload file with cloudinary:
    cloudinary.uploader.upload(
      path,
      {
        public_id: removeWhiteSpace(imageName),
      },
      function (error, result) {
        if (error) {
          reject("Image Didn't uploaded!!!");
        } else {
          resolve(result as UploadApiResponse);
          fs.unlink(path, (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log('file is deleted!!');
            }
          });
        }
      },
    );
  });
};

export default sendImageToCloudinary;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.cwd() + '/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    const fileName = file.originalname + uniqueSuffix + extension;
    cb(null, fileName);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    console.log(path.extname(file.originalname));
    const validExt = /.png|.jpeg|.jpg/;
    if (validExt.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});
