import { Period } from "../date/period"
import type { carDetails } from "./carDetails"
import { fetchCars } from "./carDetails"

export type reservation = {
    id: number,
    carId: number,
    period: Period
}

export type reservationCar = {
    id: number,
    period: Period,
    car: carDetails;
}

function mapPeriod(fetchPeriod: { dateTimeFrom: Date, dateTimeTo: Date }): Period {
    return new Period(fetchPeriod.dateTimeFrom, fetchPeriod.dateTimeTo);
}

async function fetchReservations(): Promise<reservation[]> {
    const response = await fetch("https://localhost:7153/api/reservations");
    if (!response.ok) throw new Error(`Error fetching: ${response.status}`);

    const data: any[] = await response.json();

    data.forEach(e => {
        e.period = mapPeriod({
            dateTimeFrom: new Date(e.period.dateTimeFrom),
            dateTimeTo: new Date(e.period.dateTimeTo)
        });
    })

    return data;
}


export async function fetchReservationCars(): Promise<reservationCar[]> {
    const reservations = await fetchReservations();
    const cars = await fetchCars();

    const carMap: Map<number, carDetails> = new Map();
    cars.forEach(car => carMap.set(car.id, car));

    let reservationCars: reservationCar[] = [];
    reservations.forEach(reservation => reservationCars.push({
        id: reservation.id,
        period: reservation.period, 
        car: carMap.get(reservation.carId)!
    }));
    return reservationCars;
}

export async function reserveCar(carDetails: carDetails, period: Period) {
    const response = await fetch(`https://localhost:7153/api/cars/${carDetails.id}/reservations`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            period: {
                dateTimeFrom: period.dateFrom,
                dateTimeTo: period.dateTo
            }
        })
    });

    if(!response.ok) throw new Error(`Error posting data ${response.status}`);
}

export async function updateReservation(reservationId: number, period: Period) {
    const response = await fetch(`https://localhost:7153/api/reservations/${reservationId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            period: {
                dateTimeFrom: period.dateFrom,
                dateTimeTo: period.dateTo
            }
        })
    });

    if(!response.ok) throw new Error(`Error patching data ${response.status}`);
}