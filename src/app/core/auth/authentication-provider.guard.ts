import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree
} from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationProviderGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private router: Router,
    private auth: AuthenticationService
  ) {}

  private checkAuth() {
    if (this.auth.isAuthenticated() && this.auth.getRole() === 'provider') {
      return true;
    }
    this.auth.redirect();
    return false;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.checkAuth() && this.checkRole(route.routeConfig.path);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.checkAuth();
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.checkAuth();
  }

  checkRole(path: string): boolean {
    if (path === this.auth.getRole()) {
      return true;
    }
    this.auth.redirectToHome();
    return false;
  }
}
