import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class SecureStorageService {
  private storageKey = 'secureCustomerId';
  private secretKey = 'd9a123e8bc7f45d89f18ce39b6a4f25bd1e4cfa8279e5d72a4ff5ba2ed9cb7cd';

  encryptId(id: string): string {
    const idToEncrypt = String(id);
    return CryptoJS.AES.encrypt(idToEncrypt, this.secretKey).toString();
  }

  decryptId(encryptedId: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedId, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // New method to get the encrypted ID
  getEncryptedId(id: string): string {
    return this.encryptId(id);
  }
}
