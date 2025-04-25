import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CabinetRoutingModule } from './cabinet-routing.module';
import { CabinetComponent } from './cabinet.component';
import { SelectRoleComponent } from './select-role/select-role.component';
import { CabinetHeaderComponent } from './cabinet-header/cabinet-header.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CabinetComponent,
    SelectRoleComponent,
    CabinetHeaderComponent,
    BreadcrumbComponent,
    SidebarMenuComponent
  ],
  imports: [CommonModule, CabinetRoutingModule, TooltipModule, TranslateModule],
  exports: [SidebarMenuComponent, CabinetHeaderComponent, BreadcrumbComponent]
})
export class CabinetModule {}
