import { CreditCard } from '$lib/types/CreditCard';
import { describe, test, assert } from 'vitest';
import { CalculatePayment } from './PaymentCalculator';
import { DateTime } from 'luxon';
import type { PaymentSchedule } from '$lib/types/PaymentSchedule';

describe('payment calculator', () => {
    test('CalculatePayment returns PaymentSchedule for single card', () => {
        const future = DateTime.now().plus({ month: 1 });
        const inputCard: CreditCard = new CreditCard();
        inputCard.limit = 5000;
        inputCard.balance = 1000;
        inputCard.rate = 2.5;
        inputCard.dueDate = future;

        const expected: PaymentSchedule = {
            weeklyPayment: 250,
            weeksUntilDue: 4,
            accruedInterest: 25,
            pastDue: false
        };

        const result = CalculatePayment(inputCard);

        assert.deepEqual(result, expected);
    });

    test('CalculatePayment returns PaymentSchedule[] for multiple cards', () => {
        const future = DateTime.now().plus({ month: 1 });
        const inputCard1: CreditCard = new CreditCard();
        inputCard1.limit = 5000;
        inputCard1.balance = 1000;
        inputCard1.rate = 2.5;
        inputCard1.dueDate = future;

        const inputCard2: CreditCard = new CreditCard();
        inputCard2.limit = 5000;
        inputCard2.balance = 500;
        inputCard2.rate = 2.5;
        inputCard2.dueDate = future;

        const expected: PaymentSchedule[] = [
            {
                weeklyPayment: 250,
                weeksUntilDue: 4,
                accruedInterest: 25,
                pastDue: false
            },
            {
                weeklyPayment: 125,
                weeksUntilDue: 4,
                accruedInterest: 12.5,
                pastDue: false
            }
        ];

        const result = CalculatePayment([inputCard1, inputCard2]);

        assert.deepEqual(result, expected);
    });

    test('handles zero balance', () => {
        const future = DateTime.now().plus({ day: 28 });
        const inputCard: CreditCard = new CreditCard();
        inputCard.limit = 5000;
        inputCard.balance = 0;
        inputCard.rate = 10;
        inputCard.dueDate = future;

        const expected: PaymentSchedule = {
            weeklyPayment: 0,
            weeksUntilDue: 3,
            accruedInterest: 0,
            pastDue: false
        };

        const result = CalculatePayment(inputCard);

        assert.deepEqual(result, expected);
    });

    test('handles zero interest rate', () => {
        const future = DateTime.now().plus({ day: 28 });
        const inputCard: CreditCard = new CreditCard();
        inputCard.limit = 5000;
        inputCard.balance = 1000;
        inputCard.rate = 0;
        inputCard.dueDate = future;

        const expected: PaymentSchedule = {
            weeklyPayment: 333.33,
            weeksUntilDue: 3,
            accruedInterest: 0,
            pastDue: false
        };

        const result = CalculatePayment(inputCard);

        assert.deepEqual(result, expected);
    });

    test('handles due date in the past', () => {
        const past = DateTime.now().minus({ day: 28 });
        const inputCard: CreditCard = new CreditCard();
        inputCard.limit = 5000;
        inputCard.balance = 1000;
        inputCard.rate = 2.5;
        inputCard.dueDate = past;

        const expected: PaymentSchedule = {
            weeklyPayment: 250,
            weeksUntilDue: 4,
            accruedInterest: 25,
            pastDue: true
        };

        const result = CalculatePayment(inputCard);

        assert.deepEqual(result, expected);
    });

    test('handle due date less than a week', () => {
        const future = DateTime.now().plus({ days: 4 });
        const inputCard: CreditCard = new CreditCard();
        inputCard.limit = 5000;
        inputCard.balance = 1000;
        inputCard.rate = 2.5;
        inputCard.dueDate = future;

        const expected: PaymentSchedule = {
            weeklyPayment: 1000,
            weeksUntilDue: 0,
            accruedInterest: 25,
            pastDue: false
        };

        const result = CalculatePayment(inputCard);

        assert.deepEqual(result, expected);
    });

    test('past due is false when balance is zero', () => {
        const current = DateTime.now();
        const inputCard: CreditCard = new CreditCard();
        inputCard.limit = 5000;
        inputCard.balance = 0;
        inputCard.rate = 2.5;
        inputCard.dueDate = current;

        const expected: PaymentSchedule = {
            weeklyPayment: 0,
            weeksUntilDue: 0,
            accruedInterest: 0,
            pastDue: false
        };

        const result = CalculatePayment(inputCard);

        assert.deepEqual(result, expected);
    });
});
