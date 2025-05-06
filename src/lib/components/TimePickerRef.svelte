<script lang="ts">
    import { Time } from "$lib/utils/date/time";

    export let header = "Pick time"
    export let time: Time = new Time(0, 0);

    $: timeString = time.getAsTimeInput();
</script>

<div class="time-picker">
    <input type="time" class="time-picker__input" bind:value={timeString} hidden />
    <div class="time-picker__header">{header}</div>
    <div class="time-picker__content-container">
        <div class="time-picker__content">
            <div class="time-picker__number-section">
                <div class="time-picker__number-value">{time.getHourStr()}</div>
                <div class="time-picker__number-modifiers">
                    <button class="time-picker__number-modifier" on:click={() => {time.decHourMod(); time=time}} >
                        <img src="/icons/arrow_up.svg" class="time-picker__number-modifier-img" alt="-"/>
                    </button>   
                    <button class="time-picker__number-modifier" on:click={() => {time.incHourMod(); time=time}} >
                        <img src="/icons/arrow_down.svg" class="time-picker__number-modifier-img" alt="+"/>
                    </button> 
                </div>
            </div>
            <div class="time-picker__number-section">
                <div class="time-picker__number-value">{time.getMinuteStr()}</div>
                <div class="time-picker__number-modifiers">
                    <button class="time-picker__number-modifier" on:click={() => {time.decMinuteMod(); time=time}} >
                        <img src="/icons/arrow_up.svg" class="time-picker__number-modifier-img" alt="-"/>
                    </button>
                    <button class="time-picker__number-modifier" on:click={() => {time.incMinuteMod(); time=time}} >
                        <img src="/icons/arrow_down.svg" class="time-picker__number-modifier-img" alt="+"/>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .time-picker {
        display: flex;
        flex-direction: column;

        padding: 5px;
        gap: 8px;

        font-family: 'Inter';

        border: 1px solid black;
        border-radius: 5px;
    }
    .time-picker__header {
        font-size: 14px;
        text-align: center;
    }
    .time-picker__content-container {
        flex-grow: 1;
    }
    .time-picker__content {
        display: flex;
        justify-content: space-around;

        height: 100%;
    }
    .time-picker__number-section {
        display: flex;
        align-items: center;

        gap: 10px;
    }
    .time-picker__number-value {
        width: 30px;

        font-size: 22px;
        font-weight: bold;
    }
    .time-picker__number-modifiers {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        height: 100%;
        gap: 10px;
    }
    .time-picker__number-modifier-img {
        width: 10px;
    }
</style>