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
    public id: string = uuid();

    private _limit: number;
    public get limit(): number {
        return this._limit;
    }

    public set limit(value: number) {
        if (isNaN(value) || value <= 0) {
            this._limit = 0;
            this.updatePayment();
            return;
        }
        this._limit = value;
        this.updatePayment();
    }

    private _balance: number;
    public get balance(): number {
        return this._balance;
    }

    public set balance(value: number) {
        if (isNaN(value) || value <= 0) {
            this._balance = 0;
            this.updatePayment();
            return;
        }
        this._balance = value;
        this.updatePayment();
    }

    private _dueDate: DateTime;
    public get dueDate(): DateTime {
        return this._dueDate;
    }

    public get dueDateFormatted(): string {
        return this._dueDate.toFormat('LL/dd/yyyy');
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
        return this._rate;
    }

    public set rate(value: number) {
        if (isNaN(value) || value <= 0) {
            this._rate = 0;
            return;
        }

        if (value >= 100) {
            this._rate = 1;
            return;
        }

        this._rate = value;
    }

    public get ratePercent(): number {
        if (this._rate === 0) {
            return 0;
        }

        if (this._rate >= 100) {
            return 1;
        }

        const rate = Math.round((this._rate / 100) * 10000) / 10000;
        console.log('CreditCard::Rate:Set: %s -> %s', this._rate, rate);
        return rate;
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

    public static fromDB(
        id: string,
        limit: number,
        balance: number,
        rate: number,
        brand: CardBrand,
        dueDate: string
    ): CreditCard {
        var data = new CreditCard();
        data.id = id;
        data.limit = limit;
        data.balance = balance;
        data.rate = rate;
        data.brand = brand;
        data.dueDate = DateTime.fromISO(dueDate);
        return data;
    }

    private updatePayment(): void {
        console.log(this);
        this._payment = CalculatePayment(this);
    }
}
