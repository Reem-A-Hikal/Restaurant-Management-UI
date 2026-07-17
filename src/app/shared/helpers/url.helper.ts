import { environment } from "../../../environments/environment";

export function toAssetUrl(relativePath?: string | null, fallback: string = ''): string {
  if (!relativePath) return fallback;
  if (relativePath.startsWith('http')) return relativePath; // already absolute
  return `${environment.assetsBaseUrl}${relativePath}`;
}