<script lang="ts">
	import { goto } from "$app/navigation";
	import CarListItemRef from "$lib/components/forms/CarListItemRef.svelte";
	import type { carDetails } from "$lib/utils/api/carDetails";
    import { fetchCars } from "$lib/utils/api/carDetails";
	import { onMount } from "svelte";

    let carsForReservation: carDetails[];
    
    onMount(async () => {
        carsForReservation = await fetchCars();
    });
</script>

<div class="reservations__container">
    <div class="reservations__nav">
        <button class="reservations__nav-item" on:click={() => {goto("/reserved")}}>
            <img class="reservations__nav-icon" src="/icons/reservation.svg" alt="">
        </button>
    </div>
    <div class="reservations__header">
        Vehicles for reservation
    </div>
    <div class="reservations__list">
        {#each carsForReservation as carItem}
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