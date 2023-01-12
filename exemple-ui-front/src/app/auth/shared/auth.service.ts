import { HttpStatusCode, HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import moment from 'moment';
import { Observable } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { Token } from '../../shared/token';

export class UnauthorizedError implements Error {

    readonly name = 'UnauthorizedError';
    readonly message: string;
}

@Injectable()
export class AuthService {

    private static readonly LOCATION_MATCHER = /.*code=([a-zA-Z0-9\-_]*)(&state=)?/g;

    constructor(private readonly http: HttpClient) { }

    clientCredentials(clientId: string, secret: string): Observable<Token> {

        const body = new HttpParams()
            .append('grant_type', 'client_credentials')
            .append('scope', 'account:create login:head login:create ROLE_APP');

        return this.token(clientId, secret, body);
    }

    password(clientId: string, secret: string, username: string, password: string): Observable<Token> {

        const loginData = new HttpParams()
            .append('username', username)
            .append('password', password);

        return this.http.post<Token>('/ExempleAuthorization/login',
            loginData,
            {
                headers: new HttpHeaders({
                    'app': 'test'
                }),
                observe: 'response'
            }).pipe(
                mergeMap(loginResponse => {
                    const authorizationData = new HttpParams()
                        .append('response_type', 'code')
                        .append('client_id', 'test_service_user')
                        .append('scope', 'account:read account:update login:head login:read login:create login:update');
                    const xAuthToken = loginResponse.headers.get('x-auth-token');
                    return this.http.get<void>('/ExempleAuthorization/oauth/authorize',
                        {
                            params: authorizationData,
                            headers: { 'x-auth-token': xAuthToken },
                            observe: 'response'
                        }
                    ).pipe(mergeMap(authorizeResponse => {

                        const location = authorizeResponse.headers.get('location');

                        const matches = AuthService.LOCATION_MATCHER.exec(location);
                        const code = matches[1];

                        const authorization = new HttpParams()
                            .append('grant_type', 'authorization_code')
                            .append('code', code)
                            .append('client_id', 'test_service_user');

                        return this.token(clientId, secret, authorization);
                    }));
                }),
                catchError((error: HttpErrorResponse) => {

                    if (error.status === HttpStatusCode.Unauthorized) {
                        throw new UnauthorizedError();
                    }

                    throw error;
                }));

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
                    t.expires_in = t.expires_in / moment.duration(1, 'days').asSeconds();
                    return t;
                })
            );
    }
}
