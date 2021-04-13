import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Category } from '../model/category.model';
import { Observable } from 'rxjs';
import { GetReq } from '../model/getReq.model';
import { UpdateCategory } from '../model/updateCategory.model'

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  readonly rootUrl = 'http://68.183.227.213/api/';
  reqHeader: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json'});
  constructor(private http: HttpClient) { }
  
  addCategory(categoryName: string): Observable<any> {
    const body: Category = {
      id: null,
      name: categoryName,
      token: localStorage.getItem('userToken'),
    }
    return this.http.post(this.rootUrl + 'addcategory', body, { headers: this.reqHeader });
  }
  getCategories():Observable<any>{
    const body: GetReq = {
      token: localStorage.getItem('userToken')
    } 
    return this.http.post(this.rootUrl + 'getAllCategories', body, { headers: this.reqHeader});
  }
  updateCategory(categoryId,oldName, newName):Observable<any>{
    const body: UpdateCategory = {
      name: oldName,
      id: categoryId,
      new_name: newName,
      token: localStorage.getItem('userToken')
    }
    return this.http.put(this.rootUrl + 'updateCategory', body, {headers: this.reqHeader});
  }
  deleteCategory(id):Observable<any>{
    const body: object = {
      id:id,
      token: localStorage.getItem('userToken')
    }
  return this.http.post(this.rootUrl + 'deletecategory', body, {headers: this.reqHeader});
  }
}
