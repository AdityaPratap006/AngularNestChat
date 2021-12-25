import { TestBed } from '@angular/core/testing';

import { PublicAuthGuard } from './public-auth.guard';

describe('PublicAuthGuard', () => {
  let guard: PublicAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PublicAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
