import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CabinetService {
  baseUrl = environment;
  constructor(private http: HttpClient) {}

  userInfo(): Observable<any> {
    return this.http.get(`api/Cabinet/UserDetails`);
  }

  getSessions(): Observable<any> {
    return this.http.get(`api/Cabinet/Sessions`);
  }

  getLogs(id: string): Observable<any> {
    return this.http.get(`api/Cabinet/Logs/${id}`);
  }

  addFileFolder(model: any) {
    return this.http.post('/Cabinet/AddFileFolder', model, {
      headers: {
        Trade: 'true'
      }
    });
  }

  getShopCustomerLotStats() {
    return this.http.get(`/Customer/GetLotsManufacturers`);
  }

  getOffersStatusMenu() {
    return this.http.get(`/Provider/GetOffersStatusMenu`);
  }

  getFilteredFoldersList(model: any) {
    return this.http.post<any[]>('/Lib/GetFilteredFolders', model, {
      headers: {
        Trade: 'true'
      }
    });
  }

  getRecentFilesList(model: any) {
    return this.http.post<any[]>('/Lib/GetRecentFilesList', model, {
      headers: {
        Trade: 'true'
      }
    });
  }

  getFilesList(model: any) {
    return this.http.post<any[]>('/Lib/GetFilesList', model, {
      headers: {
        Trade: 'true'
      }
    });
  }

  removeFile(fileId: number) {
    return this.http.post<any[]>('/Cabinet/RemoveFile/' + fileId, {
      headers: {
        Trade: 'true'
      }
    });
  }

  editFile(body: any) {
    return this.http.post<any[]>('/Cabinet/EditFile', body, {
      headers: {
        Trade: 'true'
      }
    });
  }

  getBranchesForDDL() {
    return this.http.get<any[]>('/Cabinet/GetBranchesForDDL', {
      headers: {
        Trade: 'true'
      }
    });
  }

  uploadFilesPOST(body: FormData) {
    return fetch(this.baseUrl.tradeUrl + '/Cabinet/UploadSingleFile', {
      method: 'POST',
      headers: {
        'NContent-Type': 'multipart/form-data'
      },
      body: body
    });
  }
}
