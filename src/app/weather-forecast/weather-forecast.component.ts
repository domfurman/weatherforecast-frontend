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

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.weatherService.get7DayForecast().subscribe({
      next: (data) => {
        this.weatherData = data;
        // console.log('Weather data: ', this.weatherData);
      },
      error: (err) => {
        console.error("Error encountered: ", err);
      }
    });
    this.weatherService.getWeekSummary().subscribe({
      next: (data) => {
        this.weekSummary = data;
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  getDates(details: { [key: string]: any }): string[] {
    return Object.keys(details);
  }

}
