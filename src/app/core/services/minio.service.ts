import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';

// @ts-ignore
import { Client } from '../../../../node_modules/minio/dist/main/minio-browser';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MinioService {
  minioClient: any;
  size: number = 0;
  data: any;

  constructor(private sanitizer: DomSanitizer) {
    this.minioClient = new Client({
      endPoint: 'minio-cdn.uzex.uz',
      region: 'uz',
      accessKey: 'ezakupki-ro',
      secretKey: 'FQLWnx0zhdroGZ'
    });
  }

  async callMinio() {
    let objectsStream = this.minioClient.listObjects('ezakupki', '', true);
    objectsStream.on('data', function (obj: any) {
      console.log(obj);
    });
    objectsStream.on('error', function (e: any) {
      console.log(e);
    });
  }

  isFileExist(folder: any, fileName: any, fileD?: string): Promise<number> {
    return new Promise<number>(data => {
      this.minioClient.statObject(
        'ezakupki',
        fileD === undefined ? folder + '/' + fileName : fileD,
        function (err: any, stat: any) {
          if (err) {
            if (err.code === 'NotFound') {
              return data(0);
            } else {
              return data(0);
            }
          }
          return data(1);
        }
      );
    });
  }

  isProdFileExist(fullPath: string): Promise<number> {
    return new Promise<number>(data => {
      this.minioClient.statObject('ezakupki', '/' + fullPath, function (err: any, stat: any) {
        if (err) {
          if (err.code === 'NotFound') {
            return data(0);
          } else {
            return data(0);
          }
        }
        return data(1);
      });
    });
  }

  getMinioObject(folder: any, fileName: any, fileD?: string): Promise<any> {
    return this.minioClient.getObject('ezakupki', fileD === undefined ? folder + '/' + fileName : fileD);
  }

  getMinioObjectForProduct(fullPath: string): Promise<any> {
    return this.minioClient.getObject('ezakupki', '/' + fullPath);
  }

  saveMiniObject(folder: any, fileName: any, fileD?: string) {
    let size = 0;
    let fileMinio: BlobPart[] = [];
    this.getMinioObject(folder, fileName, fileD).then(dataStream => {
      dataStream.on('data', function (chunk: any) {
        size = size + chunk.length;
        fileMinio.push(chunk);
      });
      dataStream.on('end', function () {
        let blob = new Blob(fileMinio, { type: dataStream.headers['content-type'] });
        FileSaver.saveAs(blob, fileName);
      });
      //@ts-ignore
      dataStream.on('error', function (error: any) {
        console.log('errasdsada1 23:: ', error);
        return null;
      });
    });
  }

  saveMiniWithCustomName(folder: any, fileName: any, customName: any) {
    let size = 0;
    const fileMinio: BlobPart[] = [];
    this.getMinioObject(folder, fileName).then(dataStream => {
      dataStream.on('data', function (chunk: any) {
        size = size + chunk.length;
        fileMinio.push(chunk);
      });
      dataStream.on('end', function () {
        const blob = new Blob(fileMinio, { type: dataStream.headers['content-type'] });
        FileSaver.saveAs(blob, customName);
      });
      //@ts-ignore
      dataStream.on('error', function (err: any) {
        return null;
      });
    });
  }

  getImage(path: any, fileName: any, file: any) {
    let size = 0;
    let fileMinio: BlobPart[] = [];
    let sanitizer = this.sanitizer;
    this.getMinioObject(path, fileName).then(dataStream => {
      dataStream.on('data', function (chunk: any) {
        size = size + chunk.length;
        fileMinio.push(chunk);
      });
      dataStream.on('end', function () {
        let blob = new Blob(fileMinio, { type: dataStream.headers['content-type'] });
        let objectURL = 'data:image/jpeg;base64,' + blob;
      });
    });
  }
}
