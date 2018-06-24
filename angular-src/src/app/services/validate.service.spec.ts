/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from 'c:/Projects/TradeIt/angular-src/node_modules/@angular/core/testing/index';
import { ValidateService } from './validate.service';

describe('ValidateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValidateService]
    });
  });

  it('should ...', inject([ValidateService], (service: ValidateService) => {
    expect(service).toBeTruthy();
  }));
});
