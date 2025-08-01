import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CreateComment} from './model/create-comment.model';
import {ReviewType} from './model/review-type.enum';
import {Comment} from './model/comment.model';
import {environment} from '../../env/environment';
import {Status} from '../category/model/status-enum-ts';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private httpClient: HttpClient) { }

  createComment(request: CreateComment): Observable<Comment> {
    return this.httpClient.post<Comment>(`${environment.apiHost}/comments`, request);
  }

  getPendingComments(): Observable<Comment[]> {
    return this.httpClient.get<Comment[]>(`${environment.apiHost}/comments/pending`);
  }

  updateCommentStatus(id: number, status: Status): Observable<Comment> {
    return this.httpClient.patch<Comment>(`${environment.apiHost}/comments/${id}`, { status: status });
  }

  getAcceptedCommentsForTarget(type: ReviewType, objectId: number): Observable<Comment[]> {
    const params = new HttpParams()
      .set('type', type)
      .set('id', objectId.toString());

    return this.httpClient.get<Comment[]>(`${environment.apiHost}/comments`, { params });
  }
}
