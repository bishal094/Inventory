import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { SubCategory } from '../model/subCategory.model';
import { Observable } from 'rxjs';
import { GetReq } from '../model/getReq.model';

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {

  readonly rootUrl = 'http://68.183.227.213/api/';
  reqHeader: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json'});
  constructor(private http: HttpClient) { }
  addSubCategory(subCategoryName, categoryId, imageb64):Observable<any>{
    const body: object = {
      category_id: parseInt(categoryId),
      name: subCategoryName,
      image: imageb64,
      id: null,
      token: localStorage.getItem('userToken')
    }
    return this.http.post(this.rootUrl + 'addsubcategory', body, { headers: this.reqHeader });
  }
  updateSubCategory(sname,catId,subCatId): Observable<any>{
    const body: object = {
      category_id: parseInt(catId),
      name: sname,
      id: parseInt(subCatId),
      token: localStorage.getItem('userToken')
    }
    return this.http.put(this.rootUrl + 'updatesubcategory', body, { headers: this.reqHeader });
  }
  getSubCategories(): Observable<any>{
    const body: GetReq ={
      token: localStorage.getItem('userToken')
    }
    return this.http.post(this.rootUrl + 'getAllSubCategories', body, { headers: this.reqHeader });
  }
  getSubCategoriesById(categoryId): Observable<any>{
    const body: object ={
      category_id: parseInt(categoryId),
      token: localStorage.getItem('userToken')
    }
    return this.http.post(this.rootUrl + 'getSubCategoriesByCategoryId', body, { headers: this.reqHeader });
  }
  deleteSubCategory(id):Observable<any>{
    const body: object = {
      id:id,
      token: localStorage.getItem('userToken')
    }
    return this.http.post(this.rootUrl + 'deletesubcategory', body, { headers: this.reqHeader });
  }
}
