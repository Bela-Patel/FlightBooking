import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-flight-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flight-confirmation.component.html',
  styleUrl: './flight-confirmation.component.css'
})
export class FlightConfirmationComponent implements OnInit{
  confirmationMessage!: string;
  flightId!: number;
  passengerName?: string;
  numberOfAdults: number; 
  numberOfChilds: number;
  passengers: { adults: any , childs: any };
  passengersDetails: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.flightId = params['flightId'];
      this.numberOfChilds = params['numberOfChilds'];
      this.numberOfAdults = params['numberOfAdults']; 
      this.confirmFlight();
    });
    this.passengersDetails = sessionStorage.getItem('passengers');
    console.log(this.passengersDetails);
  }

    confirmFlight() {
      this.http
        .post<any>(`http://localhost:5000/api/confirm`, {
          flightId: this.flightId,
          children : this.numberOfChilds,
          adults : this.numberOfAdults
        })
        .subscribe(response => {
          if (response.success) {
            this.confirmationMessage = 'Flight confirmed!';
          } else {
            this.confirmationMessage = response.message;
          }
        });
    }
  
    downloadTicket() {
      this.http.post(`http://localhost:5000/api/download-ticket`, {
        flightId: this.flightId,
        numberOfChilds : this.numberOfChilds,
        numberOfAdults : this.numberOfAdults,
        passengersDetails: this.passengersDetails
      }, { responseType: 'blob' })
      .subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ticket.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      });
    }
}
