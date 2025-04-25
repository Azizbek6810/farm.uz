import { Component, OnInit } from '@angular/core';
import { IUserInfo } from '../../cabinet.models';
import { CommonService } from 'src/app/core/services/common.service';
import { AuthenticationService } from 'src/app/core/auth/authentication.service';

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.css']
})
export class CustomerInfoComponent implements OnInit {
  userInfo: IUserInfo[] = [];
  isLoading = false;
  userName: string;

  constructor(
    private service: CommonService,
    private auth: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
    this.userName = this.auth.getFullname();
  }

  getUserInfo(): void {
    this.isLoading = true;
    this.service.userInfo().subscribe(res => {
      if (res) {
        this.userInfo = res;
        this.isLoading = false;
      }
    });
  }
}
