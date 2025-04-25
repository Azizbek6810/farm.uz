import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/auth/authentication.service';
import { LocalizeService } from 'src/app/core/localize.service';
import { KeyItem } from 'src/app/core/models/common.models';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  isAuth: boolean;
  lang: KeyItem[] = [];
  currentLang: string;
  currentItem: KeyItem = new KeyItem();

  constructor(
    private auth: AuthenticationService,
    private localize: LocalizeService,
    private router: Router
  ) {
    this.isAuth = auth.isAuthenticated();
  }

  ngOnInit(): void {
    if (!this.isAuth) {
      this.auth.logout();
      this.router.navigate(['/home']).then(r => console.log('redirect', r));
    }
  }

  changeLang(lang: KeyItem): void {
    this.localize.changeLang(lang.key);
    this.currentItem = lang;
  }
}
