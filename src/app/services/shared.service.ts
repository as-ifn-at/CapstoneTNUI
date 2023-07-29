import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class SharedService {
    private _tokenAmount: number = 0;

    get tokenAmount(): number {
        return this._tokenAmount;
    }

    set tokenAmount(amount: number) {
        this._tokenAmount = amount;
    }
}
