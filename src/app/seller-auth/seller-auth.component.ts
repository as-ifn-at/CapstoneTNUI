import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { login, signUp } from '../data-type';
import { SellerService } from '../services/seller.service';

@Component({
  selector: 'app-seller-auth',
  templateUrl: './seller-auth.component.html',
  styleUrls: ['./seller-auth.component.css'],
})
export class SellerAuthComponent implements OnInit {
  showLogin: boolean = true;
  authError: String = '';
  constructor(private seller: SellerService, private router: Router) { }

  ngOnInit(): void {
    this.seller.reloadSeller()
  }
  signUp(data: signUp): void {
    console.warn(data);
    this.seller.userSignUp(data);
  }
  login(data: login): void {
    this.seller.userLogin(data);
    this.seller.isLoginError.subscribe((isError) => {
      if (isError) {
        this.authError = "Email or password is not correct";
      } else {
        this.seller.isSellerLoggedIn.next(true);
        this.router.navigate(['/seller-auth']);
      }
    })
  }
  openLogin() {
    this.showLogin = true;
  }
  openSignUp() {
    this.showLogin = false;
  }
  openUser() {
    this.showLogin = false;
  }
}
