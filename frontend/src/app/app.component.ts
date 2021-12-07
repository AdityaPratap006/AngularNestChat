import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import {
  TestResponse,
  TestService,
} from './services/test-service/test.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';

  constructor(private testService: TestService) {}

  testValue: Observable<TestResponse> = this.testService.getText();
}
