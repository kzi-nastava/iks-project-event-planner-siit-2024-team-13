import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { ManageableServicesComponent } from './manageable-services/manageable-services.component';
import {SharedModule} from '../shared/shared.module';
import {RouterLink} from '@angular/router';
import {MaterialModule} from '../infrastructure/material/material.module';
import { CreateServiceComponent } from './create-service/create-service.component';
import { EditServiceComponent } from './edit-service/edit-service.component';
import { ServiceDetailsComponent } from './service-details/service-details.component';
import {ReactiveFormsModule} from '@angular/forms';
import { TopFiveServicesComponent } from './top-five-services/top-five-services.component';
import {MatGridList, MatGridTile} from '@angular/material/grid-list';
import {MatListOption, MatSelectionList} from '@angular/material/list';
import {MatAccordion, MatExpansionPanel, MatExpansionPanelTitle} from "@angular/material/expansion";
import {MatOption, MatSelect} from '@angular/material/select';
import { ServicesOverviewComponent } from './services-overview/services-overview.component';
import { ServicesFilterDialogComponent } from './services-filter-dialog/services-filter-dialog.component';
import { ServiceReservationDialogComponent } from './service-reservation-dialog/service-reservation-dialog.component';



@NgModule({
  declarations: [
    ManageableServicesComponent,
    CreateServiceComponent,
    EditServiceComponent,
    ServiceDetailsComponent,
    TopFiveServicesComponent,
    ServicesOverviewComponent,
    ServicesFilterDialogComponent,
    ServiceReservationDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    RouterLink,
    ReactiveFormsModule,
    NgOptimizedImage,
  ],
  exports: [
    TopFiveServicesComponent,
    ServicesOverviewComponent
  ]
})
export class ServiceModule { }
