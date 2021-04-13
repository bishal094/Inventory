import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/shared/model/category.model';
import { SubCategory } from 'src/app/shared/model/subCategory.model';
import { ProductService, CategoryService, SubCategoryService, UserServiceService } from 'src/app/shared/services';
import { StoreService } from 'src/app/shared/services/store.service';
import { Router } from '@angular/router';
import { Store } from 'src/app/shared/model/store.model';
import { Cached } from 'src/app/shared/providers/data-provider';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  categories: Category[];
  subCategories: SubCategory[];
  allSubCategories: SubCategory[];
  image: string | ArrayBuffer;
  response;
  stores: Array<Store> = [];
  storeCounter: number;
  counter: number = 0;
  storeValues: Array<object>;
  message: string;
  addedStores: Array<object> = [];
  leftStores: Array<Store> = [];
  storeInputVis: boolean = true;
  buttonsEnabled: boolean = false;
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private storeService: StoreService,
    private userService: UserServiceService,
    private router: Router
    ) { }

  ngOnInit(message = null) {
    this.message = message
    this.storeService.storeList().subscribe(data => {
      if(data.message == 'InvalidToken'){
        this.userService.logoutUser()
        this.router.navigate(['/login',{message: 'Token Expired'}]);
      }
      else{
        this.stores = data.data.filter(t => t["isgodown"] == 1);
        this.leftStores = this.stores;
        this.storeCounter = data.data.length
        this.categoryService.getCategories().subscribe(data =>{
          console.log(data);
          
          this.categories = data.data
        })
        this.subCategoryService.getSubCategories().subscribe(data =>{
          console.log(data);
          
          this.subCategories = data.data;
          this.allSubCategories = this.subCategories;
        })
        // this.categories = this.cache.categories;
        // this.allSubCategories = this.cache.subCategories;
        // this.subCategories = this.allSubCategories;
      }
    })
    setTimeout(() => { this.message = null }, 10000);
  }
  handleFileInput(event){
    let me = this;
    let file = event.target.files[0];
    if(file.size<1048576){
      me.message = ""
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        me.image = reader.result;
        console.log(reader.result);
      };
      reader.onerror = function (error) {
        me.message += error;
      };
    }
    else{
      me.image = "Larger";
      me.message = "Please choose a file smaller than 1 MB";
      setTimeout(() => { me.message = null }, 4000);
    }
    
  }
  CategorySelected(catId){
    var pieces = catId.split('|')
    this.subCategories = this.allSubCategories.filter(t => t.category_name ==pieces[1]);
    console.log(pieces);
    
  }
  AddProduct(productName, subCategoryName, 
    categoryName, dp, costPrice, mRP, discount, lastStore, lastQuantity){
      if(lastStore !="" && lastQuantity != ""){
        var storePieces = lastStore.split('|')
        var addedStore = {
          id: parseInt(storePieces[0]),
          store_id: parseInt(storePieces[0]),
          name: storePieces[1],
          address: storePieces[2],
          quantity: parseInt(lastQuantity),
          number_of_products_in_store: null,
          description: null
        }
        this.addedStores.push(addedStore);
        this.leftStores = this.leftStores.filter(t => t.id != addedStore.store_id);
        }
      
      var pieces = categoryName.split('|')
      var quantity = 0;
      this.addedStores.forEach(addedStore => {
        quantity += parseInt(addedStore['quantity']);
      });
      if(this.image != "Larger"){
        this.productService.addNewProduct(productName, subCategoryName, 
          pieces[0], this.addedStores, dp, costPrice, mRP, discount, quantity, this.image).subscribe(data =>{
            if(data.message == 'InvalidToken'){
              this.userService.logoutUser()
              this.router.navigate(['/login',{message: 'Token Expired'}]);
            }
            if(data.success == false){
              this.buttonsEnabled = false;
              this.message = data.message;
              this.leftStores.push(addedStore)
              this.addedStores.pop();
              console.log('test');
              
              setTimeout(() => { this.message = null }, 4000);
            }
            else{
              this.buttonsEnabled = true;
              this.message = 'Product Added';
              // this.router.navigate(['/product/addProduct',{message: 'Product Added'}]);
              setTimeout(() => { location.reload(); }, 5000);
              
            }
        })
      }
      
  }
  AddStoreQuantity(store , qty){
    var isNum = /^\d+$/.test(qty);
    console.log(isNum);
    
    if(store == ""){
      this.message = "Please select a store"
      setTimeout(() => { this.message = null }, 4000);
    }
    
    else if(!isNum){
      this.message = "Please specify the quantity in numeric form"
      setTimeout(() => { this.message = null }, 4000);
    }
    else{
      var pieces = store.split('|')
      var addedStore = {
        store_id: parseInt(pieces[0]),
        name: pieces[1],
        address: pieces[2],
        quantity: parseInt(qty)
      }
      this.leftStores = this.leftStores.filter(t => t.id != addedStore.store_id);
      this.addedStores.push(addedStore);
      this.message = null
    }
  }
  RemoveStoreQuantity(storeToRemove){
    var removed_store = this.stores.find(t => t.name == storeToRemove);
    this.leftStores.push(removed_store);
    this.addedStores = this.addedStores.filter(t => t['name'] != storeToRemove)
  }
}
