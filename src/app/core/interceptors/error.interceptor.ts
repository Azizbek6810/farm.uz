import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../auth/authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthenticationService,
    private toast: ToastrService
  ) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err => {
        if (err.status === 401) {
          this.auth.logout();
        } else {
          let errorMessage = '';
          if (Object.keys(err).includes('status')) {
            if (err.status > 0) {
              errorMessage = err.error['message'];
            } else {
              errorMessage = 'Пожалуйста, попробуйте позже';
            }
          } else {
            errorMessage = 'Нет соединения с интернетом';
          }
          this.showError(errorMessage);
        }

        return throwError(() => err);
      })
    );
  }
  private showError(message: string) {
    this.toast.error('Ошибка', message, {
      closeButton: true,
      disableTimeOut: false,
      newestOnTop: true,
      tapToDismiss: true
    });
  }
}
