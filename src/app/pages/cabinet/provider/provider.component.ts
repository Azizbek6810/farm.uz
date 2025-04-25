import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/auth/authentication.service';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.css']
})
export class ProviderComponent implements OnInit {
  isAuth: boolean;

  constructor(
    private auth: AuthenticationService,
    private router: Router
  ) {
    this.isAuth = auth.isAuthenticated();
  }

  ngOnInit() {
    if (!this.isAuth) {
      this.auth.logout();
      this.router.navigate(['/home']).then(r => console.log('redirect', r));
    }
  }
}
