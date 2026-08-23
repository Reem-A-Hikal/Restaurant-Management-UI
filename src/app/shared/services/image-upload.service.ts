import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SKIP_ERROR_TOAST } from '../tokens/skip-error-toast.token';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  constructor(private readonly http: HttpClient) {}

  private readonly skipContext = new HttpContext().set(SKIP_ERROR_TOAST, true);

  upload(
    file: File,
    folder: 'products' | 'users' = 'products',
  ): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ imageUrl: string }>(
      `${environment.apiBaseUrl}/upload/image?folder=${folder}`,
      formData,
      {
        context: this.skipContext,
      }
    );
  }

  delete(imageUrl: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/upload/image`, {
      params: { url: imageUrl },
      context: this.skipContext,
    });
  }
}
