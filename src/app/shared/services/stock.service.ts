import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetReq } from '../model/getReq.model';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  readonly rootUrl = 'http://68.183.227.213/api/';
  reqHeader: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json'});
  end: Date = new Date();
  start: Date = new Date('2019-02-01');
  constructor(private http: HttpClient) { }
  stockList(): Observable<any>{
    const body: GetReq = {
      token: localStorage.getItem('userToken')
    }
    return this.http.post(this.rootUrl + 'getallstocks', body, { headers: this.reqHeader });
  }
  deleteStock(id): Observable<any>{
    const body: object = {
      id: id,
      token: localStorage.getItem('userToken')
    }
    return this.http.post(this.rootUrl + 'deletestock', body, { headers: this.reqHeader });
  }
  stockByFilter(pName = null, sId = null): Observable<any>{
    const body: object = {
      product_name: pName,
      store_id: sId,
      token: localStorage.getItem('userToken')
    }
    return this.http.post(this.rootUrl + 'getallstocksbyfilter', body, { headers: this.reqHeader });
  }
  stockLog():Observable<any>{
    const body: GetReq = {
      token: localStorage.getItem('userToken')
    }
    return this.http.post(this.rootUrl + 'getallstocklogs', body, { headers: this.reqHeader });
  }
  updateStock(id: number, pId: number, sId: number, quantity: number):Observable<any>{
    const body: object = {
      product_id:pId,
  	  id:id,
	    store_id: sId,
  	  stock_quantity: quantity,
	    token: localStorage.getItem('userToken')
    }
    console.log(body);
    
    return this.http.put(this.rootUrl + 'updatestock', body, { headers: this.reqHeader });
  }
  getStockByFilter( name = null, category = null, subcategory = null, store = null): Observable<any>{
    // if(start == null){
    //   var dd = String(this.start.getDate()).padStart(2, '0');
    //   var mm = String(this.start.getMonth() + 1).padStart(2, '0'); //January is 0!
    //   var yyyy = this.start.getFullYear();

    //   start = yyyy + '-'+ mm + '-' + dd;
    // }
    // if(end == null){
    //   var dd = String(this.end.getDate()).padStart(2, '0');
    //   var mm = String(this.end.getMonth() + 1).padStart(2, '0'); //January is 0!
    //   var yyyy = this.end.getFullYear();

    //   end =yyyy + '-'+ mm + '-' + dd;
    // }
    const body: object = {
      token:localStorage.getItem('userToken'),
      // start_date: start,
      // end_date: end,
      product_name: name,
      category_id: category,
      subcategory_id: subcategory,
      store_id: store
    }
    console.log(body);
    
    return this.http.post(this.rootUrl + 'getallstocksbyfilter', body, { headers: this.reqHeader });
  }
  moveStock(pId, Id, data):Observable<any>{
    const body: object = {
      token:localStorage.getItem('userToken'),
      product_id: pId,
      id: Id,
      data: data
    }
    console.log(body);
    
    return this.http.post(this.rootUrl + 'movestock', body, { headers: this.reqHeader });
  }
}
