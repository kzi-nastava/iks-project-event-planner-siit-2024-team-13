import {Injectable} from '@angular/core';
import {Service} from './model/service.model';
import {ServiceFilter} from './model/service-filter.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PagedResponse } from '../shared/model/paged-response.model';
import { environment } from '../../env/environment';
import { Observable } from 'rxjs';
import {CreateService} from './model/create-service.model';
import {ImageResponseDto} from '../shared/model/image-response-dto.model';
import {PageProperties} from '../shared/model/page-properties.model';
import {UpdateService} from './model/update-service.model';
import { ReservationRequest } from './model/reservation-request.model';
import {Reservation} from './model/reservation.model';
import {Status} from '../category/model/status-enum-ts';
import {RemoveImageRequest} from '../shared/model/remove-image-request.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private httpClient: HttpClient) { }

  getAll(pageProperties? : PageProperties): Observable<PagedResponse<Service>> {
    let params = new HttpParams();

    if (pageProperties)
      params = params.set('page', pageProperties.pageIndex).set('size', pageProperties.pageSize);

    if (pageProperties.sortBy && pageProperties.sortDirection)
      params = params.set('sort', `${pageProperties.sortBy},${pageProperties.sortDirection}`);

    return this.httpClient.get<PagedResponse<Service>>(environment.apiHost + "/services", { params: params });
  }

  getTopServices(): Observable<Service[]> {
    return this.httpClient.get<Service[]>(environment.apiHost + "/services/top-five-services");
  }

  update(id: number, service: UpdateService): Observable<Service> {
    return this.httpClient.put<Service>(`${environment.apiHost}/services/${id}`, service);
  }

  create(service: CreateService): Observable<Service> {
    return this.httpClient.post<Service>(`${environment.apiHost}/services`, service);
  }

  get(id: number): Observable<Service> {
    return this.httpClient.get<Service>(`${environment.apiHost}/services/${id}`);
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiHost}/services/${id}`);
  }

  filterServices(filter: ServiceFilter, pageProperties: PageProperties) : Observable<PagedResponse<Service>> {
    const params = this.buildQueryParams(filter, pageProperties)
    return this.httpClient.get<PagedResponse<Service>>(`${environment.apiHost}/services/filter`, { params })
  }

  searchServices(keyword: string, pageProperties: PageProperties): Observable<PagedResponse<Service>> {
    let params = new HttpParams()

    if (pageProperties)
      params = params.set('keyword', keyword).set('page', pageProperties.pageIndex).set('size', pageProperties.pageSize)

    if (pageProperties.sortBy && pageProperties.sortDirection)
      params = params.set('sort', `${pageProperties.sortBy},${pageProperties.sortDirection}`);

    return this.httpClient.get<PagedResponse<Service>> (environment.apiHost + "/services/search", {params: params})
  }

  uploadImages(serviceId: number, files: File[]): Observable<void> {
    const formData: FormData = new FormData();

    files.forEach(file => {
      formData.append('images', file, file.name);
    });

    return this.httpClient.post<void>(
      `${environment.apiHost}/services/${serviceId}/images`,
      formData,
      { responseType: 'text' as 'json' }
    );
  }

  getImages(id: number): Observable<ImageResponseDto[]> {
    return this.httpClient.get<ImageResponseDto[]>(
      `${environment.apiHost}/services/${id}/images`,
    );
  }

  getImage(id: number): Observable<Blob> {
    return this.httpClient.get(
      `${environment.apiHost}/services/${id}/image`,
      { responseType: 'blob' }
    ) as Observable<Blob>;
  }

  filterProviderServices(filter: ServiceFilter, pageProperties?: PageProperties): Observable<PagedResponse<Service>> {
    const params = this.buildQueryParams(filter, pageProperties)
    return this.httpClient.get<PagedResponse<Service>>(
      `${environment.apiHost}/account/services/filter`,
      { params: params }
    );
  }

  searchProviderServices(keyword: string, pageProperties?: PageProperties): Observable<PagedResponse<Service>> {
    let params = new HttpParams()
    if (pageProperties){
      params = params
        .set('keyword', keyword)
        .set('page', pageProperties.pageIndex)
        .set('size', pageProperties.pageSize)
    }
    return this.httpClient.get<PagedResponse<Service>>(environment.apiHost + "/account/services/search", {params: params})
  }

  getAllForProvider(pageProperties?: PageProperties, filter?: ServiceFilter): Observable<PagedResponse<Service>> {
    let params = this.buildQueryParams(filter, pageProperties);
    return this.httpClient.get<PagedResponse<Service>>(environment.apiHost + "/account/services", { params: params });
  }

  reserveService(request: ReservationRequest, eventId: number, serviceId: number): Observable<void> {
    return this.httpClient.post<void>(`${environment.apiHost}/events/${eventId}/services/${serviceId}/reservation`, request)
  }

  getPendingReservations(): Observable<Reservation[]> {
    return this.httpClient.get<Reservation[]>(`${environment.apiHost}/reservations/pending`);
  }

  updateReservation(id: number, status: Status): Observable<Reservation> {
    return this.httpClient.patch<Reservation>(`${environment.apiHost}/reservations/${id}`, { status:status });
  }

  removeFromFavourites(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiHost}/account/services/favourites/${id}`);
  }

  addToFavourites(id: number): Observable<void> {
    return this.httpClient.post<void>(`${environment.apiHost}/account/services/favourites/${id}`, {});
  }

  getIsFavourite(id: number): Observable<boolean> {
    return this.httpClient.get<boolean>(`${environment.apiHost}/account/services/favourites/${id}`);
  }

  removeImages(id: number, removedImages: RemoveImageRequest[]): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiHost}/services/${id}/images`, { body: removedImages });
  }

  private buildQueryParams(filter: ServiceFilter, pageProperties: PageProperties): HttpParams {
    let params = new HttpParams();

    if (filter) {
      Object.keys(filter).forEach((key) => {
        const typedKey = key as keyof ServiceFilter;
        const value = filter[typedKey];

        if (value !== undefined && value != null && value != "")
          params = params.set(typedKey, value);
      });
    }

    if (pageProperties)
      params = params.set('page', pageProperties.pageIndex).set('size', pageProperties.pageSize);

    if (pageProperties.sortBy && pageProperties.sortDirection)
      params = params.set('sort', `${pageProperties.sortBy},${pageProperties.sortDirection}`);

    return params
  }
}
