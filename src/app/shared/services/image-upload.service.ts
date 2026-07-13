import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  constructor(private readonly http: HttpClient) {}

  upload(
    file: File,
    folder: 'products' | 'users' = 'products',
  ): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ imageUrl: string }>(
      `${environment.apiBaseUrl}/upload/image?folder=${folder}`,
      formData,
    );
  }

  delete(imageUrl: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/upload/image`, {
      params: { url: imageUrl },
    });
  }
}
