import { Component, OnInit } from '@angular/core';
import { Weather } from '../models/weather';
import { WeatherService } from '../services/weather.service';
import { CommonModule } from '@angular/common';
import { WeekSummary } from '../models/week-summary';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { weatherIconMapper } from '../models/weather-icon-mapper';

@Component({
    selector: 'app-weather-forecast',
    imports: [CommonModule, NgSelectModule, FormsModule],
    standalone: true,
    templateUrl: './weather-forecast.component.html',
    styleUrl: './weather-forecast.component.scss'
})
export class WeatherForecastComponent implements OnInit{
  weatherData?: Weather;
  weekSummary?: WeekSummary;
  formattedDate: string = '';
  formattedDetails: { date: string; day: string; details: any }[] = [];
  weatherIcon: string = '';
  city: string = '';
  cities: string[] = [];
  selectedCity: string = '';

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        console.log("latitude: ",lat)
        console.log("longitude: ",lon)

        // this.weatherService.get7DayForecast(lat, lon).subscribe({
        //   next: (data) => {
        //     this.weatherData = data;
        //     // console.log('Weather data: ', this.weatherData);
        //   },
        //   error: (err) => {
        //     console.error("Error encountered: ", err);
        //   }
        // });
        this.weatherService.get7DayForecast(lat, lon).subscribe((data) => {
          this.weatherData = data;
          this.formatWeatherDetails();
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

  formatWeatherDetails(): void {
    if (this.weatherData?.dailyWeatherDetails) {
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
      const today = new Date();
      const todayIndex = today.getDay();
  
      const reorderedDaysOfWeek = [
        ...daysOfWeek.slice(todayIndex), 
        ...daysOfWeek.slice(0, todayIndex)
      ];
  
      const detailsArray = Object.entries(this.weatherData.dailyWeatherDetails).map(([date, details]) => {
        const [year, month, day] = date.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);
  
        return {
          date: `${day}/${month}/${year}`,
          day: daysOfWeek[dateObj.getDay()],
          dayIndex: dateObj.getDay(),
          details: details,
        };
      });
  
      this.formattedDetails = detailsArray.sort((a, b) => {
        const indexA = reorderedDaysOfWeek.indexOf(a.day);
        const indexB = reorderedDaysOfWeek.indexOf(b.day);
        return indexA - indexB;
      });
    }
  }

  // getTodaysDate

  searchCities(event: any) {
    const searchTerm = event.term;
    if (searchTerm.length > 2) {
      this.weatherService.getLocationSuggestions(searchTerm).subscribe(data => {
        this.cities = data.results.map((result: { formatted: any; }) => result.formatted);
      });
    }
  }

  mapWeatherIcon(code: number) {
    return weatherIconMapper[code];
  }

}
