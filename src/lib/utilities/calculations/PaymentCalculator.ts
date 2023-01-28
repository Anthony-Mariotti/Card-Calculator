import type { CreditCard } from '$lib/types/CreditCard';
import type { PaymentSchedule } from '$lib/types/PaymentSchedule';
import { DateTime } from 'luxon';

export function CalculatePayment(cards: CreditCard[]): PaymentSchedule[];
export function CalculatePayment(card: CreditCard): PaymentSchedule;

export function CalculatePayment(
    cards: CreditCard[] | CreditCard
): PaymentSchedule[] | PaymentSchedule {
    if (Array.isArray(cards)) {
        const schedule: PaymentSchedule[] = [];
        for (const card of cards) {
            const weeksUntilDue = CalculateWeeksUntilDue(card);
            console.log('CalculatePayment::Weeks Until Due: %s', weeksUntilDue);

            const weeklyPayment = CalculateWeeklyPayment(card.balance, weeksUntilDue);
            console.log('CalculatePayment::Weekly Payment: %s', weeklyPayment);

            const accruedInterest = CalculateInterest(card.balance, card.ratePercent);
            console.log('CalculatePayment::Accrued Interest: %s', accruedInterest);

            schedule.push({
                weeklyPayment,
                weeksUntilDue,
                accruedInterest,
                pastDue: IsPastDue(card.dueDate)
            });
        }
        return schedule;
    } else {
        const card = cards;
        const weeksUntilDue = CalculateWeeksUntilDue(card);
        console.log('CalculatePayment::Weeks Until Due: %s', weeksUntilDue);

        const weeklyPayment = CalculateWeeklyPayment(card.balance, weeksUntilDue);
        console.log('CalculatePayment::Weekly Payment: %s', weeklyPayment);

        const accruedInterest = CalculateInterest(card.balance, card.ratePercent);
        console.log('CalculatePayment::Accrued Interest: %s', accruedInterest);

        return {
            weeklyPayment,
            weeksUntilDue,
            accruedInterest,
            pastDue: IsPastDue(card.dueDate)
        };
    }
}

const ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;
const CalculateWeeksUntilDue = (card: CreditCard): number => {
    console.log('CalcuateWeeksUntilDue::Card.dueDate %s', new Date().getTime());
    console.log('CalcuateWeeksUntilDue::Date.now() %s', card.dueDate);
    console.log('CalcuateWeeksUntilDue::Card.ONE_WEEK_IN_MS %s', ONE_WEEK_IN_MS);

    const rawDueWeeks = card.dueDate.diffNow().milliseconds / ONE_WEEK_IN_MS;
    return Math.floor(Math.abs(rawDueWeeks));
};

const CalculateWeeklyPayment = (balance: number, weeksUntilDue: number): number => {
    console.log('CalculateWeeklyPayment::balance %s', balance);
    console.log('CalculateWeeklyPayment::weeksUntilDue %s', weeksUntilDue);

    if (balance === 0 && weeksUntilDue === 0) {
        return 0;
    }

    var rawPayment = balance / weeksUntilDue;
    return Math.round((rawPayment + Number.EPSILON) * 100) / 100;
};

const CalculateInterest = (balance: number, interestRate: number): number => {
    console.log('CalculateInterest::balance %s', balance);
    console.log('CalculateInterest::interestRate %s', interestRate);

    var rawInterest = balance * interestRate;
    return Math.round((rawInterest + Number.EPSILON) * 100) / 100;
};

const IsPastDue = (dueDate: DateTime): boolean => {
    return dueDate <= DateTime.now();
};
