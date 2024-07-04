import { Routes } from '@angular/router';
import { SearchFlightsComponent } from './search-flights/search-flights.component';
import { FlightListComponent } from './flight-list/flight-list.component';
import { FlightConfirmationComponent } from './flight-confirmation/flight-confirmation.component';
import { PassengerDetailsComponent } from './passenger-details/passenger-details.component';

export const routes: Routes = [
    { path: '', redirectTo: '/search', pathMatch: 'full' },
    { path: 'search', component: SearchFlightsComponent },
    { path: 'flights', component: FlightListComponent },
    { path: 'passengerdetails', component: PassengerDetailsComponent },
    { path: 'confirmation', component: FlightConfirmationComponent },
];
