import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetReq } from '../model/getReq.model';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  readonly rootUrl = 'http://68.183.227.213/api/';
  reqHeader: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json'});
  end: Date = new Date();
  start: Date = new Date('2019-02-01');
  constructor(private http: HttpClient) { }
  addSale(saleData,paymentMethod, payDetail,custName, custAddress, custPan, dateOfSale, billNo, storeID: number, grandTotal):Observable<any>{
    const body: object = {
      customer_name: custName,
	    bill_date: dateOfSale,
	    customer_address: custAddress,
	    bill_number: billNo,
	    pan_number: custPan,
	    payment_by: paymentMethod,
	    payment_by_detail: payDetail,
	    store_id: storeID,
	    total_price: grandTotal,
      data: saleData,
      token: localStorage.getItem('userToken')
    }
    console.log(body);
    
    return this.http.post(this.rootUrl + 'addsale', body, { headers: this.reqHeader });
  }
  getAllSales():Observable<any>{
    const body: GetReq = {
      token: localStorage.getItem('userToken')
    }
    return this.http.post(this.rootUrl + 'getallsale', body, { headers: this.reqHeader });
  }
  updateSale(
    id, name, addedby,mrp,costprice, quantity,discount,
    dateofpurchase,category,subcategory,soldby,discountgiven, 
    dateofsale, soldPrice, imagePath, stockId
    ): Observable<any>{
    const body: object = {
      id: id,
      name: name,
      added_by:addedby,
      mrp: mrp,
      cost_price: costprice,
      quantity: quantity,
      discount: discount,
      date_of_purchase: dateofpurchase,
      category_id: category,
      subcategory_id: subcategory,
      sold_by:soldby,
      image_path: imagePath,
      sold_price:soldPrice,
      discount_given: discountgiven,
      date_of_sale: dateofsale,
      stock_id: stockId,
      store_id: localStorage.getItem('storeId'),
      token: localStorage.getItem('userToken')
    }
    console.log(body)
    return this.http.put(this.rootUrl + 'updatesale', body, { headers: this.reqHeader });
  }
  deleteSale(id):Observable<any>{
    const body: object = {
      id:id,
      token: localStorage.getItem('userToken')
    }
    return this.http.post(this.rootUrl + 'deletesale', body, { headers: this.reqHeader });
  }
  getStockForSale():Observable<any>{
    const body: GetReq = {
      token: localStorage.getItem('userToken')
    }
    return this.http.post(this.rootUrl + 'getstockforsale', body, { headers: this.reqHeader });
  }
  getSalesByFilter(start, end, name = null, category = null, subcategory = null): Observable<any>{
    if(start == null){
      var dd = String(this.start.getDate()).padStart(2, '0');
      var mm = String(this.start.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = this.start.getFullYear();

      start = yyyy + '-'+ mm + '-' + dd;
    }
    if(end == null){
      var dd = String(this.end.getDate()).padStart(2, '0');
      var mm = String(this.end.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = this.end.getFullYear();

      end =yyyy + '-'+ mm + '-' + dd;
    }
    const body: object = {
      token:localStorage.getItem('userToken'),
      start_date: start,
      end_date: end,
      product_name: name,
      category_id: category,
      subcategory_id: subcategory
    }
    return this.http.post(this.rootUrl + 'getallsalesbyfilter', body, { headers: this.reqHeader });
  }
  getBillByFilter(start, end, storeId: number): Observable<any>{
    if(start == null){
      var dd = String(this.start.getDate()).padStart(2, '0');
      var mm = String(this.start.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = this.start.getFullYear();

      start = yyyy + '-'+ mm + '-' + dd;
    }
    if(end == null){
      var dd = String(this.end.getDate()).padStart(2, '0');
      var mm = String(this.end.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = this.end.getFullYear();

      end =yyyy + '-'+ mm + '-' + dd;
    }
    const body: object = {
      token:localStorage.getItem('userToken'),
      start_date: start,
      end_date: end,
      store_id: storeId
    }
    return this.http.post(this.rootUrl + 'getBillByFilter', body, { headers: this.reqHeader });
  }
  getSalesByBill(Id): Observable<any>{
    const body: object = {
      token:localStorage.getItem('userToken'),
      bill_id: Id
    }
    return this.http.post(this.rootUrl + 'getallsalesbyfilter', body, { headers: this.reqHeader });

  }
}
