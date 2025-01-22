import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServiceService } from '../service.service';
import { Service } from '../model/service.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReservationType } from '../model/reservation-type.enum';

@Component({
  selector: 'app-service-reservation-dialog',
  templateUrl: './service-reservation-dialog.component.html',
  styleUrl: './service-reservation-dialog.component.css'
})
export class ServiceReservationDialogComponent {

   constructor( public dialogRef: MatDialogRef<ServiceReservationDialogComponent>,
                // @Inject(MAT_DIALOG_DATA) public data: { service: Service, event: number },
                private service: ServiceService) { }

  reservationForm = new FormGroup({
    startingTime: new FormControl('', Validators.required),
    endingTime: new FormControl('', Validators.required)
  })

  reserve() {
    const { startingTime, endingTime }  = this.reservationForm.value;
    this.service.reserveService({ startingTime, endingTime }, 1, 15).subscribe({
      next: (_) => {
        console.log("uspjeh")
      }
    })
  }
  
}

