import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { login, signUp, DataSdk, token } from "../data-type";

@Injectable({
  providedIn: "root",
})
export class UserService {
  isUserLoggedIn = new BehaviorSubject<boolean>(false);
  invalidUserAuth = new EventEmitter<boolean>(false);
  constructor(private http: HttpClient, private router: Router) {}
  userSignUp(user: signUp) {
    var f = {
      "function": "RegisterUser",
      "args": [user.name, user.email, user.password],
    };
    // f.function = "RegisterUser"
    this.http.post('http://localhost:3001/invoke', JSON.stringify(f), { observe: 'response' })
    // this.http
    //   .post("http://localhost:3000/users", user, { observe: "response" })
      .subscribe((result) => {
        if (result) {
          localStorage.setItem("user", JSON.stringify(result.body));
          // this.router.navigate(["user-home"]);
          
        }
      });
      this.http.post('http://localhost:3000/users', user, { observe: 'response' })
      .subscribe((result) => {
        if (result) {
          localStorage.setItem('user', JSON.stringify(result.body));
          this.router.navigate(['user-home']);
        }

      })
  }

  userBuyToken(data: token) {

    var f = {
      "function": "BuyToken",
      "args": [data.tokenamount, data.username],
    };
    console.log(data.tokenamount)
    console.log(data.username)
    this.http
      .post<signUp[]>(
        `http://localhost:3001/invoke`, JSON.stringify(f),
        { observe: "response" }
      )
      .subscribe((result) => {
        if (result && result.body?.length) {
          // localStorage.setItem("user", JSON.stringify(result.body[0]));
          this.router.navigate(["user-home"]);
          this.invalidUserAuth.emit(false);
        } else {
          this.invalidUserAuth.emit(true);
        }
      });

     var amt = data.tokenamount;

      this.http.post('http://localhost:3000/buy-tokens', { amt })      
        .subscribe((result) => {
        if (result) {
          // localStorage.setItem("user", JSON.stringify(result));
          this.router.navigate(["user-home"]);
          this.invalidUserAuth.emit(false);
        } else {
          this.invalidUserAuth.emit(true);
        }
      });

  }

  userLogin(data: login) {

    var f = {
      "function": "GetUser",
      "args": [data.email, data.password],
    };

    this.http
      .post<signUp[]>(
        `http://localhost:3001/query`, JSON.stringify(f),
        { observe: "response" }
      )
      .subscribe((result) => {
        if (result && result.body?.length) {
          localStorage.setItem("user", JSON.stringify(result.body[0]));
          this.router.navigate(["user-home"]);
          this.invalidUserAuth.emit(false);
        } else {
          this.invalidUserAuth.emit(true);
        }
      });

      this.http.get<signUp[]>(`http://localhost:3000/users?email=${data.email}&password=${data.password}`,
      { observe: 'response' }
    ).subscribe((result) => {
      if (result && result.body?.length) {
        localStorage.setItem('user', JSON.stringify(result.body[0]));
        this.router.navigate(['user-home']);
        this.invalidUserAuth.emit(false)
      } else {
        this.invalidUserAuth.emit(true)
      }
    })
  }

  userAuthReload() {
    if (localStorage.getItem("user")) {
      this.isUserLoggedIn.next(true);
      this.router.navigate(["user-home"]);
    }
  }
}
