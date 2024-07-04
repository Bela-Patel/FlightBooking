import { CommonModule, formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-flights',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './search-flights.component.html',
  styleUrl: './search-flights.component.css'
})
export class SearchFlightsComponent implements OnInit {
  searchForm!: FormGroup;
  source!: string;
  destination!: string;
  date!: string;
  passengers!: number;
  submitted = false;
  cabinClass = [
    { id: 1, name: "Economy" },
    { id: 2, name: "Premium Economy" },
    { id: 3, name: "Business Class" },
    { id: 4, name: "First Class" }
  ];

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      source: ['', Validators.required],
      destination: ['', Validators.required],
      date: ['', [Validators.required, this.dateValidator]],
      guests: this.fb.group({
        adults: [1, [Validators.required, Validators.min(1),Validators.max(5)]],
        children: [0, [Validators.required, Validators.min(0),Validators.max(2)]]
      })
    });
  }

  dateValidator(control: FormControl): { [key: string]: boolean } | null {
    const today = new Date();
    const selectedDate = new Date(control.value);
    if (selectedDate < today) {
      return { 'invalidDate': true };
    }
    return null;
  }


  searchFlights() {
    this.submitted = true;
    if (this.searchForm.valid) {
      this.router.navigate(['/flights'], {
        queryParams: { 
            ...this.searchForm.value, 
            adults: this.searchForm.value.guests.adults, 
            children: this.searchForm.value.guests.children, 
            guests:undefined
          }
      });
    }
  }
}
