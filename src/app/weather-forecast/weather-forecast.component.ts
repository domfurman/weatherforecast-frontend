import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { Weather } from '../models/weather';
import { WeatherService } from '../services/weather.service';
import { CommonModule } from '@angular/common';
import { WeekSummary } from '../models/week-summary';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { weatherIconMapper } from '../models/weather-icon-mapper';
import {MapComponent} from '../map/map.component';
import {GeolocationService} from '../services/geolocation.service';

declare var bootstrap: any;
@Component({
    selector: 'app-weather-forecast',
  imports: [CommonModule, NgSelectModule, FormsModule, MapComponent],
    standalone: true,
    templateUrl: './weather-forecast.component.html',
    styleUrl: './weather-forecast.component.scss'
})
export class WeatherForecastComponent implements OnInit{
  weatherData?: Weather;
  weekSummary?: WeekSummary;
  latitude: number = 0;
  longitude: number = 0;
  formattedDetails: { date: string; day: string; details: any }[] = [];
  city: string = '';
  suggestions: any[] = [];

  constructor(private weatherService: WeatherService, private geolocationService: GeolocationService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.subscribeToCoordinates();
    this.geolocationService.getCurrentPosition().subscribe({
      next: (coords) => {
        this.latitude = coords.latitude;
        this.longitude = coords.longitude;

        this.weatherService.get7DayForecast(this.latitude, this.longitude).subscribe((data) => {
          this.weatherData = data;
          this.formatWeatherDetails();
        });

        this.weatherService.getWeekSummary(this.latitude, this.longitude).subscribe({
          next: (data) => {
            this.weekSummary = data;
          },
          error: (err) => {
            console.error(err);
          },
        });

        this.geolocationService.getLocationName(this.latitude, this.longitude).subscribe((data) => {
          this.city = data.results[0].components.city;
        });
      },
      error: (err) => {
        console.error('Error getting geolocation:', err);
      },
    });
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

  mapWeatherIcon(code: number) {
    return weatherIconMapper[code];
  }

  changeForecastBasedOnCoordsInput() {
    this.weatherService.get7DayForecast(this.latitude, this.longitude).subscribe(data => {
      this.weatherData = data;
      this.formatWeatherDetails();
    });
    this.weatherService.getWeekSummary(this.latitude, this.longitude).subscribe({
      next: (data) => {
        this.weekSummary = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
    this.geolocationService.getLocationName(this.latitude, this.longitude).subscribe(data => {
      const location = data.results[0];
      if (location && location.components) {
        this.city = location.components.city ||
          location.components.town ||
          location.components.village ||
          location.components.hamlet ||
          'Unknown location';
      } else {
        this.city = 'Unknown location';
      }

      // console.log(location);
      // console.log('Resolved location:', this.city);
    });
  }

  openCoordinateModal() {
    const modalElement = document.getElementById('coordinateModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  confirmCoords(elementId: string) {
    // console.log(this.latitude, this.longitude);
    this.changeForecastBasedOnCoordsInput();
    const modalElement = document.getElementById(elementId);
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }

  openMapModal() {
    const modalElement = document.getElementById('mapModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  openPlaceSearchModal() {
    const modalElement = document.getElementById('placeSearchModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input.value;
    if (query && query.length > 2) {
      this.geolocationService.searchPlaces(query).subscribe((data: any[]) => {
        this.suggestions = data;
      });
    }
  }

  selectSuggestion(suggestion: any): void {
    // console.log('Selected place:',suggestion.lat, suggestion.lon);
    this.latitude = suggestion.lat;
    this.longitude = suggestion.lon;
    this.changeForecastBasedOnCoordsInput();
    const modalElement = document.getElementById('placeSearchModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide()
  }

  selectFromMap(lat: number, lng: number, modalId: string): void {
    this.latitude = lat;
    this.longitude = lng;
    this.changeForecastBasedOnCoordsInput();

    if (modalId) {
      const modalElement = document.getElementById(modalId);
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }
      }
    }
  }

  subscribeToCoordinates(): void {
    this.geolocationService.coordinates$.subscribe((coords) => {
      if (coords) {
        this.selectFromMap(coords.lat, coords.lng, 'mapModal');
      }
    });
  }

}
