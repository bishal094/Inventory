import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService, UserServiceService } from 'src/app/shared/services';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {

  constructor(private categoryService: CategoryService, private router: Router, private userService: UserServiceService) { }

  ngOnInit() {
  }
  AddCategory(categoryName){
    this.categoryService.addCategory(categoryName).subscribe((data : any)=>{
      if(data.message == 'InvalidToken'){
        this.userService.logoutUser()
        this.router.navigate(['/login',{message: 'Token Expired'}]);
      }
      else{
        this.router.navigate(['/category']);
      }
    });
    }

}
