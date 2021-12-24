import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from 'src/app/models/user/user.interface';
import { LoginResponse } from '../../../models/auth/login-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private snackbar: MatSnackBar) {}

  login(user: User): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('api/users/login', user).pipe(
      tap((res: LoginResponse) => {
        localStorage.setItem('auth_token', res.access_token);
      }),
      tap(() => {
        this.snackbar.open(`Logged in!`, 'Close', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }),
      catchError((e) => {
        this.snackbar.open(
          `Login failed, due to: ${e.error.message}`,
          'Close',
          {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          }
        );
        return throwError(e);
      })
    );
  }
}
