import { Component, OnInit, ViewChild } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { UserServiceService, DashboardService } from 'src/app/shared/services';
import { BaseChartDirective } from 'ng2-charts';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})

export class DashboardComponent implements OnInit {
    @ViewChild("baseChart")  chart: BaseChartDirective;
    @ViewChild("salesChart")  chartsales: BaseChartDirective;
    @ViewChild("stockChart")  chartstock: BaseChartDirective;
    public alerts: Array<any> = [];
    public sliders: Array<any> = [];
    content: object;
    loaded;
    private canView: boolean;
    days: number;
    profitLoss;
    profitLossColor;
    profitLossIcon;
    currYear: number = new Date().getFullYear();
    currMonth: number = new Date().getMonth();
    monthName: string = "";
    graphMonth: string = "";
    purchaseData: object = {
        data:[],
        label: null
    };
    salesData: object = {
        data:[],
        label: null
    };
    salesApi: Array<object> = [];
    purchaseApi: Array<object> = [];
    stockByStoresApi: Array<object> = [];
    salesByStoresApi: Array<object> = [];
    years: Array<number> = [];
    months: Array<string> = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public salesChartLabels: string[] = [

    ];
    public stockChartLabels: string[] = [

    ];
    public barChartType: string;
    public barChartLegend: boolean;
    public stockChartColors: any [] =[
        {
            backgroundColor:'rgba(173,216,230 ,0.8)',
            borderColor: "rgba(173,216,230 ,1)",
            borderWidth: 5
        }
    ]
    public salesChartColors: any [] =[
        {
            // grey
            backgroundColor: 'rgba(255,192,203 ,0.8)',
            borderColor: 'rgba(255,192,203 ,1 )',
            borderWidth: 5
        }
    ]
    public salesChartData: any[] = [
        { data: [], label: 'Sales' }
    ];
    public stockChartData: any[] = [
        { data: [], label: 'Stock' }
    ];
    constructor(
        private userService: UserServiceService,
        private dashboardService: DashboardService,
        private ngxService: NgxUiLoaderService
    ) {
    }
    
    public lineChartData: Array<any> = [
        { data: [], label: '' }
    ];
    public lineChartLabels: Array<any> = [];
    public lineChartOptions: any = {
        responsive: true
    };
    public lineChartColors: Array<any> = [
        {
            // grey
            backgroundColor: 'rgba(173,216,230 ,0.2 )',
            borderColor: 'rgba(173,216,230 ,1 )',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        },
        {
            // grey
            backgroundColor: 'rgba(255,192,203 ,0.2)',
            borderColor: 'rgba(255,192,203 ,1 )',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }
    ];
    public lineChartLegend: boolean;
    public lineChartType: string;

    ngOnInit() {
        this.ngxService.start();
        this.ngxService.startLoader('loader-01');
        this.barChartType = 'bar';
        this.barChartLegend = true;
        
        for(var i = 2018;i<=this.currYear;i++){
            this.years.push(i);
        }
        this.lineChartLegend = true;
        this.lineChartType = 'line';
        this.monthName = this.months[this.currMonth];
        this.graphMonth = this.monthName;
        this.dashboardService.getDashboardData().subscribe(data =>{
            console.log(data);
            
            this.ngxService.stopLoader('loader-01');
            this.ngxService.stop(); 
            this.content = data.data.details[0];
            this.profitLoss = this.content['total_sales'] - this.content['total_purchase'];
            this.ColorForProfitLoss(this.profitLoss);
            this.salesApi = data.data.sales_data;
            this.purchaseApi = data.data.purchase_data;
            this.salesByStoresApi = data.data.sales_by_stores;
            this.stockByStoresApi = data.data.stock_by_stores;
            this.days = this.daysInMonth(this.currMonth, this.currYear)
            for(var i = 0; i<this.stockByStoresApi.length;i++){
                this.stockChartLabels[i] = this.stockByStoresApi[i]['name']
                this.stockChartData[0]['data'][i] = this.stockByStoresApi[i]['quantity']
            }
            for(var i = 0; i<this.salesByStoresApi.length;i++){
                this.salesChartLabels[i] = this.salesByStoresApi[i]['name']
                this.salesChartData[0]['data'][i] = this.salesByStoresApi[i]['total_sales']
            }
            for(var i = 1; i<=this.days;i++){
                this.lineChartLabels[i-1] = i;
            }
            for(var i = 0; i<this.lineChartLabels.length;i++){
                var day = this.lineChartLabels[i];
                var sales = this.salesApi.find(t => t['date'] == day)
                if(sales){
                    this.salesData['data'][i] = (sales['total']);
                }
                else{
                    this.salesData['data'][i] = 0;
                }
                var purchase = this.purchaseApi.find(t => t['date'] == day)
                if(purchase){
                    this.purchaseData['data'][i] = (purchase['total']);
                }
                else{
                    this.purchaseData['data'][i] = (0);
                }
            }
            this.purchaseData['label'] = "Purchase data"
            this.salesData['label'] = "Sales data"
            this.lineChartData[0] = (this.purchaseData);
            this.lineChartData[1] = (this.salesData);
            this.reloadChart();
            this.loaded = true;
        })
    }

