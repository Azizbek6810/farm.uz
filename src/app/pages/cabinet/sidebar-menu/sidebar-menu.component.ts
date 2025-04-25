import { Component, Input, OnInit } from '@angular/core';
import { LeftMenu } from '../cabinet.models';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/core/auth/authentication.service';
import { CabinetService } from '../cabinet.service';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.css']
})
export class SidebarMenuComponent implements OnInit {
  @Input('roleType') roleType: string;
  leftMenu: LeftMenu[] = [];
  roleName: string;
  env: any = environment;

  constructor(
    private auth: AuthenticationService,
    private service: CabinetService
  ) {
    this.roleName = this.auth.getRole();
  }

  ngOnInit(): void {
    this.getMenu();
  }

  getMenu() {
    // @ts-ignore
    const data: any = import('../../../core/schema/menu-list.json');
    data.then((data: any) => {
      switch (this.roleType) {
        case 'customer':
          this.leftMenu = (data as any).customer.menu;
          break;
        case 'provider':
          this.leftMenu = (data as any).provider.menu;
          break;
        default:
          console.log(data);
          break;
      }
    });
  }

  showMenu(idx: number) {
    this.leftMenu[idx].isHide = !this.leftMenu[idx].isHide;
  }
}
