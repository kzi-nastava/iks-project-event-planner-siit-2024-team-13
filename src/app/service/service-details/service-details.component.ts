import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Service} from '../model/service.model';
import {ActivatedRoute, Router, RouterState} from '@angular/router';
import {ServiceService} from '../service.service';
import {ImageResponseDto} from '../../shared/model/image-response-dto.model';
import {forkJoin, switchMap} from 'rxjs';
import {AuthService} from '../../auth/auth.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import { ServiceReservationDialogComponent } from '../service-reservation-dialog/service-reservation-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrl: './service-details.component.css'
})
export class ServiceDetailsComponent implements OnInit {
  @Input() service: Service
  isFavourite: boolean;

  constructor(
    private route: ActivatedRoute,
    private serviceService: ServiceService,
    private authService: AuthService,
    private toasterService: ToastrService,
    private router: Router,
    private dialog: MatDialog
  ) {
  }

  get loggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  ngOnInit(): void {
    this.route.params.subscribe(param => {
      const id: number = +param['id'];
      this.serviceService.get(id).pipe(
        switchMap((service: Service) =>{
          if (this.loggedIn) {
            return forkJoin([
              this.serviceService.get(id),
              this.serviceService.getImages(service.id),
              this.serviceService.getIsFavourite(service.id)
            ]);
          } else {
            return forkJoin([
              this.serviceService.get(id),
              this.serviceService.getImages(service.id)
            ]);
          }
        })
      ).subscribe({
        next: ([service, images, isFavourite]: [Service, ImageResponseDto[], boolean?]) => {
          this.service = service;
          if(this.loggedIn) {
            this.isFavourite = isFavourite;
          }
          this.service.images = images.map(image =>
            `data:${image.contentType};base64,${image.data}`
          );
        },
        error: (error: HttpErrorResponse) => {
          void this.router.navigate(['/error'], {
            queryParams: {
              code: error.status,
              message: error.error?.message || 'An unknown error occurred.'
            }
          });
        }
      });
    });
  }

  openDialog(): void {
      let dialog = this.dialog.open(ServiceReservationDialogComponent, {
        height: '500px',
        width: '600px',
      });
  
    }

  toggleFavouriteService(): void {
    if(this.isFavourite) {
      this.serviceService.removeFromFavourites(this.service.id).subscribe({
        next: () => {
          this.toasterService.info(`Removed ${this.service.name} from favourite services`, "Favourite services");
          this.isFavourite = false;
        }
      });
    } else {
      this.serviceService.addToFavourites(this.service.id).subscribe({
        next: () => {
          this.toasterService.success(`Added ${this.service.name} to favourite services`, "Favourite services");
          this.isFavourite = true;
        }
      });
    }
  }
}
