import { TestBed } from '@angular/core/testing';

import { PokeapiInterceptor } from './pokeapi.interceptor';

describe('PokeapiInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      PokeapiInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: PokeapiInterceptor = TestBed.inject(PokeapiInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
