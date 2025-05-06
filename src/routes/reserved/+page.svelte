<script lang="ts">
	import CarListItemRef from "$lib/components/forms/CarListItemRef.svelte";
	import { fetchReservationCars, type reservationCar } from "$lib/utils/api/reservation";
	import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    let reservations: reservationCar[];
    
    onMount(async () => {
        reservations = await fetchReservationCars();
    });
</script>

<div class="reservations__container">
    <div class="reservations__nav">
        <button class="reservations__nav-item" on:click={() => {goto("/")}}>
            <img class="reservations__nav-icon" src="/icons/calendars.svg" alt="">
        </button>
    </div>
    <div class="reservations__header">
        Vehicle reservations
    </div>
    <div class="reservations__list">
        {#each reservations as carItem}
            <div class="reservations__list-item">
                <CarListItemRef componentState={carItem}/>
            </div>
        {/each}
    </div>
</div>


<style>
    .reservations__container {
        display: flex;
        flex-direction: column;
        gap: 30px;
        align-items: center;
        width: 100%;
        font-family: 'Inter';
    }
    .reservations__nav {
        display: flex;
        justify-content: flex-end;
        border-bottom: 1px solid black;
        position: sticky;
        top: 0;
        background-color: white;
        z-index: 1000;
        width: 100%;
    }
    .reservations__list {
        width: 80%;
        max-width: 800px;
        display: flex;
        flex-direction: column;
        gap: 50px;
    }
    .reservations__list-item {
        width: 100%;
        height: 450px;
    }
    .reservations__header {
        font-size: 24px;
        font-weight: bold;
    }
</style>