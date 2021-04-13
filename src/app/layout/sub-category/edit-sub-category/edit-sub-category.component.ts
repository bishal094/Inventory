import { Component, OnInit } from '@angular/core';
import { SubCategoryService, UserServiceService, CategoryService } from 'src/app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { SubCategory } from 'src/app/shared/model/subCategory.model';
import { Category } from 'src/app/shared/model/category.model';
import { Cached } from 'src/app/shared/providers/data-provider';

@Component({
  selector: 'app-edit-sub-category',
  templateUrl: './edit-sub-category.component.html',
  styleUrls: ['./edit-sub-category.component.scss']
})
export class EditSubCategoryComponent implements OnInit {

  image: string | ArrayBuffer = "";
  id: string;
  lastId: number;
  intermediate;
  subCategoryToEdit: SubCategory = new SubCategory;
  subCategories: SubCategory[];
  tempObject: object;
  categories: Category[];
  message: string;

  constructor(
    private subCategoryService: SubCategoryService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserServiceService,
    private cache: Cached
    ) { }

  ngOnInit() {
    
    this.id = this.route.snapshot['_routerState'].url.toString();
    this.intermediate = this.id.lastIndexOf('/');
    this.lastId = parseInt(this.id.substring(this.intermediate + 1));
    this.categoryService.getCategories().subscribe(data =>{
      this.categories = data.data;
      this.subCategoryToEdit = this.cache.subCategories.find(t => t.id == this.lastId);
    })
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
    }
    
  }
  UpdateSubCategory(sname, cId, subCatId){
    var categoryId = this.categories.find(t => t.name == cId).id
    this.subCategoryService.updateSubCategory(sname, categoryId, subCatId).subscribe(data =>{
      if(data.success){
        this.router.navigate(['/subCategory', {message: data.message}]);
      }
      else{
        this.message = data.message
      }
    })
  }
}
