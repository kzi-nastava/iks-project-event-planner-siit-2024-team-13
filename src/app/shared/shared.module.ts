import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from './product-card/product-card.component';
import { MaterialModule } from '../infrastructure/material/material.module';
import { EventCardComponent } from './event-card/event-card.component';
import {ServiceCardComponent} from './service-card/service-card.component';
import {SearchBarComponent} from './search-bar/search-bar.component';
import {RouterLink} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';
import { EventSelectionComponent } from './event-selection/event-selection.component';
import { ErrorComponent } from './error/error.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import {ChatDialogComponent} from './chat-dialog/chat-dialog.component';
import { CreateCommentDialogComponent } from '../review/create-comment-dialog/create-comment-dialog.component';

@NgModule({
  declarations: [
    ProductCardComponent,
    EventCardComponent,
    ServiceCardComponent,
    SearchBarComponent,
    InfoDialogComponent,
    EventSelectionComponent,
    InfoDialogComponent,
    ChatDialogComponent,
    ErrorComponent,
    ConfirmationDialogComponent,
    CreateCommentDialogComponent,
    ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterLink,
    ReactiveFormsModule
  ],
  exports: [
    ServiceCardComponent,
    SearchBarComponent,
    ProductCardComponent,
    EventCardComponent,
    ChatDialogComponent,
  ]
})
export class SharedModule { }
