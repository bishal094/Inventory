import { Component, OnInit, Input } from '@angular/core';
import { CategoryService, UserServiceService } from 'src/app/shared/services';
import { Category } from 'src/app/shared/model/category.model';
import { ActivatedRoute, Router } from '@angular/router'
import { Cached } from 'src/app/shared/providers/data-provider';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  id: string;
  lastId: number;
  categoryToEdit: Category = {
    id: null,
    name:null,
    token:null
  };
  message: string;
  categories: Category[];
  response;
  intermediate: number;
  constructor(
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
        this.categoryToEdit = this.cache.categories.find(t => t.id ==this.lastId);
    
  }
  UpdateCategory(id, oldName, newName){
    this.categoryService.updateCategory(id, oldName, newName).subscribe(data =>{
      if(data.message == 'InvalidToken'){
        this.userService.logoutUser()
        this.router.navigate(['/login',{message: 'Token Expired'}]);
      }
      else if(data.success){
        this.router.navigate(['/category',{message: data.message}]);
      }
      else{
        this.message = data.message
      }
    })
  }

}
