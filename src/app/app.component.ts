import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WeatherForecastComponent } from "./weather-forecast/weather-forecast.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, WeatherForecastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'weatherforecast-frontend';
}
