import { Component, OnInit } from '@angular/core';
import { SubCategoryService, UserServiceService } from 'src/app/shared/services';
import { SubCategory } from 'src/app/shared/model/subCategory.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { Cached } from 'src/app/shared/providers/data-provider';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss']
})
export class SubCategoryComponent implements OnInit {

  subCategories: SubCategory[];
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  message: string;
  messageColor: string = "alert alert-success"
  constructor(private subCategoryService: SubCategoryService,
    private router: Router,
    private userService: UserServiceService,
    private activatedRoute: ActivatedRoute,
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
    this.subCategoryService.getSubCategories().subscribe(data =>{
      this.ngxService.stopLoader('loader-01');
      this.ngxService.stop(); 
      if(data.message == 'InvalidToken'){
        this.userService.logoutUser()
        this.router.navigate(['/login',{message: 'Token Expired'}]);
      }
      else{
        this.subCategories = data.data;
        this.cache.subCategories = this.subCategories;
        this.dtTrigger.next();
      }
      this.activatedRoute.paramMap.subscribe(params => {
        let data = params.get('category');
        if(data!=null){
          this.subCategories = this.subCategories.filter(t => t.category_name == data)
        }
        let message = params.get('message');
        this.message = message;
      });
    })
  }
  edit(subCategoryToEdit: SubCategory){
    this.router.navigate(['/subCategory/edit',subCategoryToEdit.id]);
  }
  Add(){
    this.router.navigate(['/subCategory/addSubCategory']);
  }
  delete(id){
    var self = this;
      bootbox.confirm({
        message: "Are you sure you want to delete the subcategory?",
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
            self.subCategoryService.deleteSubCategory(id).subscribe(data => {
              
              if(data.success){
                self.subCategories = self.subCategories.filter(t => t['id'] != id)
              }
              else{
                this.messageColor = "alert alert-danger"
              }
              self.message = data.message;
              console.log(data);
            })
          }
        }
    });
  }
}
