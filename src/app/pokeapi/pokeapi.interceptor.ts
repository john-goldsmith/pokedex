import { Inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class PokeApiInterceptor implements HttpInterceptor {

  constructor(
    @Inject('POKEAPI_BASE_URL') private pokeApiBaseUrl: string
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const requestClone = request.clone({ url: `${this.pokeApiBaseUrl}/${request.url}` })
    return next.handle(requestClone);
  }
}
