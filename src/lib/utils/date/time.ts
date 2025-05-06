export class Time {
    hour: number = 0;
    minute: number = 0;

    constructor(hour: number = 0, minute: number = 0) {
        this.hour = hour;
        this.minute = minute;
    }

    incHourMod = () => this.hour = (this.hour + 1) % 24;
    decHourMod = () => this.hour = (this.hour - 1 + 24) % 24;

    incMinuteMod = () => this.minute = (this.minute + 1) % 60;
    decMinuteMod = () => this.minute = (this.minute - 1 + 60) % 60;

    getAsTimeInput = () => `${String(this.hour).padStart(2, '0')}:${String(this.minute).padStart(2, '0')}`

    getHourStr = () => String(this.hour).padStart(2, '0')
    getMinuteStr = () => String(this.minute).padStart(2, '0');
}
