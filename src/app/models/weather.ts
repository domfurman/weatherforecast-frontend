import { DailyWeatherDetails } from "./daily-weather-details";

export class Weather {
    date: Date = new Date();
    dailyWeatherDetails: { [key: string]: DailyWeatherDetails } = {};

}
