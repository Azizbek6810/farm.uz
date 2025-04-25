import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/auth/authentication.service';

@Component({
  selector: 'app-select-role',
  templateUrl: './select-role.component.html',
  styleUrls: ['./select-role.component.css']
})
export class SelectRoleComponent implements OnInit {
  constructor(
    private auth: AuthenticationService,
    private router: Router
  ) {
    const roleName = this.auth.getRole();
    switch (roleName) {
      case 'provider':
        this.router.navigate(['/cabinet/provider']);
        break;
      case 'customer':
        this.router.navigate(['/cabinet/customer']);
        break;
      default:
        if (this.auth.isAuthenticated()) {
          this.router.navigate(['/login-role']);
        } else {
          this.router.navigate(['/']);
        }
    }
  }

  ngOnInit(): void {}
}
