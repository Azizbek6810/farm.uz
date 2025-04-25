import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { FileModel, FolderList, FolderModel } from 'src/app/core/models/common.models';
import { CoreStates, FileType } from 'src/app/core/models/enum.models';
import { MinioService } from 'src/app/core/services/minio.service';
import { CabinetService } from 'src/app/pages/cabinet/cabinet.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-trade-file-manager',
  templateUrl: './trade-file-manager.component.html',
  styleUrls: ['./trade-file-manager.component.css']
})
export class TradeFileManagerComponent implements OnInit {
  @ViewChild('fileEditModal', { static: false }) fileEditModal: ModalDirective;
  @Input('totalSelectCount') totalSelectCount: any = null;
  @Output() filesSelected = new EventEmitter<number>();
  @Input('hideRecentFiles') hideRecentFiles = false;
  @Input('fileTypes') fileTypes: FileType[] = [FileType.image, FileType.doc, FileType.video];

  destroy$: Subject<any>;
  canSelect = true;
  filter = new FolderList();
  page = 0;
  pageCount = 20;
  createNewFolder = false;
  selectedFolder: number = null;
  folderList: FolderModel[] = [];
  folderName = '';
  fileList: FileModel[] = [];
  recentFileList: FileModel[] = [];
  createFolderStatus = '';
  getFolderStatus = '';
  filesUploadStatus = '';
  statusFile = CoreStates.none;
  totalCount = 0;
  tradeURL = '';
  sendingFiles: string[] = [];
  selectedCount = 0;
  newFileName = '';
  keyword = '';

  fileType = FileType;

  constructor(
    private cabinetService: CabinetService,
    private minio: MinioService,
    private sanitizerMinio: DomSanitizer
  ) {
    this.destroy$ = new Subject();
  }

  ngOnInit(): void {
    this.tradeURL = environment.minioUrl;
    this.getFolderList();
    this.getRecentFiles();
  }

  showCreateFolder() {
    this.createNewFolder = true;
  }

  createFolder() {
    this.createFolderStatus = 'loading';
    const body = {
      name: this.folderName
    };
    this.cabinetService.addFileFolder(body).subscribe(
      data => {
        this.createFolderStatus = 'loaded';
        this.folderName = '';
        this.createNewFolder = false;
        console.log(data);
        this.getFolderList();
      },
      error => {
        this.createFolderStatus = 'loaded';
      }
    );
  }

  getFolderList() {
    this.folderList = [];
    let body = {
      values: this.fileTypes,
      keyword: this.keyword
    };
    this.cabinetService.getFilteredFoldersList(body).subscribe(
      data => {
        this.getFolderStatus = 'loaded';
        for (let i = 0; i < data.length; i++) {
          this.folderList.push(data[i]);
        }
        this.selectFolder(0);
      },
      error => {
        this.getFolderStatus = 'loaded';
      }
    );
  }

  getNextFileList() {
    this.filter.from = this.fileList.length + 1;
    this.filter.to = this.fileList.length + this.pageCount;
    this.filter.keyword = this.keyword;
    this.filter.file_types = this.fileTypes;
    let folder_id = this.filter.folder_id;
    this.statusFile = CoreStates.loading;
    this.getFilesList(folder_id);
  }

  private getFilesList(folder_id: number) {
    this.cabinetService.getFilesList(this.filter).subscribe(
      data => {
        this.statusFile = CoreStates.loaded;
        if (folder_id === this.filter.folder_id) {
          for (let i = 0; i < data.length; i++) {
            data[i].selected = false;
            if (data[i].ext_type_id === 1) {
              this.getImage(data[i]);
            }
            this.fileList.push(data[i]);
          }
        }
        if (data.length > 0) {
          this.totalCount = data[0].total_count;
        }
      },
      error => {
        this.statusFile = CoreStates.loaded;
      }
    );
  }

  getRecentFiles() {
    let body = {
      values: this.fileTypes
    };
    this.cabinetService.getRecentFilesList(body).subscribe(data => {
      this.recentFileList = [];
      for (let i = 0; i < data.length; i++) {
        data[i].selected = false;
        if (data[i].ext_type_id === 1) {
          this.getImage(data[i]);
        }
        this.recentFileList.push(data[i]);
      }
    });
  }

  selectFolder(idx: any) {
    this.selectedFolder = idx;
    this.page = 0;
    this.filter.folder_id = this.folderList.length > idx ? this.folderList[idx].id : null;
    this.fileList = [];
    this.totalCount = 0;
    this.getNextFileList();
  }

  onFileInput(event: any) {
    this.filesUploadStatus = 'loading';
    const fileList = event.target.files;
    for (let i = 0; i < fileList.length; i++) {
      this.sendFile(fileList[i], i);
    }
  }

  sendFile(file: File, idx: number) {
    this.sendingFiles.push('file-' + idx);
    const formData = new FormData();
    formData.append('models[0].name', file.name);
    formData.append('models[0].customName', file.name);
    if (this.selectedFolder) {
      formData.append('models[0].folder_id', this.folderList[this.selectedFolder].id.toString());
    }
    let status = 0;
    formData.append('files[0]', file);
    status = this.uploadFilesPost(formData, status, idx);
  }

