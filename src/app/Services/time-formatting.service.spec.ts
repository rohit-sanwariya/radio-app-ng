import { TestBed } from '@angular/core/testing';

import { TimeFormattingService } from './time-formatting.service';

describe('TimeFormattingService', () => {
  let service: TimeFormattingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeFormattingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
