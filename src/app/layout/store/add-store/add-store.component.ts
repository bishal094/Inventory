import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/shared/services/store.service';
import { Router } from '@angular/router';
import { UserServiceService } from 'src/app/shared/services';

@Component({
  selector: 'app-add-store',
  templateUrl: './add-store.component.html',
  styleUrls: ['./add-store.component.scss']
})
export class AddStoreComponent implements OnInit {

  message: string;
  GoDown: boolean = false;
  constructor(
    private storeService: StoreService,
    private router: Router,
    private userService: UserServiceService
  ) { }

  ngOnInit() {
  }
  AddStore(name, location, description){
    console.log(this.GoDown);
    
    this.storeService.addStore(name, location,description, this.GoDown).subscribe(data => {
      if(data.message == 'InvalidToken'){
        this.userService.logoutUser()
        this.router.navigate(['/login',{message: 'Token Expired'}]);
      }
      else if(data.success == false){
        this.message = data.message
      }
      else{
        this.router.navigate(['/stores',{ message: "Store Added Successfully"}])
      }
    })
  }
  checkboxChecked(){
    this.GoDown = !this.GoDown;
  }
}
