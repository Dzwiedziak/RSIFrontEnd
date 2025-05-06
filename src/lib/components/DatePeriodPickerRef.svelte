<script lang="ts">
    import { Period } from "$lib/utils/date/period";
	import { YearMonth } from "$lib/utils/date/yearmonth";

    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const monthNames = [
        'January', 'February', 'March', 'April', 'May',
        'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ]

    export let selectedPeriod: Period | null = null;
    export let blockedPeriods: Period[] = [];
    export let currentYearMonth: YearMonth = new YearMonth();

    let calendarDays: (number | null)[] = []

    function generateCalendar(yearmonth: YearMonth) {
        calendarDays = [];

        const firstDay = new Date(yearmonth.year, yearmonth.month).getDay();
        const adjustedFirstDay = (firstDay === 0) ? 6 : firstDay - 1;

        const daysInMonth = new Date(yearmonth.year, yearmonth.month + 1, 0).getDate();

        for (let i = 0; i < adjustedFirstDay; i++) {
            calendarDays.push(null);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            calendarDays.push(day);
        }
    }

    function isBlocked(day: number) {
        const start = new Date(currentYearMonth.year, currentYearMonth.month, day);
        const end = new Date(currentYearMonth.year, currentYearMonth.month, day + 1);
        end.setMilliseconds(end.getMilliseconds() - 1);

        const checkedPeriod = new Period(start, end);
        return !checkedPeriod.hasUnCommonPeriod(blockedPeriods);
    }

    function isInRange(day: number) {
        if(!selectedPeriod || !selectedPeriod.dateFrom || !selectedPeriod.dateTo) return false;
        const date = new Date(currentYearMonth.year, currentYearMonth.month, day);
        return selectedPeriod.dateFrom <= date && date <= selectedPeriod.dateTo;
    }

    function isSelected(day: number) {
        if(!selectedPeriod || !selectedPeriod.dateFrom || selectedPeriod.dateTo) return false;
        const date = new Date(currentYearMonth.year, currentYearMonth.month, day);
        return date.getTime() >= selectedPeriod.dateFrom.getTime();
    }

    function getDayClass(day: number | null) {
        if(!day) return '';
        return isBlocked(day) ? 'date-picker__calendar-day--blocked' :
            isInRange(day) ? 'date-picker__calendar-day--inrange' :
            isSelected(day) ? 'date-picker__calendar-day--selected' : '';
    }

    $: generateCalendar(currentYearMonth);
    
    function onDayClick(day: number | null) {
        if (!day || isBlocked(day)) return;

        const clickedDate = new Date(currentYearMonth.year, currentYearMonth.month, day);
        if (!selectedPeriod || !selectedPeriod.dateFrom || selectedPeriod.dateTo) {
            selectedPeriod = new Period(clickedDate, null)
        } else if (selectedPeriod.fromTime <= selectedPeriod.toTime) {
            selectedPeriod.dateTo = clickedDate;
        }
    }
</script>

<div class="date-picker">
    <input type="date" name="date-picker__date-from" hidden>
    <input type="time" name="date-picker__time-from" hidden>
    <input type="date" name="date-picker__date-to" hidden>
    <input type="time" name="date-picker__time-to" hidden>

    <div class="date-picker__header">
        <button class="date-picker__prev-month" on:click={() => {currentYearMonth.prevMonth(); currentYearMonth = currentYearMonth}}>
            <img src="/icons/arrow_left.svg" alt="Previos">
        </button>
        <div class="date-picker__month-year">
            {monthNames[currentYearMonth.month]} {currentYearMonth.year}
        </div>
        <button id="date-picker__next-month" on:click={() => {currentYearMonth.nextMonth(); currentYearMonth = currentYearMonth}}>
            <img src="/icons/arrow_right.svg" alt="Next">
        </button>
    </div>
    <div class="date-picker__calendar">
        {#each daysOfWeek as day}
            <div class="date-picker__calendar-header">{day}</div>
        {/each}
        {#each calendarDays as day}
            <button on:click={() => onDayClick(day)}>
                <div class="date-picker__calendar-day {getDayClass(day)}">{day}</div>
            </button>
        {/each}
    </div>
</div>

<style>
    .date-picker {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-family: 'Inter';
        width: 100%;
        height: 100%;
    }

    .date-picker__header {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }
    .date-picker__month-year {
        display: flex;
        align-items: center;
    }
    .date-picker__calendar-header {
        font-weight: bold;
    }
    .date-picker__calendar {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 10px;
        text-align: center;
        margin: 20px auto;
        width: 100%;
        height: 100%;
    }

    .date-picker__calendar-day {
        min-height: 20px;
        min-width: 25px;
        cursor: pointer;
        border: 1px solid #ccc;
        border-radius: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .date-picker__calendar-day:hover {
        cursor: pointer;
        background-color: #f0f0f0;
    }

    .date-picker__calendar-day--selected {
        background-color: lightblue;
    }
    .date-picker__calendar-day--inrange {
        background-color: lightgreen;
    }
    .date-picker__calendar-day--blocked {
        background-color: lightcoral;
    }

    @container (max-width: 400px){
        .date-picker__calendar {
            gap: 5px;
            margin: 5px auto;
        }
    }
</style>