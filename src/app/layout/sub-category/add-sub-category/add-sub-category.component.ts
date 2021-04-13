import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/shared/model/category.model';
import { CategoryService, SubCategoryService, UserServiceService } from 'src/app/shared/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-sub-category',
  templateUrl: './add-sub-category.component.html',
  styleUrls: ['./add-sub-category.component.scss']
})
export class AddSubCategoryComponent implements OnInit {

  categories: Category[];
  subCatFile: File;
  image: string | ArrayBuffer = "";
  message: string;
  constructor( 
    private categoryService: CategoryService, 
    private subCategoryService: SubCategoryService,
    private userService: UserServiceService,
    private router: Router
    ) { }

  ngOnInit() {
    this.categoryService.getCategories().subscribe(data =>{
      this.categories = data.data;
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
  AddSubCategory(sname, cname){
    this.subCategoryService.addSubCategory(sname, cname, this.image).subscribe(data =>{
      if(data.message == 'InvalidToken'){
        this.userService.logoutUser()
        this.router.navigate(['/login',{message: 'Token Expired'}]);
      }
      else if(data.success == false){
        this.message = data.message
      }
      else{
        this.router.navigate(['/subCategory'])
      }
    })
  }
  
}
