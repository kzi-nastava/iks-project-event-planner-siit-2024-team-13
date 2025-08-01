import {TestBed} from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {ServiceService} from './service.service';
import {mockValidServiceForm} from '../../testing/mocks/service-form.mock';
import {provideHttpClient} from '@angular/common/http';
import {environment} from '../../env/environment';
import {CreateService} from './model/create-service.model';
import {Service} from './model/service.model';
import { ReservationRequest } from './model/reservation-request.model';
import { validReservationRequest } from '../../testing/mocks/reservation-form.mock';

describe('ServiceService', () => {
  let service: ServiceService;
  let httpController: HttpTestingController;

  const eventId = 42;
  const serviceId = 7;
  const reservationEndpoint = `${environment.apiHost}/events/${eventId}/services/${serviceId}/reservation`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ServiceService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ServiceService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  describe('create()', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should send POST request and return created service', () => {
      const createPayload: CreateService = mockValidServiceForm;
      const mockResponse: Service = null;

        service.create(createPayload).subscribe(response => {
          expect(response).toEqual(mockResponse);
          expect(req.request.url).toBe(`${environment.apiHost}/services`);
          expect(req.request.body).toEqual(createPayload);
        });

        const req = httpController.expectOne(`${environment.apiHost}/services`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(createPayload);

        req.flush(mockResponse);
    });

    it('should handle 500 server error gracefully', () => {
      const payload = mockValidServiceForm;
      service.create(payload).subscribe({
        next: () => fail('Expected error, but got success'),
        error: (err) => {
          expect(err.status).toBe(500);
          expect(req.request.url).toBe(`${environment.apiHost}/services`);
          expect(req.request.body).toEqual(payload);
        }
      });

        const req = httpController.expectOne(`${environment.apiHost}/services`);
        req.flush({ message: 'Internal error' }, { status: 500, statusText: 'Server Error' });
    });

    it('should return validation errors on bad input (400)', () => {
      const payload = mockValidServiceForm;
      service.create(payload).subscribe({
        next: () => fail('Expected validation error'),
        error: (err) => {
          expect(err.status).toBe(400);
          expect(err.error.message).toContain('Validation');
          expect(req.request.url).toBe(`${environment.apiHost}/services`);
          expect(req.request.body).toEqual(payload);
        }
      });

      const req = httpController.expectOne(`${environment.apiHost}/services`);
      req.flush({ message: 'Validation failed' }, { status: 400, statusText: 'Bad Request' });
    });

    it('should return 401 Unauthorized when user is not authenticated', () => {
      const payload: CreateService = mockValidServiceForm;

      service.create(payload).subscribe({
        next: () => fail('Expected 401 Unauthorized error'),
        error: (err) => {
          expect(err.status).toBe(401);
          expect(err.statusText).toBe('Unauthorized');
          expect(req.request.url).toBe(`${environment.apiHost}/services`);
          expect(req.request.body).toEqual(payload);
        }
      });

      const req = httpController.expectOne(`${environment.apiHost}/services`);
      req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
    });

    it('should return 403 Forbidden when user lacks provider role', () => {
      const payload: CreateService = mockValidServiceForm;

      service.create(payload).subscribe({
        next: () => fail('Expected 403 Forbidden error'),
        error: (err) => {
          expect(err.status).toBe(403);
          expect(err.statusText).toBe('Forbidden');
          expect(req.request.url).toBe(`${environment.apiHost}/services`);
          expect(req.request.body).toEqual(payload);
        }
      });

      const req = httpController.expectOne(`${environment.apiHost}/services`);
      req.flush({ message: 'Forbidden' }, { status: 403, statusText: 'Forbidden' });
    });

    it('should handle 500 server error during image upload', () => {
      const serviceId = 99;
      const file = new File(['oops'], 'error.jpg');

      service.uploadImages(serviceId, [file]).subscribe({
        next: () => fail('Expected error, but got success'),
        error: (err) => {
          expect(err.status).toBe(500);
          expect(err.statusText).toBe('Server Error');
        }
      });

      const req = httpController.expectOne(`${environment.apiHost}/services/${serviceId}/images`);
      expect(req.request.method).toBe('POST');
      req.flush({ message: 'Upload failed' }, { status: 500, statusText: 'Server Error' });
    });

    it('should handle 401 Unauthorized during image upload', () => {
      const serviceId = 1;
      const file = new File(['x'], 'unauthorized.jpg');

      service.uploadImages(serviceId, [file]).subscribe({
        next: () => fail('Expected 401 error'),
        error: (err) => {
          expect(err.status).toBe(401);
          expect(err.statusText).toBe('Unauthorized');
        }
      });

      const req = httpController.expectOne(`${environment.apiHost}/services/${serviceId}/images`);
      req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
    });

    it('should send FormData with uploaded images', () => {
      const serviceId = 42;
      const file1 = new File(['file1-content'], 'file1.jpg', { type: 'image/jpeg' });
      const file2 = new File(['file2-content'], 'file2.png', { type: 'image/png' });
      const postSpy = spyOn(service['httpClient'], 'post').and.callThrough();

      service.uploadImages(serviceId, [file1, file2]).subscribe();

      const req = httpController.expectOne(`${environment.apiHost}/services/${serviceId}/images`);
      expect(req.request.method).toBe('POST');

      const formData: FormData = req.request.body as FormData;

      expect(formData instanceof FormData).toBeTrue();

      expect(postSpy).toHaveBeenCalledWith(
        `${environment.apiHost}/services/${serviceId}/images`,
        jasmine.any(FormData),
        jasmine.objectContaining({ responseType: 'text' as 'json' })
      );

      req.flush('', { status: 200, statusText: 'OK' });
    });

    it('should handle 403 Forbidden during image upload', () => {
      const serviceId = 2;
      const file = new File(['x'], 'forbidden.jpg');

      service.uploadImages(serviceId, [file]).subscribe({
        next: () => fail('Expected 403 error'),
        error: (err) => {
          expect(err.status).toBe(403);
          expect(err.statusText).toBe('Forbidden');
        }
      });

      const req = httpController.expectOne(`${environment.apiHost}/services/${serviceId}/images`);
      req.flush({ message: 'Forbidden' }, { status: 403, statusText: 'Forbidden' });
    });
  });

  describe('reserveService()', () => {
    it('should send POST request - reserve service', () => {
      const payload: ReservationRequest = validReservationRequest;
      service.reserveService(payload, eventId, serviceId).subscribe({
        next: (response) => expect(response).toBeNull()
      });

      const req = httpController.expectOne(reservationEndpoint);

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);

      req.flush(null);
    });

    it('should return 401 Unauthorized when user is not authenticated', () => {
      const payload: ReservationRequest = validReservationRequest;

      service.reserveService(payload, eventId, serviceId).subscribe({
        next: () => fail('Expected 401 Unauthorized error'),
        error: (err) => {
          expect(err.status).toBe(401);
          expect(err.statusText).toBe('Unauthorized');
          expect(req.request.url).toBe(reservationEndpoint);
          expect(req.request.body).toEqual(payload);
        }
      });

      const req = httpController.expectOne(reservationEndpoint);
      req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
    });

    it('should return 403 Forbidden when user lacks ORGANIZER role', () => {
      const payload: ReservationRequest = validReservationRequest;

      service.reserveService(payload, eventId, serviceId).subscribe({
        next: () => fail('Expected 403 Forbidden error'),
        error: (err) => {
          expect(err.status).toBe(403);
          expect(err.statusText).toBe('Forbidden');
          expect(req.request.url).toBe(reservationEndpoint);
          expect(req.request.body).toEqual(payload);
        }
      });

      const req = httpController.expectOne(reservationEndpoint);
      req.flush({ message: 'Forbidden' }, { status: 403, statusText: 'Forbidden' });
    });

    it('should handle 500 server error gracefully', () => {
      const payload = validReservationRequest;

      service.reserveService(payload, eventId, serviceId).subscribe({
        next: () => fail('Expected error, but got success'),
        error: (err) => {
          expect(err.status).toBe(500);
          expect(req.request.url).toBe(reservationEndpoint);
          expect(req.request.body).toEqual(payload);
        }
      });

      const req = httpController.expectOne(reservationEndpoint);
      req.flush({ message: 'Internal error' }, { status: 500, statusText: 'Server Error' });
    });

    it('should return validation errors on bad input (400)', () => {
      const payload = validReservationRequest;

      service.reserveService(payload, eventId, serviceId).subscribe({
        next: () => fail('Expected validation error'),
        error: (err) => {
          expect(err.status).toBe(400);
          expect(err.error.message).toContain('Validation');
          expect(req.request.url).toBe(reservationEndpoint);
          expect(req.request.body).toEqual(payload);
        }
      });

      const req = httpController.expectOne(reservationEndpoint);
      req.flush({ message: 'Validation failed' }, { status: 400, statusText: 'Bad Request' });
    });
  });
});
