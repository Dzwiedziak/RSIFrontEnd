import { Period } from "../date/period";

export type carDetails = {
    id: number,
    imgSrc: string,
    carModel: string,
    numberOfSeats: number,
    description: string,
    unavailablePeriods: Period[]
};

function mapCarFromApi(apiCar: any): carDetails {
    return {
        id: apiCar.id,
        imgSrc: apiCar.imgSrc,
        carModel: apiCar.model,
        numberOfSeats: apiCar.numberOfSeats,
        description: apiCar.description,
        unavailablePeriods: apiCar.unavailablePeriods.map((period: any) =>
            new Period(
                period.dateTimeFrom ? new Date(period.dateTimeFrom) : null,
                period.dateTimeTo ? new Date(period.dateTimeTo) : null
            )
        )
    };
}

export async function fetchCarsOld(): Promise<carDetails[]> {
    const response = await fetch("https://localhost:7153/api/cars");

    if (!response.ok) throw new Error(`Error fetching: ${response.status}`);

    const data = await response.json();
    
    return data.map((apiCar: any) => mapCarFromApi(apiCar));
}

export async function fetchCars(): Promise<carDetails[]> {
    const response = await fetch("https://localhost:7153/api/cars");

    if (!response.ok) throw new Error(`Error fetching: ${response.status}`);

    const data = await response.json();
    
    return data._embedded.getCarDTOList.map((apiCar: any) => mapCarFromApi(apiCar));
}