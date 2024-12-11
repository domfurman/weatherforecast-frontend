import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as L from 'leaflet';
import {GeolocationService} from '../services/geolocation.service';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.component.html',
  standalone: true,
  styleUrl: './map.component.scss'
})
export class MapComponent implements AfterViewInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  map!: L.Map
  markers: L.Marker[] = [
    L.marker([31.9539, 35.9106]), // Amman
    L.marker([32.5568, 35.8469]) // Irbid
  ];
  latitude!: number;
  longitude!: number;

  constructor(private cdr: ChangeDetectorRef, private geolocationService: GeolocationService) {
  }

  // ngOnInit() {
  //   this.cdr.detectChanges()
  //   this.initializeMap()
  // }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    this.geolocationService.getCurrentPosition().subscribe({
      next: (coords) => {
        this.latitude = coords.latitude;
        this.longitude = coords.longitude;

        this.initializeMap(this.latitude, this.longitude);
      },
      error: (err) => {
        console.error('Error getting geolocation:', err);
        this.initializeMap(50.049683, 19.944544);
      },
    });
  }

  initializeMap(latitude: number, longitude: number): void {
    if (!this.map) {
      this.map = L.map(this.mapContainer.nativeElement).setView([latitude, longitude], 16);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
      L.marker([latitude, longitude]).addTo(this.map).bindPopup('You are here').openPopup();
    }
    this.map.on('click', this.onMapClick.bind(this));
  }

  private addMarkers() {
    this.markers.forEach(marker => marker.addTo(this.map));
  }

  private centerMap() {
    const bounds = L.latLngBounds(this.markers.map(marker => marker.getLatLng()));
    this.map.fitBounds(bounds);
  }

  onMapClick(event: L.LeafletMouseEvent) {
    const { lat, lng } = event.latlng;
    console.log(lat, lng);
    this.geolocationService.setCoordinates(lat, lng);
  }
}
