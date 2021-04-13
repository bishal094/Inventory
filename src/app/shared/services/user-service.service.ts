import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Login } from '../model/Login.model';
import { Observable } from 'rxjs';
import { EmailValidator } from '@angular/forms';
import { delay } from 'rxjs/operators';
import { GetReq } from '../model/getReq.model';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  
  readonly rootUrl = 'http://68.183.227.213';
  reqHeader = new HttpHeaders({ 'Content-Type': 'application/json'});
  constructor(private http: HttpClient) { }

  registerUser(email, password, userName, role, store):Observable<any> {
    const body: Object = {
      email: email,
      password: password,
      role: role,
      username: userName,
      store_id: store,
      token: localStorage.getItem('userToken')
    }
    return this.http.post(this.rootUrl + '/api/register', body, { headers: this.reqHeader });
  }
  changePassword(old, newPass):Observable<any> {
    const body:object = {
      email: localStorage.getItem('email'),
    old_password: old,
    new_password: newPass,
    token: localStorage.getItem('userToken')
    }
    return this.http.post(this.rootUrl + '/api/changePassword', body, { headers: this.reqHeader });
  }
  logoutUser(){
    localStorage.removeItem('isLoggedin');
    localStorage.removeItem('userToken');
    localStorage.removeItem('email');
    localStorage.removeItem('userRole');
    localStorage.removeItem('storeId');
  }
  canAccess(){
    if(localStorage.getItem('userRole') == 'admin'||localStorage.getItem('userRole') == 'sadmin'){
        return true;
    }
    return false;
  }
  isSuperAdmin(){
    if(localStorage.getItem('userRole') == 'sadmin'){
      return true;
    }
    return false;
  }
  userList():Observable<any>{
    const body: GetReq = {
      token: localStorage.getItem('userToken')
    }
    return this.http.post(this.rootUrl + '/api/getallusers', body, { headers: this.reqHeader });
  }
  
  userAuthentication(userName, upassword):Observable<any> {
    const body: Login = {
      email: userName,
      password: upassword
    }
    return this.http.post(this.rootUrl + '/api/login', body, { headers: this.reqHeader }).pipe(delay(3000));
  }
}
