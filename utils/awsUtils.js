import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import AWS from 'aws-sdk';
import { availableExtensions } from './helper.js';
import path from 'path';


const REGION = 'ap-south-1';
const s3Client = new S3Client({ region: REGION });
const s3 = new AWS.S3();

export const uploadFile = async (key, file) => {
    try {
        const profilePicBase64 = Buffer.from(file.buffer);
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            Body: profilePicBase64,
            ContentType: file.mimetype,
        };

        const results = await s3Client.send(new PutObjectCommand(params));
        if (!results) {
            return false;
        }
        return true;
    } catch (err) {
        console.log('Error', err);
    }
};

export const getObjectsList = async (path) => {
    try {
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Prefix: `${path}`,
        };

        const existingFiles = [];
        const result = await s3.listObjectsV2(params).promise();
        const contents = result.Contents;

        contents.forEach((Object) => {
            existingFiles.push(Object.Key);
        });

        if (existingFiles.length > 0) {
            return existingFiles;
        }
        return false;
    } catch (err) {
        console.log('Error', err);
    }
};

export const deleteS3Object = async (path) => {
    try {
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Prefix: `${path}`,
        };

        const result = await s3.listObjectsV2(params).promise();
        const contents = result.Contents;

        const response = [];
        contents.forEach(async (Object) => {
            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: Object.Key,
            };

            const deleted = await s3.deleteObject(params).promise();
            response.push(deleted);
        });
        return response;
    } catch (err) {
        console.log('Error', err);
    }
};

export const handleFileUpload = async (file, uuid) => {
    const extension = path.extname(file.originalname);
    if (!availableExtensions.includes(extension)) {
        throw new Error('Only pdf, doc and docx files are allowed');
    }
    const key = `Research_Paper/${uuid}${extension}`;
    const existingFiles = await getObjectsList(`Research_Paper/${uuid}`);
    if (existingFiles) {
        await deleteS3Object(existingFiles);
    }
    return uploadFile(key, file);
};