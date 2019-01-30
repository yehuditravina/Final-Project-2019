import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {map, catchError} from 'rxjs/operators';
import {User} from '../models/User.class';
import {ROOT_URL} from '../config';
import {CurrentUser} from '../currentUser';
import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {CookieService} from 'ngx-cookie-service';
import {Customer} from '../models/Customer.class';
import {SiteUser} from '../models/SiteUser.class';


@Injectable({
  providedIn: 'root'
})
export class SiteUserService {

  constructor(private httpClient: HttpClient,
              private currentUser: CurrentUser,
              private authService: AuthService,
              private cookieService: CookieService) {
  }

  login(userName: string, password: string): Observable<User> {
    let siteuser: SiteUser = new SiteUser();
    siteuser.userName = userName;
    siteuser.password = password; // {UserName: userName, Password: password}
    return this.httpClient
      .post<User>(ROOT_URL + 'user/login', {UserName: userName, Password: password})
      .pipe(
        map(
          data => {
            debugger;
            this.currentUser.set(data);
            this.authService.setRouter();
            return data;
          },
          error => {
            debugger;
            catchError(this.handleError);
          }
        ));
  }

  logout(): Observable<any> {
    this.currentUser.set(null);
    this.cookieService.deleteAll();
    this.authService.setRouter();
    return this.httpClient
      .post<any>(ROOT_URL + 'user/logout', '')
      .pipe(
        catchError(this.handleError),
      );
  }
//TODO registerWithId
  registerWithId(userName: string, password: string, authType: number, userId: number): Observable<User> {
    return this.httpClient
      .post<User>(ROOT_URL + 'user/register', JSON.stringify({userName, password, authType, userId}))
      .pipe(
        map(
          data => {
            debugger;
            this.currentUser.set(data);
            this.authService.setRouter();
            return data;
          },
          error => {
            catchError(this.handleError);
          }
        ));
  }

  // registerNew(userName: string, password: string, user: User): Observable<any> {
  //   return this.httpClient
  //     .get<number>(ROOT_URL + 'user/registerNew?userName=' + userName + '&password=' + password,)
  //     .pipe(
  //       map(
  //         data => {
  //           this.currentUser.set(data);
  //           this.authService.setRouter();
  //         },
  //         error => {
  //           catchError(this.handleError);
  //         }
  //       ));
  // }

  handleError(error) {
    debugger;
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  changePasword(userName: string) {
    return this.httpClient
      .get<String>(ROOT_URL + 'user/changePassword?userName=' + userName)
      .pipe(
        map(
          data => {
            alert('    אמור להשלח מייל עם הססמה' + data.toString());
          },
          error => catchError(this.handleError),
        ));
  }
}
