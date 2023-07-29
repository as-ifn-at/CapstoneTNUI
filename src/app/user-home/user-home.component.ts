import { Component, OnInit } from '@angular/core';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';
import { SharedService } from '../services/shared.service';
@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {
  popularProducts: undefined | product[];
  trendyProducts: undefined | product[];
  buyTokenError: string ='';
  isPopupVisible : Boolean = false

  constructor(private product: ProductService, private sharedService: SharedService) { 
  }

  ngOnInit(): void {
    this.product.popularProducts().subscribe((data) => {
      this.popularProducts = data;
    });

    this.product.trendyProducts().subscribe((data) => {
      this.trendyProducts = data;
    });

    
  }

  showPopup() {
    this.isPopupVisible = true;
  }

  buyTokens(){
    this.isPopupVisible = true;
    const tokenAmount =this.sharedService.tokenAmount;
    this.buyTokenError = '';

    if (tokenAmount <= 0) {
      this.buyTokenError = 'Token amount must be greater than zero';
      return;
    }
    // Call the backend API to buy tokens
    this.product.buyTokens(tokenAmount).subscribe(
      () => {

        console.log('Succesfully purchased ${this.tokenA,ount} tokens.');
      },
      (error) => {
        this.buyTokenError ='Failed to buy tokens. Please try again later';
        console.error('Error buyig tokens:', error);
     // Token purchase faild

      }
      );
  }

}
