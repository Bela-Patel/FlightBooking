import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-passenger-details',
  standalone: true,
  imports: [FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './passenger-details.component.html',
  styleUrl: './passenger-details.component.css'
})
export class PassengerDetailsComponent implements OnInit {
  adults: number;
  childs: number;
  flightId: any;
  adultsFormGroup: any[] = [];
  childFormGroup: any[] = [];
  contactFormGroup: FormGroup;
  submitted = false;
  forms: any;
  showComp: boolean = false;
  genders = [
    { id: 0, name: "Select" },
    { id: 1, name: "Male" },
    { id: 2, name: "Female" },
    { id: 3, name: "Other" },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder,
  ) {
    this.route.queryParams.subscribe(params => {
      this.flightId = params['flightId'];
      this.childs = params['children'];
      this.adults = params['adults'];
    });
  }

  ngOnInit(): void {
    this.contactFormGroup = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      confirmEmail: ['', Validators.compose([Validators.required, Validators.email])],
      contactNumber: ['', [Validators.required]],
      adults: new FormArray([]),
      childs: new FormArray([])
    }, { validator: this.emailsMatchValidator });

    this.adultForm();
   
      this.childForm();
    this.showComp = true;
  }

  get email(): AbstractControl {
    return this.contactFormGroup.get('email');
  }

  get confirmEmail(): AbstractControl {
    return this.contactFormGroup.get('confirmEmail');
  }

  emailsMatchValidator(group: FormGroup) {
    const email = group.get('email').value;
    const confirmEmail = group.get('confirmEmail').value;

    if (email === confirmEmail) {
      return null;
    } else {
      return { emailsNotMatch: true };
    }
  }

  adultForm() {
    for (let index = 0; index < this.adults; index++) {
      (<FormArray>this.contactFormGroup.get("adults")).push(this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        gender: ['', Validators.required]
      }));
    }
  }

  childForm() {
    for (let index = 0; index < this.childs; index++) {
      (<FormArray>this.contactFormGroup.get("childs")).push(this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        gender: ['', Validators.required]
      }));
    }
  }

  get adultsArray() {
    return this.contactFormGroup.get('adults') as FormArray;
  }

  get childsArray() {
    return this.contactFormGroup.get('childs') as FormArray;
  }
  

  confirmBooking() {
    this.submitted = true;
    sessionStorage.setItem('passengers',JSON.stringify(this.contactFormGroup.value))
    if (this.contactFormGroup.valid)
      this.router.navigate(['/confirmation'], {
        queryParams: {
          flightId: this.flightId,
          numberOfAdults: this.adults,
          numberOfChilds: this.childs
        }
      });
  }
}
