import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';
import { DomSanitizer } from '@angular/platform-browser'; // Import the DomSanitizer service if you need to use safe URLs for the image.

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  menuType: string = 'default';
  sellerName: string = "";
  userName: string = "";
  tokenBalanceAmount: number = 0;
  searchResult: undefined | product[];
  cartItems = 0;
  logoUrls: any;
  constructor(private route: Router, private product: ProductService, private sanitizer: DomSanitizer) {
    this.logoUrls = 'assets/CashbackHUB-3.png';
  }

  ngOnInit(): void {
    this.route.events.subscribe((val: any) => {
      if (val.url) {
        if (localStorage.getItem('seller') && val.url.includes('seller')) {
          let sellerStore = localStorage.getItem('seller');
          let sellerData = sellerStore && JSON.parse(sellerStore)[0];
          this.sellerName = sellerData.name;
          this.menuType = 'seller';
        }
        else if (localStorage.getItem('user')) {
          let userStore = localStorage.getItem('user');
          let userData = userStore && JSON.parse(userStore);
          this.userName = userData.name;
          this.menuType = 'user';
          this.product.getCartList(userData.id);
        }
        else {
          this.menuType = 'default';
        }
      }
    });
    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      this.cartItems = JSON.parse(cartData).length
    }
    this.product.cartData.subscribe((items) => {
      this.cartItems = items.length
    })

    this.getUserTokenBalance();
  }
  // logout(){
  //   localStorage.removeItem('seller');
  //   this.route.navigate(['/seller-auth'])
  // }

  userLogout() {
    localStorage.removeItem('user');
    this.route.navigate(['/user-auth'])
    this.product.cartData.emit([])
  }

  sellerLogout() {
    localStorage.removeItem('seller');
    this.route.navigate(['/seller-auth'])
    this.product.cartData.emit([])
  }

  searchProduct(query: KeyboardEvent) {
    if (query) {
      const element = query.target as HTMLInputElement;
      this.product.searchProduct(element.value).subscribe((result) => {

        if (result.length > 5) {
          result.length = length
        }
        this.searchResult = result;
      })
    }
  }
  hideSearch() {
    this.searchResult = undefined
  }
  redirectToDetails(id: number) {
    this.route.navigate(['/details/' + id])
  }
  submitSearch(val: string) {
    console.warn(val)
    this.route.navigate([`search/${val}`]);
  }

  private getUserTokenBalance() {

    // Example: Fetching the token balance from a backend API
    // Replace the following code with your actual logic to fetch the token balance

    // For demonstration purposes, let's assume we have a function in the 'product' service to get the token balance.
    // The function 'getUserTokenBalance' is assumed to return an observable with the user's token balance.

    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    if (userData) {
      this.product.getUserTokenBalance(userData.email).subscribe(
        (balance: number) => {
          console.log(balance)
          this.tokenBalanceAmount = balance;
        },
        (error) => {
          console.error('Error fetching user token balance:', error)
        }
      )



    }
  }
}
