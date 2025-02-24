import { TestBed } from '@angular/core/testing';

import { BraidingStyleService } from './braiding-style.service';

describe('BraidingStyleService', () => {
  let service: BraidingStyleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BraidingStyleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
