export function canViewDeliveryLogistics(role: string): boolean {
  return role === 'Admin';
}

export function canViewPayments(role: string): boolean {
  return role === 'Admin';
}