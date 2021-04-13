import { Component, OnInit } from '@angular/core';
import { UserServiceService } from 'src/app/shared/services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {

  error: string;
  message: string;
  constructor(private userService: UserServiceService,
    private router: Router) { }

  ngOnInit() {
  }
  ChangePassword(OldPass, Password, ConfirmPassword){
        
    if(Password != ConfirmPassword){
        this.error = "Passwords Do not match";
    }
    else{
        this.userService.changePassword(OldPass, Password).subscribe(data => {
            if(data.success == false){
                this.error = data.message
            }
            else{
              this.userService.logoutUser();
              this.router.navigate(['/login', {message: data.message}]);
            }
        })
    }
    
}

}