  private uploadFilesPost(formData: FormData, status: number, idx: number) {
    this.cabinetService
      .uploadFilesPOST(formData)
      .then(res => {
        status = res.status;
        return status === 200 ? res.text() : res.json();
      })
      .then(resp => {
        if (status === 200) {
          for (let i = 0; i < this.sendingFiles.length; i++) {
            if (this.sendingFiles[i] === 'file-' + idx) {
              this.sendingFiles.splice(i, 1);
            }
          }
          const item: any = JSON.parse(resp);
          this.getImage(item);
          this.fileList.unshift(item);
        }
      });
    return status;
  }

  setFileSelect(file: FileModel) {
    if (file.state !== CoreStates.sending) {
      if (this.canSelect) {
        file.selected = !file.selected;
        this.selectFile(file);
        this.checkTotalSelection();
      }
    }
  }

  selectFile(file: FileModel) {
    const files = this.fileList.filter(value => value.selected);
    const rFiles = this.recentFileList.filter(value => value.selected);
    this.selectedCount = files.length + rFiles.length;
    this.checkTotalSelection();
  }

  checkTotalSelection() {
    if (this.totalSelectCount) {
      this.canSelect = this.totalSelectCount > this.selectedCount;
    }
  }

  cancelSelect() {
    for (let i = 0; i < this.fileList.length; i++) {
      this.fileList[i].selected = false;
    }
    for (let i = 0; i < this.recentFileList.length; i++) {
      this.recentFileList[i].selected = false;
    }
    this.selectedCount = 0;
    this.checkTotalSelection();
  }

  selectAll() {
    for (let i = 0; i < this.fileList.length; i++) {
      this.fileList[i].selected = true;
    }
    this.selectedCount = this.fileList.length;
  }

  setFilesSelected() {
    this.filesSelected.emit(0);
  }

  getSelectedFiles() {
    let allFiles = [];
    let recF = this.recentFileList.filter(file => {
      return file.selected;
    });
    let fList = this.fileList.filter(file => {
      return file.selected;
    });
    for (let i = 0; i < recF.length; i++) {
      allFiles.push(recF[i]);
    }
    for (let i = 0; i < fList.length; i++) {
      allFiles.push(fList[i]);
    }
    return allFiles;
  }

  getSelectedFilesWithType(id: any) {
    const retArray: any[] = [];
    const items = this.getSelectedFiles();
    for (let i = 0; i < items.length; i++) {
      const item = {
        file_id: items[i].id,
        file_custom_name: items[i].custom_name,
        type_id: id
      };
      retArray.push(item);
    }
    return retArray;
  }

  getFilesWithType(id: number) {
    const arr: any[] = [];
    const items = this.getSelectedFiles();
    for (let i = 0; i < items.length; i++) {
      if (id && id === 2) {
        // 2 => e-direct-type
        const item = {
          name: items[i].name,
          custom_name: items[i].custom_name,
          path: items[i].path,
          ext: items[i].ext,
          file_size: items[i].file_size
        };
        arr.push(item);
      } else {
        const item = {
          id: items[i].id,
          name: items[i].name,
          custom_name: items[i].custom_name,
          path: items[i].path,
          ext: items[i].ext,
          file_size: items[i].file_size,
          ext_type_id: items[i].ext_type_id,
          date_ini: items[i].date_ini
        };
        arr.push(item);
      }
    }
    return arr;
  }

  removeFile(idx: number) {
    this.fileList[idx].state = CoreStates.sending;
    this.cabinetService.removeFile(this.fileList[idx].id).subscribe(
      data => {
        console.log(data);
        if (this.fileList[idx].selected) {
          this.selectedCount = this.selectedCount - 1;
        }
        this.fileList[idx].state = CoreStates.sent;
        this.fileList.splice(idx, 1);
        this.totalCount -= 1;
      },
      error => {
        this.getFolderStatus = 'loaded';
      }
    );
  }

  editFile(file: FileModel) {
    this.newFileName = file.custom_name;
    file.state = CoreStates.editing;
  }

  saveEditing(file: FileModel) {
    file.state = CoreStates.sending;
    let body = {
      id: file.id,
      folder_id: this.folderList[this.selectedFolder].id,
      custom_name: this.newFileName
    };
    this.cabinetService.editFile(body).subscribe(
      data => {
        console.log(data);
        file.custom_name = this.newFileName;
        this.newFileName = '';
        file.state = CoreStates.sent;
      },
      error => {
        file.state = CoreStates.sent;
      }
    );
  }

  cancelEditing(file: FileModel) {
    this.newFileName = '';
    file.state = CoreStates.none;
  }

  search() {
    this.getFolderList();
  }

  getImage(file: FileModel) {
    let san = this.sanitizerMinio;
    let size = 0;
    let fileMinio: BlobPart[] = [];
    this.minio.isFileExist(file.path, file.name).then(isExist => {
      if (isExist === 1) {
        this.minio.getMinioObject(file.path, file.name).then(dataStream => {
          dataStream.on('data', function (chunk: any) {
            size += chunk.length;
            fileMinio.push(chunk);
          });
          dataStream.on('end', function () {
            let blob = new Blob(fileMinio, { type: dataStream.headers['content-type'] });
            const unsafeImg = URL.createObjectURL(blob);
            file.fileBlob = san.bypassSecurityTrustUrl(unsafeImg);
            return blob;
          });
          // @ts-ignore
          dataStream.on('error', function (err: any) {
            return null;
          });
        });
      }
    });
  }
}
