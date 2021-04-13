import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetReq } from '../model/getReq.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  readonly rootUrl = 'http://68.183.227.213/api/';
  end: Date = new Date();
  start: Date = new Date('2019-02-01');
  reqHeader: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }
  
  getAllProducts(start = this.start, end = this.end, name = null, category = null, subcategory = null): Observable<any>{
    const body: object = {
      token:localStorage.getItem('userToken'),
      start_date: start,
      end_date: end,
      product_name: name,
      category_id: category,
      subcategory_id: subcategory
    }
    
    return this.http.post(this.rootUrl + 'getallproducts', body, { headers: this.reqHeader });
  }
  getProductsByFilter(start, end, name = null, category = null, subcategory = null): Observable<any>{
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
    console.log(body);
    
    return this.http.post(this.rootUrl + 'getallproductsbyfilter', body, { headers: this.reqHeader });
  }
  addNewProduct(productName, subCategoryName, 
    categoryName, stores ,dp, costPrice, mRP, discount, quantity, image):Observable<any> {
    const body: object = {
      name: productName,
      category: parseInt(categoryName),
      subcategory: parseInt(subCategoryName),
      stores: stores,
      image_base64: image,
      mrp: parseInt(mRP),
      costprice: parseInt(costPrice),
      quantity: parseInt(quantity),
      date_of_purchase: dp,
      discount: parseInt(discount),
      token: localStorage.getItem('userToken')
    }
    console.log(body);
    
    return this.http.post(this.rootUrl + 'addproduct', body, { headers: this.reqHeader });
  }
  deleteProduct(category_id): Observable<any>{
    const body: object = {
      id: parseInt(category_id),
      token: localStorage.getItem('userToken')
    }
    return this.http.post(this.rootUrl + 'deleteproduct', body, { headers: this.reqHeader });
  }
  updateProduct(id, productName, subCategoryName, 
    categoryName, dp, costPrice, mRP, discount, qty, image): Observable<any>{
    const body: object = {
      id: id,
      name: productName,
      mrp: parseInt(mRP),
      costprice: parseInt(costPrice),
      // quantity: parseInt(qty),
      discount: parseInt(discount),
      date_of_purchase: dp,
      category_id: parseInt(categoryName),
      subcategory_id: parseInt(subCategoryName),
      token: localStorage.getItem('userToken'),
      image_base64: image
    }
    console.log(body);
    
    return this.http.put(this.rootUrl + 'updateproduct', body, { headers: this.reqHeader });
  }
  productLog(): Observable<any>{
    const body: GetReq = {
      token: localStorage.getItem('userToken')
    }
    return this.http.post(this.rootUrl + 'getallproductlogs', body, { headers: this.reqHeader });
  }
}
