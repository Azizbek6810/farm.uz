import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/auth/authentication.service';
import { SubUserBranch, SubUserRoleModel } from 'src/app/core/models/common.models';
import { CoreStates } from 'src/app/core/models/enum.models';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-sub-user-role',
  templateUrl: './sub-user-role.component.html',
  styleUrls: ['./sub-user-role.component.css']
})
export class SubUserRoleComponent implements OnInit {
  selectedIdx = 1;
  getRolesStatus = CoreStates.none;
  loginName = '';
  fullName = '';
  shortName = '';
  showOldStyle = false;

  sub_user_id = 0;
  selectedBranch: SubUserBranch;
  currentRoleId = 0;
  userRoles: SubUserRoleModel[] = [];

  userRolesAvatars = [
    '/assets/images/assets/factory.svg',
    '/assets/images/assets/delivery.svg',
    '/assets/images/assets/business-man.svg'
  ];

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private service: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loginName = this.auth.getProfile().login;
    this.fullName = this.auth.getFullname();
    if (this.auth.isAuthenticated()) {
      this.getUserRoles();
    } else {
      this.auth.logout();
      this.auth.redirect();
    }
  }

  changeBranch(e: any) {
    if (!e) {
      return;
    }
    this.currentRoleId = e.role_id;
    this.auth.setRoleName(e.role_name);
  }

  selectUserRole(idx: number, role: SubUserRoleModel) {
    let customerType = 0;
    this.selectedIdx = idx;
    let branch: SubUserBranch;
    for (let i = 0; i < role.branches.length; i++) {
      if (role.selected_branch === role.branches[i].sub_user_id) {
        branch = role.branches[i];
      }
      if (this.currentRoleId === role.branches[i].role_id) {
        customerType = role.branches[i].customer_type;
      }
    }
    if (branch) {
      this.getRolesStatus = CoreStates.sending;
      this.updateTokenWithSub(role, branch, customerType);
    }
  }

  private updateTokenWithSub(role: SubUserRoleModel, branch: SubUserBranch, customerType: number) {
    this.service
      .updateTokenWithSub({
        user_id: role.user_id,
        sub_user_id: branch.sub_user_id,
        manager_id: branch.manager_id
      })
      .subscribe(
        (data: any) => {
          this.auth.login(data.accessToken);
          switch (this.currentRoleId) {
            case 1:
              this.auth.setRole('customer');
              break;
            case 2:
              this.auth.setRole('provider');
              break;
            case 3:
              this.auth.setRole('control-manager');
              break;
          }
          this.auth.setRoleId(this.currentRoleId.toString());
          this.auth.setFullname(branch.fullname);
          this.auth.setCustomerType(customerType.toString());
          this.getPrivileges();
          setTimeout(() => {
            this.getRolesStatus = CoreStates.sent;
          }, 300);
        },
        (error: any) => {
          this.getRolesStatus = CoreStates.sent;
        }
      );
  }

  getPrivileges() {
    this.service.getManagerPrivileges().subscribe(
      (data: string[]) => {
        this.auth.setActions(data);
        this.getSmsActions();
        setTimeout(() => {
          this.getRolesStatus = CoreStates.sent;
        }, 300);
      },
      (error: any) => {
        this.getRolesStatus = CoreStates.sent;
      }
    );
  }

  getSmsActions() {
    this.service.getSmsServiceActionsAndPhone().subscribe(
      (data: string[]) => {
        this.auth.setSMSActions(data);
        this.auth.cabinet();
        setTimeout(() => {
          this.getRolesStatus = CoreStates.sent;
        }, 300);
      },
      (error: any) => {
        this.auth.cabinet();
        this.getRolesStatus = CoreStates.sent;
      }
    );
  }

  getUserRoles() {
    this.getRolesStatus = CoreStates.loading;
    this.service.getSubUserRoles().subscribe((data: SubUserRoleModel[]) => {
      this.getRolesStatus = CoreStates.loaded;
      this.userRoles = data;
    });
  }

  getShort(name: string): string {
    if (name && name.length > 40) {
      return name.substring(0, 40) + ' ...';
    }
    return name;
  }
}
