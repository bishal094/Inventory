import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from 'src/app/shared/services/store.service';
import { UserServiceService } from 'src/app/shared/services';
import { Cached } from 'src/app/shared/providers/data-provider';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  id;
  intermediate;
  lastId;
  stores;
  StoreToEdit: object = {};
  message: string;
  constructor(
    private route: ActivatedRoute,
    private storeService: StoreService,
    private userService: UserServiceService,
    private router: Router,
    private cache:Cached,
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot['_routerState'].url.toString();
      this.intermediate = this.id.lastIndexOf('/');
      this.lastId = parseInt(this.id.substring(this.intermediate + 1));
      this.StoreToEdit = this.cache.stores.find(t => t.id == this.lastId)
  }
  UpdateStore(name, location, description){
    this.storeService.updateStore(this.StoreToEdit['id'], name, location, description).subscribe(data =>{
      if(data.success){
        this.router.navigate(['/stores',{message: data.message}]);
      }
      else{
        this.message = data.message
      }
    })
  }

}
