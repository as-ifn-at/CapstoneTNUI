import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { product } from '../data-type';
import { SellerService } from '../services/seller.service';
import { ProductService } from '../services/product.service';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrls: ['./seller-home.component.css'],
})
export class SellerHomeComponent implements OnInit {
  productList: undefined | product[];
  productMessage: undefined | string;
  icon = faTrash;
  iconEdit = faEdit;
  constructor(private product: ProductService, private sellerService: SellerService, private router: Router) { }

  ngOnInit(): void {
    if (!this.sellerService.isSellerLoggedIn.getValue()) {
      this.router.navigate(['/seller-auth']);
    } else {
      this.list();
    }
  }

  deleteProduct(id: number) {
    this.product.deleteProduct(id).subscribe((result) => {
      if (result) {
        this.productMessage = 'Product is deleted';

        this.list();
      }
    });
    setTimeout(() => {
      this.productMessage = undefined;
    }, 3000);
  }

  list() {
    this.product.productList().subscribe((result) => {
      if (result) {
        this.productList = result;
      }
    });
  }
}
