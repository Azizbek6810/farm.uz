import { Injectable } from '@angular/core';
import * as Forge from 'node-forge';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  publicKey = `-----BEGIN PUBLIC KEY-----
  MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgH8lx9sqVlIPIPvXSzzMOM1a0QjQ
  7oFbQKNntR4ckpa5pczfsLDDb0fzVz0FvImpgncTZLSJHAlaU4S/6EVmgPSgMm8n
  6pjKBGKQKlKQ6AHgVK3aaZ95fvsXezIETlIfP2YITMhbtlwV2uUvqlwGc2xrBrsd
  uscHPwmkfEiflDJ/AgMBAAE=
  -----END PUBLIC KEY-----`;

  encryptWithPublicKey(valueToEncrypt: any) {
    const rsa = Forge.pki.publicKeyFromPem(this.publicKey);
    return window.btoa(rsa.encrypt(valueToEncrypt.toString()));
  }

  constructor() { }
}
