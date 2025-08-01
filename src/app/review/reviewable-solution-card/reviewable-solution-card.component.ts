import {Component, Input, OnInit} from '@angular/core';
import {ReviewableSolution} from '../model/reviewable-solution.model';
import {ProductService} from '../../product/product.service';
import {ServiceService} from '../../service/service.service';
import {RatingService} from '../rating.service';
import {Rating} from '../model/rating.model';
import {HttpErrorResponse} from '@angular/common/http';
import {CreateCommentDialogComponent} from '../create-comment-dialog/create-comment-dialog.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {CommentService} from '../comment.service';
import {ReviewType} from '../model/review-type.enum';
import {ToastrService} from 'ngx-toastr';
import {ERROR_MESSAGES} from '../../shared/constants/error-messages';
import {Router} from '@angular/router';

@Component({
  selector: 'app-review-card',
  templateUrl: './reviewable-solution-card.component.html',
  styleUrl: './reviewable-solution-card.component.css'
})
export class ReviewableSolutionCardComponent implements OnInit {
  @Input() item: ReviewableSolution;

  image: string = "/photo_placeholder.png";
  stars: number[] = [1, 2, 3, 4, 5];
  rating: number = 0;

  constructor(
    private productService: ProductService,
    private serviceService: ServiceService,
    private ratingService: RatingService,
    private commentService: CommentService,
    private toasterService: ToastrService,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadImages();
    if(this.item.rating) {
      this.rating = this.item.rating.rating;
    }
  }

  loadImages(): void {
    if(this.item.type === ReviewType.PRODUCT) {
      this.productService.getImage(this.item.id).subscribe({
        next: (blob: Blob) => {
          this.image = URL.createObjectURL(blob);
        }
      });
    } else {
      this.serviceService.getImage(this.item.id).subscribe({
        next: (blob: Blob) => {
          this.image = URL.createObjectURL(blob);
        }
      });
    }
  }

  rate(star: number) {
    if(!this.item.rating) {
      this.rating = star;
    }
  }

  onRate(): void {
    this.ratingService.createRating(this.item.id, this.item.type, this.rating).subscribe({
      next: (rating: Rating) => {
        this.item.rating = rating;
        this.toasterService.success("Rating has been created successfully!", "Success");
      },
      error: (error: HttpErrorResponse) => this.handleError(error)
    });
  }

  openDialog(): void {
    const dialog = this.dialog.open(CreateCommentDialogComponent, {
      width: '450px',
      height: 'auto',
      data: this.item
    });
    this.handleCloseDialog(dialog)
  }

  private handleCloseDialog(dialog: MatDialogRef<CreateCommentDialogComponent>): void {
    dialog.afterClosed().subscribe(({ comment }: { comment: string }) => {
      this.commentService.createComment({ comment: comment, objectId: this.item.id, type: this.item.type }).subscribe({
        next: () => {
          this.toasterService.success("Comment has been created successfully!", "Success");
        },
        error: (error: HttpErrorResponse) => this.handleError(error)
      });
    });
  }

  private handleError(error: HttpErrorResponse): void {
    if (error.status < 500)
      this.toasterService.error(ERROR_MESSAGES.GENERAL_ERROR, error.error.message)
    else
      this.toasterService.error(ERROR_MESSAGES.GENERAL_ERROR , ERROR_MESSAGES.SERVER_ERROR)
  }

  onSeeMoreClick(): void {
    if(this.item.type === ReviewType.PRODUCT) {
      void this.router.navigate(['product-details', this.item.id]);
    } else {
      void this.router.navigate(['service-details', this.item.id]);
    }
  }
}
