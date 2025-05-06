export class Period {
    dateFrom: Date | null = null;
    dateTo: Date | null = null;

    constructor(dateFrom: Date | null, dateTo: Date | null) {
        if (dateFrom && dateTo && dateFrom >= dateTo) {
            throw Error("DateFrom must be earlier than DateTo");
        }

        this.dateFrom = dateFrom;
        this.dateTo = dateTo;

        this.fromTime = () => this.dateFrom ? this.dateFrom.getTime() : -Infinity;
        this.toTime = () => this.dateTo ? this.dateTo.getTime() : Infinity;
    }

    fromTime: () => number;
    toTime: () => number;

    hasCommonPeriod(periods: Period[] | null): boolean {
        if (!periods) return false;

        const thisFrom = this.fromTime();
        const thisTo = this.toTime();

        return periods.some(period => {
            const periodFrom = period.fromTime();
            const periodTo = period.toTime();
            return periodFrom < thisTo && periodTo > thisFrom;
        });
    }

    hasUnCommonPeriod(periods: Period[] | null): boolean {
        if (!periods || periods.length === 0) {
            return true;
        }

        const start = this.fromTime();
        const end = this.toTime();

        const sorted = periods
            .map(p => [p.fromTime(), p.toTime()] as [number, number])
            .filter(([f, t]) => t > start && f < end)
            .sort((a, b) => a[0] - b[0]);

        let cursor = start;
        for (const [f, t] of sorted) {
            if (f > cursor) {
                return true;
            }
            cursor = Math.max(cursor, t);
            if (cursor >= end) {
                return false;
            }
        }
        return cursor < end;
    }

    isPeriodSame(period: Period): boolean {
        return this.dateFrom?.getTime() === period.dateFrom?.getTime()
            && this.dateTo?.getTime() === period.dateTo?.getTime()
    }
}
