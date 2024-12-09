import { Component, OnInit } from '@angular/core';
import { Weather } from '../models/weather';
import { WeatherService } from '../services/weather.service';
import { CommonModule } from '@angular/common';
import { WeekSummary } from '../models/week-summary';

@Component({
  selector: 'app-weather-forecast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-forecast.component.html',
  styleUrl: './weather-forecast.component.scss'
})
export class WeatherForecastComponent implements OnInit{
  weatherData?: Weather;
  weekSummary?: WeekSummary;
  city: string = '';

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        console.log("latitude: ",lat)
        console.log("longitude: ",lon)

        this.weatherService.get7DayForecast(lat, lon).subscribe({
          next: (data) => {
            this.weatherData = data;
            // console.log('Weather data: ', this.weatherData);
          },
          error: (err) => {
            console.error("Error encountered: ", err);
          }
        });

        this.weatherService.getWeekSummary(lat, lon).subscribe({
          next: (data) => {
            this.weekSummary = data;
          },
          error: (err) => {
            console.error(err);
          }
        })
        this.weatherService.getLocationName(lat, lon).subscribe(data => {
          this.city = data.results[0].components.city
          // console.log(data.results[0].components)
        })
      }
    )
  }

  getDates(details: { [key: string]: any }): string[] {
    return Object.keys(details);
  }

}
