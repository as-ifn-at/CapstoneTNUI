import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { token } from '../data-type';

@Component({
  selector: 'app-buy-token',
  templateUrl: './buy-token.component.html',
  styleUrls: ['./buy-token.component.css']
})
export class BuyTokenComponent implements OnInit {

  constructor(private user: UserService) { }

  ngOnInit(): void {
  }

  buytokens(data : token) {
    this.user.userBuyToken(data)

    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }

}
