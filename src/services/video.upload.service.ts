import {injectable, /* inject, */ BindingScope} from '@loopback/core';
const AWS = require('aws-sdk');

const signedUrlExpireSeconds = 60 * 5;
const bucket = 'flexin-video';

// read S3 variables from .env
const config = {
  region: process.env.S3_REGION,
  signatureVersion: 'v4',
  accessKeyId: process.env.S3_ACCESSKEYID,
  secretAccessKey: process.env.S3_SECRETACCESSKEY,
  endpoint: process.env.S3_ENDPOINT, // it could be any S3 provider
};

@injectable({scope: BindingScope.TRANSIENT})
export class VideoUploadService {
  s3: any;

  constructor() {
    this.s3 = new AWS.S3(config);
  }

  getUploadUrl(fileName: string): object {
    const uploadParams = {
      Bucket: bucket,
      Key: fileName,
      ContentType: 'application/octet-stream',
      Expires: signedUrlExpireSeconds,
    };

    let url = this.s3.getSignedUrl('putObject', uploadParams);
    return url;
  }
}