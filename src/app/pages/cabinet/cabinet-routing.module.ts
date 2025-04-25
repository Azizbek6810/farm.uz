import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CabinetComponent } from './cabinet.component';
import { SelectRoleComponent } from './select-role/select-role.component';
import { AuthenticationCustomerGuard } from 'src/app/core/auth/authentication-customer.guard';
import { AuthenticationProviderGuard } from 'src/app/core/auth/authentication-provider.guard';

const routes: Routes = [
  {
    path: '',
    component: CabinetComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/cabinet/select-role'
      },
      {
        path: 'select-role',
        pathMatch: 'full',
        component: SelectRoleComponent
      },
      {
        path: 'customer',
        loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
        canActivateChild: [AuthenticationCustomerGuard]
      },
      {
        path: 'provider',
        loadChildren: () => import('./provider/provider.module').then(m => m.ProviderModule),
        canActivateChild: [AuthenticationProviderGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CabinetRoutingModule {}
