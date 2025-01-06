import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  private LOCATION_API_KEY = environment.locationApiUrl;
  private coordinatesSubject = new BehaviorSubject<{ lat: number; lng: number } | null>(null);
  coordinates$ = this.coordinatesSubject.asObservable();
  constructor(private http: HttpClient) {}

  getCurrentPosition(): Observable<{ latitude: number; longitude: number }> {
    return new Observable((observer) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            observer.next({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            observer.complete();
          },
          (error) => {
            observer.error(error);
          }
        );
      } else {
        observer.error(new Error('Geolocation is not available in this browser.'));
      }
    });
  }

  getLocationName(lat:number, lon: number): Observable<any> {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${this.LOCATION_API_KEY}&pretty=1`;
    return this.http.get<any>(url);
  }

  searchPlaces(query: string): Observable<any[]> {
    if (query.length > 2) {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;
      return this.http.get<any[]>(url);
    }
    return new Observable<any[]>();
  }

  setCoordinates(lat: number, lng: number): void {
    this.coordinatesSubject.next({ lat, lng });
  }
}
