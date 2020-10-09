import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Token } from './token';

@Injectable()
export class AppService {

    constructor(private readonly http: HttpClient) { }

    token(clientId: string, secret: string): Observable<Token> {

        const body = new HttpParams()
            .append('grant_type', 'client_credentials');

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
                })
            );
    }

}
