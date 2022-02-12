import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(err =>{
        if (err){
          if (err.status===400){
            this.toastr.error(err.error.message, err.error.statusCode);
          }
          if (err.status===401){
            this.toastr.error(err.error.message, err.error.statusCode);
          }
          if (err.status === 404){
            this.router.navigateByUrl('/not-found');
          }
          if (err.status === 500){
            this.router.navigateByUrl('/server-error');
          }
        }
        return throwError(() => err);
      })
    );
  }
}
