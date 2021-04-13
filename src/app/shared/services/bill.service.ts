import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class BillService {

    readonly rootUrl = 'http://68.183.227.213/api/';
    reqHeader: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json'});
    end: Date = new Date();
    start: Date = new Date('2019-02-01');
    constructor(private http: HttpClient) { }
    getAllbills(start, end, storeId: string, name = null): Observable<any> {
        if(start == null||start == ""){
            var dd = String(this.start.getDate()).padStart(2, '0');
            var mm = String(this.start.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = this.start.getFullYear();
      
            start = yyyy + '-'+ mm + '-' + dd;
          }
          if(end == null||end == ""){
            var dd = String(this.end.getDate()).padStart(2, '0');
            var mm = String(this.end.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = this.end.getFullYear();
      
            end =yyyy + '-'+ mm + '-' + dd;
          }
        const body: object = {
          store_id: storeId,
          start_date: start,
          end_date: end,
          bill_number: name,
          token: localStorage.getItem('userToken'),
        }
        console.log(body);
        
        return this.http.post(this.rootUrl + 'getBillByFilter', body, { headers: this.reqHeader });
    }
}
