import { Component, OnInit } from '@angular/core';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  popularProducts: product[] | undefined;
  trendyProducts: product[] | undefined;
  isUserFlipped: boolean = false;
  isSellerFlipped: boolean = false;
  isAdminFlipped: boolean = false;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.productService.popularProducts().subscribe((data) => {
      this.popularProducts = data;
    });

    this.productService.trendyProducts().subscribe((data) => {
      this.trendyProducts = data;
    });
  }

  // Function to trigger the flip effect for the user image
  flip(userType: string): void {
    if (userType === 'user') {
      this.isUserFlipped = true;
    } else if (userType === 'seller') {
      this.isSellerFlipped = true;
    } else if (userType === 'admin') {
      this.isAdminFlipped = true;
    }
  }

  // Function to trigger the unflip effect for the user image
  unflip(userType: string): void {
    if (userType === 'user') {
      this.isUserFlipped = false;
    } else if (userType === 'seller') {
      this.isSellerFlipped = false;
    } else if (userType === 'admin') {
      this.isAdminFlipped = false;
    }
  }
}
