import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/core/auth/authentication.service';
import { EsiService } from 'src/app/core/services/esi.service';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.css']
})
export class RedirectComponent implements OnInit {
  sub: Subscription;
  hasRemember: boolean = false;
  rememberMyChooseText: string = 'Common.Loading';

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private esi: EsiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.hasRemember = this.auth.getRememberMyChoose() === '1';
    this.sub = this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.doAuth(params['token']);
        if (params['key']) {
          this.esi.setKey(params['key']);
        } else {
          this.esi.removeKeys();
        }
      } else {
        this.router.navigate(['/']);
      }
      if (params['verification']) {
      }
    });
  }

  doAuth(token: any) {
    if (!token) {
      return;
    }
    this.auth.login(token);
    if (this.auth.isAuthenticated()) {
      if (this.auth.getProfile().clientType === 3) {
        this.router.navigate(['/sub-user-role']);
      } else {
        this.router.navigate(['/login-role']);
      }
    } else {
      this.auth.logout();
    }
  }
}
