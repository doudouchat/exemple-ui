import { HttpStatusCode, HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of, throwError, from } from 'rxjs';
import { catchError, map, mergeMap, takeWhile } from 'rxjs/operators';

import { Login } from './login';

@Injectable({ providedIn: 'root' })
export class LoginService {

  private readonly http = inject(HttpClient);

  checkUsername(username: string): Observable<boolean> {

    return from([`/ExempleAuthorization/ws/v1/logins/${username}`, `/ExempleService/ws/v1/logins/${username}`])
      .pipe(mergeMap(url => this.http.head<boolean>(url,
        {
          headers: new HttpHeaders({
            app: 'test'
          })
        }).pipe(
          map(() => true),
          catchError((error: HttpErrorResponse) => {

            if (error.status === HttpStatusCode.NotFound) {
              return of(false);
            }

            return throwError(() => error);
          })
        ))).pipe(takeWhile(exist => !exist, true));
  }

  createLogin(login: Login): Observable<void> {
    return this.http.put<void>(`/ExempleAuthorization/ws/v1/logins/${login.username}`,
      JSON.stringify({ password: login.password }), {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        app: 'test'
      })
    });
  }

  getLogin(username: string): Observable<string> {

    return this.http.get<string>(`/ExempleService/ws/v1/logins/${username}`,
      {
        headers: new HttpHeaders({
          app: 'test',
          version: 'v1'
        })
      });
  }

  updateLogin(login: Login, previousLogin: Login): Observable<HttpResponse<void>> {

    return this.http.post<void>(`/ExempleAuthorization/ws/v1/logins/move`,
      JSON.stringify(
        {
          fromUsername: previousLogin.username,
          toUsername: login.username
        }), {
      headers:
        new HttpHeaders({
          'Content-type': 'application/json',
          app: 'test'
        }),
      observe: 'response'
    });
  }
}
