import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { UserServiceService } from '../shared/services';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

    collapedSideBar: boolean;
    constructor(
        private userService: UserServiceService
    ) {}

    ngOnInit() {
    }
    receiveCollapsed($event) {
        this.collapedSideBar = $event;
    }
    ngOnDestroy(){
        localStorage.setItem("userToken", null)
    }
}