    public closeAlert(alert: any) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
        this.canView = this.userService.canAccess();
        
    }
    daysInMonth (month: number, year: number) {
        return new Date(year, month+1, 0).getDate();
    }
    public chartClicked(e: any): void {
        // console.log(e);
    }

    public chartHovered(e: any): void {
        // console.log(e);
    }
    reloadChart() {
        if (this.chart !== undefined) {
           this.chart.chart.destroy();
           this.chart.chart = 0;
    
           this.chart.datasets = this.lineChartData;
           this.chart.labels = this.lineChartLabels;
           this.chart.ngOnInit();
        }
        if (this.chartsales !== undefined) {
            this.chartsales.chart.destroy();
            this.chartsales.chart = 0;
     
            this.chartsales.datasets = this.salesChartData;
            this.chartsales.labels = this.salesChartLabels;
            this.chartsales.ngOnInit();
         }
         if (this.chartstock !== undefined) {
            this.chartstock.chart.destroy();
            this.chartstock.chart = 0;
     
            this.chartstock.datasets = this.stockChartData;
            this.chartstock.labels = this.stockChartLabels;
            this.chartstock.ngOnInit();
         }
    }
    ApplyDate(monthtest, year){
        this.graphMonth = monthtest;
        var monthNum = this.months.findIndex(t => t == monthtest)+1
        var month
        if(monthNum<10){
            month='0'+monthNum;
          } 
          else{
            month=monthNum;
          }
        var date = year+"-"+month+"-"+"00"
        this.dashboardService.getDashboardDataFilter(date).subscribe(data =>{
            this.content = data.data.details[0];
            this.profitLoss = this.content['total_sales'] - this.content['total_purchase']
            this.ColorForProfitLoss(this.profitLoss);
            this.salesApi = data.data.sales_data;
            this.purchaseApi = data.data.purchase_data;
            this.days = this.daysInMonth(parseInt(month)-1, parseInt(year));
            this.lineChartLabels = new Array<any>();
            for(var i = 1; i<=this.days;i++){
                this.lineChartLabels[i-1] = i;
            }
            for(var i = 0; i<this.lineChartLabels.length;i++){
                var day = this.lineChartLabels[i];
                var sales = this.salesApi.find(t => t['date'] == day)
                if(sales){
                    this.salesData['data'][i] = (sales['total']);
                }
                else{
                    this.salesData['data'][i] = 0;
                }
                var purchase = this.purchaseApi.find(t => t['date'] == day)
                if(purchase){
                    this.purchaseData['data'][i] = (purchase['total']);
                }
                else{
                    this.purchaseData['data'][i] = (0);
                }
            }
            this.lineChartLabels.forEach(day => {
                
            });
            this.purchaseData['label'] = "purchase data"
            this.salesData['label'] = "sales data"
            this.lineChartData[0] = (this.purchaseData);
            this.lineChartData[1] = (this.salesData);
            this.reloadChart();
            
        })
    }
    ColorForProfitLoss(value){
        if(value < 0){
            this.profitLossColor = "danger";
            this.profitLossIcon = "fa fa-arrow-circle-down";
        }
        else if(value > 0){
            this.profitLossColor = "success";
            this.profitLossIcon = "fa fa-arrow-circle-up";
        }
        else {
            this.profitLossColor = "secondary";
            this.profitLossIcon = "fa fa-minus-square";
        }
    }
}
