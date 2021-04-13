import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { GetReq } from '../model/getReq.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  readonly rootUrl = 'http://68.183.227.213/api/';
  reqHeader: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json'});
  constructor(private http: HttpClient) { }
  getDashboardData():Observable<any>{
    const body: GetReq = {
      token: localStorage.getItem('userToken')
    } 
    return this.http.post(this.rootUrl + 'getalldashboarddata', body, { headers: this.reqHeader});
  }
  getDashboardDataFilter(date):Observable<any>{
    console.log(date);
    
    const body: object = {
      date: date,
      token: localStorage.getItem('userToken')
    } 
    return this.http.post(this.rootUrl + 'getalldashboarddatabyfilter', body, { headers: this.reqHeader});
  }
}
