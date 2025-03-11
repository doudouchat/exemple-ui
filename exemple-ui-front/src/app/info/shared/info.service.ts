import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Info } from './info';

@Injectable({ providedIn: 'root' })
export class InfoService {

  constructor(private readonly http: HttpClient) { }

  info(): Observable<Info> {

    return this.http.get<Info>('/ExempleService/actuator/info',
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

}
