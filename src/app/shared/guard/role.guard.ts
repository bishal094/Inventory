import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private router: Router) {}

    canActivate() {
        if (localStorage.getItem('userRole') == "sadmin"|| localStorage.getItem('userRole') == "admin") {
            return true;
        }
        this.router.navigate(['/sales/stocks']);
        return false;
    }
}

