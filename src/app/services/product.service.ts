import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { cart, order, product } from '../data-type';
// import { Long } from 'long';


@Injectable({
  providedIn: 'root',
})
export class ProductService {
  cartData = new EventEmitter<product[] | []>();
  constructor(private http: HttpClient) { }
  addProduct(data: product) {
    return this.http.post('http://localhost:3000/products', data);
  }
  productList() {
    return this.http.get<product[]>('http://localhost:3000/products');
  }

  deleteProduct(id: number) {
    return this.http.delete(`http://localhost:3000/products/${id}`);
  }

  getProduct(id: string) {
    return this.http.get<product>(`http://localhost:3000/products/${id}`);
  }

  updateProduct(product: product) {
    return this.http.put<product>(
      `http://localhost:3000/products/${product.id}`,
      product
    );
  }
  popularProducts() {
    return this.http.get<product[]>('http://localhost:3000/products?_limit=3');
  }

  trendyProducts() {
    return this.http.get<product[]>('http://localhost:3000/products?_limit=8');
  }

  searchProduct(query: string) {
    return this.http.get<product[]>(
      `http://localhost:3000/products?q=${query}`
    );
  }

  localAddToCart(data: product) {
    let cartData = [];
    let localCart = localStorage.getItem('localCart');
    if (!localCart) {
      localStorage.setItem('localCart', JSON.stringify([data]));
      this.cartData.emit([data]);
    } else {
      cartData = JSON.parse(localCart);
      cartData.push(data);
      localStorage.setItem('localCart', JSON.stringify(cartData));
      this.cartData.emit(cartData);
    }
  }

  removeItemFromCart(productId: number) {
    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      let items: product[] = JSON.parse(cartData);
      items = items.filter((item: product) => productId !== item.id);
      localStorage.setItem('localCart', JSON.stringify(items));
      this.cartData.emit(items);
    }
  }

  addToCart(cartData: cart) {
    return this.http.post('http://localhost:3000/cart', cartData);
  }
  getCartList(userId: number) {
    return this.http
      .get<product[]>('http://localhost:3000/cart?userId=' + userId, {
        observe: 'response',
      })
      .subscribe((result) => {
        if (result && result.body) {
          this.cartData.emit(result.body);
        }
      });
  }
  removeToCart(cartId: number) {
    return this.http.delete('http://localhost:3000/cart/' + cartId);
  }
  currentCart() {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<cart[]>('http://localhost:3000/cart?userId=' + userData.id);
  }

  orderNow(data: order) {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);

    // let yourFloat64Value: float64 = data.totalPrice as float64;

    var f = {
      "function": "BuyProduct",
      "args": ["cake", "food", `${data.totalPrice}` , `${data.email}`],
    };

    this.http.post('http://localhost:3001/invoke', JSON.stringify(f), { observe: 'response' })
      .subscribe((result) => {
        if (result) {
          localStorage.setItem("user", JSON.stringify(result.body));
        }
      });

      setTimeout(() => {
        window.location.reload();
      }, 3000);

    return this.http.post('http://localhost:3000/orders', data);
  }
  orderList() {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<order[]>('http://localhost:3000/orders?userId=' + userData.id);
  }

  deleteCartItems(cartId: number) {
    return this.http.delete('http://localhost:3000/cart/' + cartId).subscribe((result) => {
      this.cartData.emit([]);
    })
  }

  cancelOrder(orderId: number) {
    return this.http.delete('http://localhost:3000/orders/' + orderId)

  }

  getUserTokenBalance1(username: string): Observable<any> {
    // const url = 'https://example.com/api/user/${userId}/token-balance';
    // var f = {
    //   "function": "GetBalance",
    //   "args": [username],
    // };
    // console.log(username + "11222")
    // var k = JSON.stringify(f)
    // console.log(k +"---------")
    // var amt
    // var p = this.http.post('http://localhost:3001/query', k, {observe:'response' } )
    // .subscribe((resp) => {
    //   if (resp) {
    //     // localStorage.setItem('user', JSON.stringify(resp.body));
    //     // amt = JSON.stringify(resp.body)
    //     console.log(JSON.stringify(resp.body))
    //     // this.router.navigate(['user-home']);
    //   }

    // });
    
    // console.log(p +"----r-----")
    
    // // var t = JSON.stringify(resp)
    // // console.log(t +"----t-----")

    // return this.http.post('http://localhost:3001/invoke', k);

    const url = 'http://localhost:3001/query'; // Assuming this is the correct URL for querying the backend
    var data = {
      "function": "GetBalance",
      "args": [username],
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    var r = this.http.post(url, JSON.stringify(data), httpOptions);

    console.log(r)
    return r
  }

  getUserTokenBalance(username: string): Observable<number> {
    const url = `http://localhost:8082/getbalance/${username}`;
    console.log(url)
    return this.http.get<number>(url);
  }


  buyTokens(amount: number): Observable<any> {
    // Implement the logic to buy tokens using the 'amount' parameter
    // Make the necessary HTTP request to your backend API or Hyperledger Fabric network

    // For example, if you have an endpoint for buying tokens, it could look like this:
    return this.http.post('http://localhost:3000/buy-tokens', { amount });

  }

}
