import { Component, OnInit, ViewChild } from '@angular/core';
import { Product } from 'src/app/shared/model/product.model';
import { ProductService, UserServiceService } from 'src/app/shared/services';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductDisplay } from 'src/app/shared/model/productDisplay.model';
import { Subject } from 'rxjs';
import { Cached } from 'src/app/shared/providers/data-provider';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  products: ProductDisplay[];
  message: string;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  isCollapsed: boolean = true;
  canView: boolean = true;
  categories;
  subCategories: any;
  optionsSubCategory: any;
  optionsCategory: any;
  constructor(
    private productService: ProductService, 
    private router: Router,
    private userService: UserServiceService,
    private activatedRoute: ActivatedRoute,
    private cache: Cached,
    private ngxService: NgxUiLoaderService
    ) { }

  ngOnInit() {
    this.ngxService.start();
    this.ngxService.startLoader('loader-01');
    this.canView = this.userService.canAccess(); 
    if(this.canView){
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 10,
        processing: true,
        columnDefs: [
          { "orderable": false, "targets": [4,5,6,7] }
        ],
        order: [[ 0, "desc" ]],
        destroy: true
      }
    }
    else{
      this.dtOptions = {
        pagingType: 'full_numbers',
        pageLength: 5,
        processing: true,
        columnDefs: [
          { "orderable": false, "targets": [4,5] }
        ],
        order: [[ 0, "desc" ]],
        destroy: true
      }
    }
    this.productService.getAllProducts().subscribe(data =>{
      this.ngxService.stopLoader('loader-01');
      this.ngxService.stop(); 
      if(data.message == 'InvalidToken'){
        this.userService.logoutUser()
        this.router.navigate(['/login',{message: 'Token Expired'}]);
      }
      else{
        this.products = data.data.products;
        this.cache.products = data.data.products;
        this.cache.categories = data.data.categories;
        this.categories = data.data.categories;
        this.cache.subCategories = data.data.subcategories;
        this.subCategories = data.data.subcategories;
        this.dtTrigger.next();
      }
      this.activatedRoute.paramMap.subscribe(params => {
        let data = params.get('category');
        if(data!=null){
          this.products = this.products.filter(t => t.category == data)
        }
        let message = params.get('message');
        if(message != null){
          this.message = message;
        }
      });
      setTimeout(() => { this.message = null }, 4000);
    })
    }
    productDetails(product: Product){
      this.router.navigate(['/product/Details',product.id]);
    }
    edit(product: Product){
      this.router.navigate(['/product/edit',product.id,{name: product.name}]);
    }
    delete(product){
      var self = this;
      bootbox.confirm({
        message: "Are you sure you want to delete the product: " +product.name + " and all the saved stock in the stores ?",
        buttons: {
            confirm: {
                label: 'Delete',
                className: 'btn-danger'
            },
            cancel: {
                label: 'Cancel',
                className: 'btn-primary'
            }
        },
        callback: function (result) {
          
          if(result == true){
            self.productService.deleteProduct(product.id).subscribe(data => {
              self.message = data.message;
              self.products = self.products.filter(t => t.id != product.id)
              setTimeout(() => { self.message = null }, 4000);
            })
          }
        }
    });  
    }
    ApplyFilter(product_name, start_date, end_date){
      if(start_date == ""){
        start_date = null
      }
      if(end_date == ""){
        end_date = null
      }
      if(product_name == ""){
        product_name = null
      }
      this.productService.getProductsByFilter(start_date, end_date,product_name, this.optionsCategory,this.optionsSubCategory).subscribe(data =>{
        if(data.success == false){
          this.message = data.message;
          setTimeout(() => { this.message = null }, 4000);
        }
        else{
          this.products = data.data.products;
          this.message = "Filter Applied";
          this.isCollapsed = true;
          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            // Destroy the table first
            dtInstance.destroy();
          });
          // Call the dtTrigger to rerender again
          this.dtTrigger.next();
          setTimeout(() => { this.message = null }, 4000);
        }
      })
    }
}
