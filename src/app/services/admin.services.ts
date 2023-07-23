import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { login, signUp } from '../data-type';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
    providedIn: 'root'
})
export class AdminService {
    isSellerLoggedIn = new BehaviorSubject<boolean>(false);
    isLoginError = new EventEmitter<boolean>(false)

    constructor(private http: HttpClient, private router: Router) { }
    AdminSignUp(data: signUp) {
        this.http.post('http://localhost:3000/admin',
            data,
            { observe: 'response' }).subscribe((result) => {
                console.warn(result)
                if (result) {
                    localStorage.setItem('admin', JSON.stringify(result.body))
                    this.router.navigate(['admin-home'])
                }
            })
    }
    reloadAdmin() {
        if (localStorage.getItem('admin')) {
            this.isSellerLoggedIn.next(true)
            this.router.navigate(['admin-home'])
        }
    }
    AdminLogin(data: login) {
        this.http.get(`http://localhost:3000/admin?email=${data.email}&password=${data.password}`,
            { observe: 'response' }).subscribe((result: any) => {
                console.warn(result)
                if (result && result.body && result.body.length === 1) {
                    this.isLoginError.emit(false)
                    localStorage.setItem('admin', JSON.stringify(result.body))
                    this.router.navigate(['admin-home'])
                } else {
                    console.warn("login failed");
                    this.isLoginError.emit(true)
                }
            })
    }
}
