<script lang="ts">
	import DatePeriodPickerRef from "../DatePeriodPickerRef.svelte";
	import TimePickerRef from "../TimePickerRef.svelte";
    import type { carDetails } from "$lib/utils/api/carDetails";
	import { Period } from "$lib/utils/date/period";
	import { Time } from "$lib/utils/date/time";
	import { removeReservation, reserveCar, updateReservation, type reservationCar } from "$lib/utils/api/reservation";
    import { goto } from '$app/navigation';

    type SectionState = 'info' | 'reservation';

    const switchSectionBtnStr = {
        'info': 'Calendar',
        'reservation': 'Go to Info'
    }

    export let componentState: reservationCar | carDetails;

    function setUpDetailsOfCar(input: reservationCar | carDetails) {
        const isReservation = isReservationCar(input);
        if(isReservation) {
            const reservation = (input as reservationCar);
            detailsOfCar = reservation.car;
            reservationId = reservation.id;

            detailsOfCar.unavailablePeriods = detailsOfCar.unavailablePeriods.filter(p => !p.isPeriodSame(input.period));

            const dateFrom = input.period.dateFrom!;
            const dateTo = input.period.dateTo!;

            timeFrom = new Time(dateFrom.getHours(), dateFrom.getMinutes());
            timeTo = new Time(dateTo.getHours(), dateTo.getMinutes());

            dateFrom.setHours(0, 0, 0, 0);
            dateTo.setHours(0, 0, 0, 0);

            selectedPeriodInDate = new Period(dateFrom, dateTo);
        } else {
            detailsOfCar = input;
        }
    }

    $: setUpDetailsOfCar(componentState);

    function isReservationCar(car: any): car is reservationCar {
        return car && typeof car === "object" && "period" in car;
    }

    let reservationId: number | null = null;
    let detailsOfCar: carDetails;

    let sectionState: SectionState = 'info';

    function switchSectionState() {
        switch(sectionState) {
            case 'info':
                sectionState = 'reservation';
                break;
            case 'reservation':
                sectionState = 'info';
                break;
            default:
                throw new Error("Section state unknown");
        }
    }

    let selectedPeriodInDate: Period | null = null;
    let timeFrom: Time;
    let timeTo: Time;

    $: period = getProperPeriod(selectedPeriodInDate, timeFrom, timeTo);
    $: isReserveBtnDisabled = isReservationBlocked(period);

    function getProperPeriod(datePeriod: Period | null, fromTime: Time, toTime: Time): Period | null {
        if (!datePeriod || !datePeriod.dateFrom || !datePeriod.dateTo) {
            return null;
        }

        const MS_IN_HOUR = 3600000;
        const MS_IN_MINUTE = 60000;

        const fromOffset = fromTime.hour * MS_IN_HOUR + fromTime.minute * MS_IN_MINUTE;
        const toOffset = toTime.hour * MS_IN_HOUR + toTime.minute * MS_IN_MINUTE;

        const fromInMs = datePeriod.dateFrom.getTime() + fromOffset;
        const toInMs = datePeriod.dateTo.getTime() + toOffset;

        return new Period(new Date(fromInMs), new Date(toInMs));
    }

    function isReservationBlocked(period: Period | null): boolean {
        if (!period) return true;
        return period.hasCommonPeriod(detailsOfCar.unavailablePeriods);
    }

    function onReserveBtnClick() {
        if (reservationId) {
            updateReservation(reservationId, period!);
        } else {
            reserveCar(detailsOfCar, period!);
        }
        goto("/reserved")
    }
</script>

<div class="car-li">
    <div class="car-li__photo-sec">
        <img class="car-li__photo" src={detailsOfCar.imgSrc} alt="Fetch failed">
    </div>
    <div class="car-li__info">
        <div class="car-li__content-inner">
            {#if sectionState==='info'}
                <div class="car-li__info-section">
                    <div class="car-li__header">
                        {detailsOfCar.carModel}
                    </div>
                    <div class="car-li__properties">
                        <div class="car-li__property">
                            <img src="/icons/user_icon.svg" class="car-li__property-img" alt="Users">
                            <div class="car-li__property-value">
                                {detailsOfCar.numberOfSeats}
                            </div>
                        </div>
                    </div>
                    <div class="car-li__description">
                        {detailsOfCar.description}
                    </div>
                </div>
            {/if}
            {#if sectionState === 'reservation'}
                <div class="car-li__reserve-section">
                    <div class="car-li__date-picker-wrapper">
                        <DatePeriodPickerRef blockedPeriods={detailsOfCar.unavailablePeriods} bind:selectedPeriod={selectedPeriodInDate} />
                    </div>
                    <div class="car-li__time-sec">
                        <div class="car-li__time-picker-wrapper">
                            <TimePickerRef header="Time from" bind:time={timeFrom}/>
                        </div>
                        <div class="car-li__time-picker-wrapper">
                            <TimePickerRef header="Time to" bind:time={timeTo}/>
                        </div>
                    </div>
                </div>
            {/if}
        </div>
        <div class="car-li__btns-section">
            <button class="car-li__section-btn car-li__section-switch-btn" on:click={() => switchSectionState()}>
                {switchSectionBtnStr[sectionState]}
            </button>
            {#if reservationId !== null}
                <button class="car-li__section-btn car-li__section-delete-btn" on:click={async () => await removeReservation(reservationId!)}>
                    Unreserve
                </button>
            {/if}
            {#if sectionState === 'reservation'}
                <button class="car-li__section-btn car-li__section-reserve-btn" on:click={() => onReserveBtnClick()}
                    class:car-li__section-reserve-btn--disabled={isReserveBtnDisabled} disabled={isReserveBtnDisabled}>
                        Reserve
                </button>
            {/if}
        </div>
    </div>
</div>

<style>
    button {
        cursor: pointer;
    }
    .car-li {
        display: flex;
        width: 100%;
        height: 100%;
        font-family: 'Inter';
        border: 1px solid black;
        border-radius: 5px;
    }
    .car-li__photo-sec {
        aspect-ratio: 9/16;
        height: 100%;
    }
    .car-li__photo {
        height: 100%;
        width: 100%;
        object-fit: contain;
    }
    .car-li__properties {
        display: flex;
    }
    .car-li__property {
        display: flex;
    }
    .car-li__time-sec {
        display: flex;
        gap: 20px;
        width: 100%;
    }
    .car-li__info {
        width: 100%;
        display: flex;
        flex-direction: column;
        padding: 15px;
        gap: 5px;
    }
    .car-li__date-picker-wrapper {
        flex-grow: 1;
        container-type: inline-size;
    }
    .car-li__time-picker-wrapper {
        width: 100%;
    }
    .car-li__btns-section {
        display: flex;
        justify-content: space-between;
        padding-top: 5px;
    }
    .car-li__section-btn {
        border-radius: 5px;
        color: white;
        padding: 8px;
    }
    .car-li__section-reserve-btn {
        background-color: #54d143;
    }
    .car-li__section-reserve-btn--disabled {
        background-color: #92d18a;
    }
    .car-li__section-switch-btn {
        background-color: red;
    }
    .car-li__section-delete-btn {
        background-color: red;
    }
    .car-li__reserve-section {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }
    .car-li__content-inner {
        flex-grow: 1;
        display: flex;
    }
    .car-li__info-section {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
</style>