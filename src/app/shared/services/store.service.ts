import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetReq } from '../model/getReq.model';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  readonly rootUrl = 'http://68.183.227.213/api/';
  reqHeader: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json'});
  constructor(private http: HttpClient) { }
  addStore(name, address, description, gFlag): Observable<any>{
    const body: object = {
      name: name,
      address: address,
      description: description,
      token: localStorage.getItem('userToken'),
      is_godown: gFlag
    }
    return this.http.post(this.rootUrl + 'addstores', body, { headers: this.reqHeader });
  }
  storeList(): Observable<any>{
    const body: GetReq = {
      token: localStorage.getItem('userToken')
    }
    return this.http.post(this.rootUrl + 'getallstores', body, { headers: this.reqHeader });
  }
  updateStore(id, name, location, description):Observable<any>{
    
    const body: object = {
      id:id,
      name:name,
      address: location,
      description:description,
      token: localStorage.getItem('userToken')
    }
    return this.http.put(this.rootUrl + 'updatestore', body, { headers: this.reqHeader });
  }
  deleteStore(id):Observable<any>{
    
    const body: object = {
      id:id,
      token: localStorage.getItem('userToken')
    }
    return this.http.post(this.rootUrl + 'deletestore', body, { headers: this.reqHeader });
  }
}
