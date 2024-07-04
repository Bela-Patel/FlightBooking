import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-flight-list',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './flight-list.component.html',
  styleUrl: './flight-list.component.css'
})
export class FlightListComponent implements OnInit {
  flights: any[] = [];
  filterFlights: any[] = [];
  source!: string;
  destination!: string;
  date!: string;
  guests?: { adults: number, children: number };


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.source = params['source'];
      this.destination = params['destination'];
      this.date = params['date'];
      this.guests = { adults: params['adults'], children: params['children'] };
      this.loadFlights();
    });
  }

  loadFlights() {
    this.http
      .get<any[]>(`http://localhost:5000/api/flights`, {
        params: {
          source: this.source,
          destination: this.destination,
          date: this.date,
          guests: JSON.stringify(this.guests)
        }
      })
      .subscribe(data => {
        this.flights = data;
        this.filterFlights = this.flights;
      });
  }

  bookFlight(flightId: number) {
    this.router.navigate(['/passengerdetails'], {
      queryParams: {
        flightId: flightId,
        adults: this.guests.adults, 
        children: this.guests.children,         
      }
    });
  }

  flightDurationFilter(event : Event){
    const currentRange = (event.target as HTMLInputElement).value;
    document.getElementById('durationRange').innerText = `5 hours - ${currentRange} hours`;
    this.filterFlights = this.flights.filter(f => parseFloat(f.duration) <=  parseFloat(currentRange));
  }

  flightPriceFilter(event : Event){
    const currentRange = (event.target as HTMLInputElement).value;
    document.getElementById('priceRange').innerText = `$100 - $${currentRange}`;
    this.filterFlights = this.flights.filter(f => parseFloat(f.price) <=  parseFloat(currentRange));
  }
}
