import type { CreditCard } from './CreditCard';

export interface PaymentSchedule {
    weeklyPayment: number;
    weeksUntilDue: number;
    accruedInterest: number;
    pastDue: boolean;
}
