import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TestResponse {
  title: string;
}

@Injectable({
  providedIn: 'root',
})
export class TestService {
  constructor(private httpClient: HttpClient) {}

  getText(): Observable<TestResponse> {
    return this.httpClient.get<TestResponse>('api');
  }
}
