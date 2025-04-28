import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/auth/authentication.service';
import { LocalizeService } from 'src/app/core/services/localize.service';
import { KeyItem } from 'src/app/core/models/common.models';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cabinet-header',
  templateUrl: './cabinet-header.component.html',
  styleUrls: ['./cabinet-header.component.css']
})
export class CabinetHeaderComponent implements OnInit {
  lang: KeyItem[] = [];
  currentLang: string;
  currentItem: KeyItem = new KeyItem();
  isAuth: boolean;
  userName: string;
  roleName: string;

  constructor(
    private auth: AuthenticationService,
    private localize: LocalizeService
  ) {
    this.initLangAndRole();
  }

  ngOnInit(): void {}

  initLangAndRole() {
    this.isAuth = this.auth.isAuthenticated();
    this.currentLang = this.localize.getLangCode();
    this.lang = this.localize.getLangs();
    this.userName = this.auth.getFullname();
    this.roleName = this.auth.getRoleName();
    this.lang.forEach(lang => {
      if (lang.key === this.currentLang) {
        this.currentItem = lang;
      }
    });
  }

  logout() {
    const tokenToRemove = this.auth.getToken();
    this.auth.logout();
    location.href = environment.authUrl + '/home?callback=' + environment.appUrl + '/home&token=' + tokenToRemove;
  }

  changeLang(lang: KeyItem): void {
    this.localize.changeLang(lang.key);
    this.currentItem = lang;
  }
}
