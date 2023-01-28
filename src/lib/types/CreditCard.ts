import { CardBrand } from './CardBrand';
import { CalculatePayment } from '$lib/utilities/calculations/PaymentCalculator';

import { v4 as uuid } from 'uuid';
import type { PaymentSchedule } from './PaymentSchedule';
import { DateTime } from 'luxon';

export interface ICreditCard {
    id: string;
    limit: number;
    balance: number;
    rate: number;
    ratePercent: number;
    brand: CardBrand;
    dueDate: DateTime;
    payment: PaymentSchedule | undefined;
}

export class CreditCard implements ICreditCard {
    public readonly id: string = uuid();

    private _limit: number;
    public get limit(): number {
        return this._limit;
    }

    public set limit(value: number) {
        this._limit = value;
        this.updatePayment();
    }

    private _balance: number;
    public get balance(): number {
        return this._balance;
    }

    public set balance(value: number) {
        this._balance = value;
        this.updatePayment();
    }

    private _dueDate: DateTime;
    public get dueDate(): DateTime {
        return this._dueDate;
    }

    public set dueDate(value: DateTime) {
        if (value.isValid) {
            this._dueDate = value;
            this.updatePayment();
            return;
        }

        this._dueDate = DateTime.now();
        this.updatePayment();
    }

    private _payment: PaymentSchedule | undefined = undefined;
    public get payment(): PaymentSchedule | undefined {
        return this._payment;
    }

    private _rate: number;
    public get rate(): number {
        if (this._rate === 0) {
            return 0;
        }

        if (this._rate >= 100) {
            return 1;
        }

        const outRate = Math.round(this._rate * 10000) / 100;
        console.log('CreditCard::Rate:Set: %s -> %s', this._rate, outRate);
        return outRate;
    }

    public set rate(value: number) {
        if (value === 0) {
            this._rate = 0;
            return;
        }

        if (value >= 100) {
            this.rate = 1;
            return;
        }

        this._rate = Math.round((value / 100) * 10000) / 10000;
        console.log('CreditCard::Rate:Set: %s -> %s', value, this._rate);
    }

    public get ratePercent(): number {
        return this._rate;
    }

    public brand: CardBrand = CardBrand.Generic;

    public constructor(
        limitAmount?: number,
        balanceAmount?: number,
        ratePercent?: number,
        setDueDate?: DateTime
    ) {
        if (limitAmount === undefined) {
            this._limit = 0;
        } else {
            this._limit = limitAmount;
        }

        if (balanceAmount === undefined) {
            this._balance = 0;
        } else {
            this._balance = balanceAmount;
        }

        if (ratePercent === undefined) {
            this._rate = 0;
        } else {
            this._rate = ratePercent;
        }

        if (setDueDate === undefined) {
            this._dueDate = DateTime.now();
        } else {
            this._dueDate = setDueDate;
        }
    }

    public static new(limit: number, balance: number, rate: number, dueDate: DateTime): CreditCard {
        return new CreditCard(limit, balance, rate, dueDate);
    }

    private updatePayment(): void {
        console.log(this);
        this._payment = CalculatePayment(this);
    }
}
