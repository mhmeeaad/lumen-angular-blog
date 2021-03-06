import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CookiesService } from './cookies.service';
import { Http } from '@angular/http';
import { Headers, Response, RequestOptions, RequestMethod, URLSearchParams, Request } from '@angular/http';

@Injectable()
export class AuthService {
public url = 'http://localhost:8000/users/login';
  constructor(private http: Http, private cookies: CookiesService, private router: Router) {

   }

   public login($data , $url = this.url): Promise<any> {
    let headers: Headers = new Headers({ "Content-Type": "application/json" }),
        submitedData: Object = $data,
        requestOptions: RequestOptions = new RequestOptions({
          method: RequestMethod.Post,
          url: $url,
          headers: headers,
          body: JSON.stringify(submitedData)
        });
    return this.http.request(new Request(requestOptions)).toPromise()
      .then(response => {
        if (response.status !== 400 ) {
          this.cookies.setCookie('token', this._getBody(response)['token'], 7);  // ( * )
          return true;
          }else {
            return false;
          }
      })
      .catch(reject => {
        return false;
      });
  }

  private _getBody($data: Response) {
    const body = JSON.parse($data['_body']);
    return body || null;
  }

  public isLoggedIn(): Boolean {
    if (this.cookies.checkCookie('token')) {
      return true;
    } else {
      return false;
    }
  }

  public logout() {
    if (this.cookies.checkCookie('token')) {
      this.cookies.removeCookie('token');
      this.router.navigate(['/']);
    }
  }
}
