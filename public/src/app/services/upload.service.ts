import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';


@Injectable({
  providedIn: 'root'
})
export class UploadService {
  
  
  constructor() { }

   bucket = new S3(
    {
      accessKeyId: '',
      secretAccessKey: '',
      region: 'us-west-1'
    }
  );
  ChatFOLDER = ''

 

}
