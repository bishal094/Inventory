import { Component, OnInit, ViewChild } from '@angular/core';
import { UserServiceService, SaleService } from 'src/app/shared/services';
import { Router, ActivatedRoute } from '@angular/router';
import { Cached } from 'src/app/shared/providers/data-provider';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/shared/services/bill.service';
import { StoreService } from 'src/app/shared/services/store.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  sales: Array<object> = [];
  dtTrigger: Subject<any> = new Subject();
  dtOptions: DataTables.Settings = {};
  message: string;
  stores: Array<object> = [];
  canView;
  optionsSubCategory: any;
  optionsCategory: any;
  categories;
  subCategories;
  selectedStore;
  isCollapsed: boolean = true;
  saleDetail;
  products;
  id;
  intermediate;
  lastId;
  constructor(
    private activatedRoute: ActivatedRoute,
    private saleService: SaleService,
    private cache:Cached
  ) { }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot['_routerState'].url.toString();
      this.intermediate = this.id.lastIndexOf('/');
      this.lastId = parseInt(this.id.substring(this.intermediate + 1));
    this.saleService.getSalesByBill(this.lastId).subscribe(data =>{
      this.sales = data.data.products
      console.log(data);
      
    })
  }

}
