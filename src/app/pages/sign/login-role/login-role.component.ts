import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserRoleModel } from 'src/app/core/auth/authentication.models';
import { AuthenticationService } from 'src/app/core/auth/authentication.service';
import { CoreStates } from 'src/app/core/models/enum.models';
import { AuthService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login-role',
  templateUrl: './login-role.component.html',
  styleUrls: ['./login-role.component.css']
})
export class LoginRoleComponent implements OnInit {
  userRoles: UserRoleModel[] = [];
  userRolesAvatars = [
    '../../assets/images/factory.svg',
    '../../../assets/images/delivery.svg',
    '../../../assets/images/business-man.svg'
  ];
  getRolesStatus = CoreStates.none;
  loginName: string = '';
  keyword: string = '';
  fullName: string = '';
  shortName: string = '';
  showOldStyle: boolean = false;
  remember: boolean = false;
  sub: Subscription;
  rememberParam: string = '';
  selectedIdx: number = 0;

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private service: AuthService,
    private route: ActivatedRoute
  ) {
    this.loginName = this.auth.getProfile().login;
    this.fullName = this.auth.getFullname();
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      if (params['remember']) {
        this.rememberParam = params['remember'];
      }
    });
    this.remember = this.auth.getRememberMyChoose() === '1';
    if (this.auth.isAuthenticated()) {
      this.getUserRoles();
    } else {
      this.auth.logout();
      this.auth.redirect();
    }
  }

  selectUserRole(id: number) {
    this.auth.setRememberMyChoose(this.remember ? '1' : '2');
    this.selectedIdx = id;
    this.getRolesStatus = CoreStates.sending;
    const role = this.userRoles[id].role_id === 1 ? 'customer' : 'provider';
    this.service
      .updateToken('?userid=' + this.userRoles[id].user_id + '&sub=' + role.toLocaleUpperCase(), null)
      .subscribe((data: any) => {
        this.auth.login(data.accessToken);
        this.auth.setRole(role);
        this.auth.setRoleId(this.userRoles[id].role_id.toString());
        this.auth.setRoleName(this.userRoles[id].role_name);
        this.auth.setFullname(this.userRoles[id].fullname);
        this.auth.setCustomerType(this.userRoles[id].customer_type.toString());
        this.auth.cabinet();

        setTimeout(() => {
          this.getRolesStatus = CoreStates.sent;
        }, 300);
      });
  }

  getUserRoles() {
    this.getRolesStatus = CoreStates.loading;
    this.service.getUserRoles().subscribe((data: any) => {
      this.getRolesStatus = CoreStates.loaded;
      this.userRoles = data;
      for (let i = 0; i < this.userRoles.length; i++) {
        this.userRoles[i].short_name = this.getShort(this.userRoles[i].fullname);
        if (this.remember && this.userRoles[i].role_id === +this.auth.getRoleId()) {
          if (!this.rememberParam || (this.rememberParam && this.rememberParam !== '1')) {
            this.selectUserRole(i);
          }
        }
      }
      if (this.userRoles.length === 1) {
        this.selectUserRole(0);
      }
    });
  }

  getSmsActions() {
    this.service.getSmsServiceActionsAndPhone().subscribe(
      data => {
        this.auth.setSMSActions(data);
        // console.log(data);
        this.auth.cabinet();
        setTimeout(() => {
          this.getRolesStatus = CoreStates.sent;
        }, 300);
      },
      (error: any) => {
        // console.log(error);
        this.auth.cabinet();
        this.getRolesStatus = CoreStates.sent;
      }
    );
  }

  getShort(name: string): string {
    if (name && name.length > 25) {
      return name.substring(0, 25) + ' ...';
    }
    return name;
  }

  logout() {
    const tokenToRemove = this.auth.getToken();
    this.auth.logout();
    // this.esi.removeKeys();
    location.href = environment.authUrl + '/home?callback=' + environment.appUrl + '/home&token=' + tokenToRemove;
  }
}
