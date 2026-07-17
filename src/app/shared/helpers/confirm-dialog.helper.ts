export interface ConfirmDialogOptions {
  title?: string;
  text?: string;
  confirmButtonText?: string;
  icon?: 'warning' | 'question' | 'info';
}

/**
 * Shows a SweetAlert2 confirmation dialog for a destructive action
 * (delete, archive, cancel, etc). Returns true if the user confirmed.
 */
export async function confirmDestructiveAction(
  options: ConfirmDialogOptions = {},
): Promise<boolean> {
  const Swal = await import('sweetalert2');
  const result = await Swal.default.fire({
    title: options.title ?? 'Are you sure?',
    text: options.text ?? "You won't be able to revert this!",
    icon: options.icon ?? 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#6c757d',
    confirmButtonText: options.confirmButtonText ?? 'Yes, delete it!',
  });
  return result.isConfirmed;
}

export async function showSuccessDialog(
  title: string,
  text: string,
): Promise<void> {
  const Swal = await import('sweetalert2');
  await Swal.default.fire({
    title,
    text,
    icon: 'success',
    timer: 2000,
    showConfirmButton: false,
    timerProgressBar: true,
  });
}

export async function showErrorDialog(text: string): Promise<void> {
  const Swal = await import('sweetalert2');
  await Swal.default.fire({
    title: 'Error!',
    text,
    icon: 'error',
    showConfirmButton: true,
    confirmButtonText: 'OK',
  });
}