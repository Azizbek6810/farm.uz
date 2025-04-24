import {Component, Input, OnInit} from '@angular/core';
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-copy-to-clipboard',
  templateUrl: './copy-to-clipboard.component.html',
  styleUrls: ['./copy-to-clipboard.component.css']
})
export class CopyToClipboardComponent implements OnInit {
  @Input() text: string;

  constructor(
    private toast: ToastrService
  ) {}

  ngOnInit(): void {}

  onCopyToClipboard(val: any) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.toast.info('Скопирован!');
  }
}
