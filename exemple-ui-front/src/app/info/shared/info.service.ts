import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Info } from './info';

@Injectable()
export class InfoService {

    constructor(private readonly http: HttpClient) { }

    info(): Observable<Info> {

        return this.http.get<Info>('http://localhost:8080/ExempleService/ws/info',
            { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
    }

}
