import { Component, OnInit } from '@angular/core';
import { UserServiceService, ProductService, SubCategoryService, CategoryService } from 'src/app/shared/services';
import { Category } from 'src/app/shared/model/category.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { Cached } from 'src/app/shared/providers/data-provider';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  categories: Array<object> = [];
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  subCategories: Array<object> = [];
  message: string;
  constructor(
    private router: Router, 
    private userService: UserServiceService,
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
    private cache: Cached,
    private ngxService: NgxUiLoaderService
    ) { }

  ngOnInit() {
    this.ngxService.start();
    this.ngxService.startLoader('loader-01');
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      columnDefs: [
        { "orderable": false, "targets": [4,5] }
      ]
    }
    this.categoryService.getCategories().subscribe(data =>{
      this.ngxService.stopLoader('loader-01');
      this.ngxService.stop(); 
      if(data.message == 'InvalidToken'){
        this.userService.logoutUser()
        this.router.navigate(['/login',{message: 'Token Expired'}]);
      }
      else{
        this.cache.categories = data.data;
        this.categories = data.data;
        this.dtTrigger.next();
      }
      this.activatedRoute.paramMap.subscribe(params => {
        let message = params.get('message');
        if(message != null){
          this.message = message;
        }
      });
      setTimeout(() => { this.message = null }, 4000);
    })
    
  }
  edit(categoryToEdit: Category){
    this.router.navigate(['/category/edit',categoryToEdit.id]);
  }
  Add(){
    this.router.navigate(['/category/addcategory']);
  }
  delete(id){
    var self = this;
      bootbox.confirm({
        message: "Are you sure you want to permanently delete the category?",
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
            self.categoryService.deleteCategory(id).subscribe(data => {
              self.message = data.message;
              if(data.success){
                self.categories = self.categories.filter(t => t['id'] != id)
              }
            })
          }
        }
    });
  }
}
