import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/auth/authentication.service';
import { LocalizeService } from 'src/app/core/localize.service';
import { KeyItem } from 'src/app/core/models/common.models';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  auth: boolean;
  langs: KeyItem[] = [];
  currentLang: string;
  currentItem: KeyItem = new KeyItem();
  isMenuVisible: boolean = false;
  userName = '';
  roleName: string;
  loginName: string;

  constructor(
    private localize: LocalizeService,
    private authService: AuthenticationService
  ) {
    this.auth = authService.isAuthenticated();
    this.currentLang = this.localize.getLangCode();
    this.langs = this.localize.getLangs();
    this.langs.forEach(ln => {
      if (ln.key === this.currentLang) {
        this.currentItem = ln;
      }
    });
    this.userName = this.authService.getFullname();
    this.roleName = this.authService.getRoleName();
    this.loginName = this.authService.getProfile().login;
  }
  
  ngOnInit(): void {

  }

  onLogin(e: any) {
    this.authService.redirect();
  }

  onRegister(e: any) {
    this.authService.register();
  }

  logout() {
    const tokenToRemove = this.authService.getToken();
    this.authService.logout();
    location.href = environment.authUrl + '/home?callback=' + environment.appUrl + '/home&token=' + tokenToRemove;
  }

  changeLang(lang: KeyItem): void {
    this.localize.changeLang(lang.key);
    this.currentItem = lang;
  }

  toggleMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }

  closeMenu() {
    this.isMenuVisible = false;
  }
}
