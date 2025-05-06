export class YearMonth {
    year: number;
    month: number;

    constructor();
    constructor(year: number, month: number);
    constructor(date: Date); 
    constructor(arg1?: number | Date, arg2?: number) {
        if (arg1 === undefined) {
            const now = new Date();
            this.year = now.getFullYear();
            this.month = now.getMonth();
        } else if (arg1 instanceof Date) {
            this.year = arg1.getFullYear();
            this.month = arg1.getMonth();
        } else {
            this.year = arg1;
            this.month = arg2 ?? 0;
        }
    }

    prevMonth() {
        if (this.month === 0) {
            this.month = 11;
            this.year--;
        } else {
            this.month--;
        }
    }

    nextMonth() {
        if (this.month === 11) {
            this.month = 0;
            this.year++;
        } else {
            this.month++;
        }
    }
}