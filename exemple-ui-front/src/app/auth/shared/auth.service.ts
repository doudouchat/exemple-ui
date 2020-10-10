import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Token } from '../../shared/token';

export class UnauthorizedError implements Error {

    readonly name = 'UnauthorizedError';
    readonly message: string;
}

@Injectable()
export class AuthService {

    constructor(private readonly http: HttpClient) { }

    client_credentials(clientId: string, secret: string): Observable<Token> {

        const body = new HttpParams()
            .append('grant_type', 'client_credentials');

        return this.token(clientId, secret, body);
    }

    password(clientId: string, secret: string, username: string, password: string): Observable<Token> {

        const body = new HttpParams()
            .append('grant_type', 'password')
            .append('username', username)
            .append('password', password)
            .append('client_id', clientId)
            .append('redirect_uri', 'xxx');

        return this.token(clientId, secret, body);

    }

    private token(clientId: string, secret: string, body: HttpParams): Observable<Token> {

        return this.http.post<Token>('/ExempleAuthorization/oauth/token',
            body,
            {
                headers: new HttpHeaders({
                    'Content-type': 'application/x-www-form-urlencoded; charset=utf-8',
                    Authorization: 'Basic ' + btoa(`${clientId}:${secret}`)
                })
            }).pipe(
                map((t: Token) => {
                    t.expires_in = t.expires_in / 86400;
                    return t;
                }),
                catchError((error: HttpErrorResponse) => {

                    if (error.status === 401) {
                        throw new UnauthorizedError();
                    }

                    throw error;
                })
            );
    }
}
