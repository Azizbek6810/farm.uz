import { Injectable } from '@angular/core';

// @ts-ignore
import {Client} from '../../../../node_modules/minio/dist/main/minio-browser';
import {DomSanitizer} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MinioService {

  constructor() { }
}
