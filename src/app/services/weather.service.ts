import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Weather } from '../models/weather';
import { map, Observable } from 'rxjs';
import { DailyWeatherDetails } from '../models/daily-weather-details';
import { WeekSummary } from '../models/week-summary';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private baiscUrl: string = 'http://localhost:8080'

  constructor(private http: HttpClient) { }

  get7DayForecast(lat: number, lon: number): Observable<Weather> {
    return this.http
      .get<Weather>(`${this.baiscUrl}/weather?latitude=${lat}&longitude=${lon}`)
      .pipe(
        map((data) => {
          const weather = new Weather();
          weather.date = data.date;
          weather.currentTemperature = data.currentTemperature;

          for (const key in data.dailyWeatherDetails) {
            if (data.dailyWeatherDetails.hasOwnProperty(key)) {
              const rawDetails = data.dailyWeatherDetails[key];
              const details = new DailyWeatherDetails;
              details.minTemperature = rawDetails.minTemperature;
              details.maxTemperature = rawDetails.maxTemperature;
              details.generatedEnergy = rawDetails.generatedEnergy
              details.weatherCode = rawDetails.weatherCode;

              weather.dailyWeatherDetails[key] = details;
            }
          }
          return weather;
        })
      )
  }

  getWeekSummary(lat: number, lon: number):Observable<WeekSummary> {
    return this.http
    .get<WeekSummary>(`${this.baiscUrl}/week-summary?latitude=${lat}&longitude=${lon}`)
    .pipe(
      map((data) => {
        let weekSummary: WeekSummary
        weekSummary = data
        // console.log(weekSummary)
        return weekSummary;
      })
    )
  }

}
