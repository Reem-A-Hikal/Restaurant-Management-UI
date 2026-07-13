import { OrderAction } from './order-actions.helper';

const ROLE_ACTIONS: Record<string, OrderAction[]> = {
  Admin: ['confirm', 'preparing', 'prepared', 'cancel'],
  Chef: ['confirm', 'preparing', 'prepared'], // Chef can't cancel per backend authorize rules
  Customer: ['cancel'],
  DeliveryPerson: [],
};

export function getActionForRole(role: string): OrderAction[] {
  return ROLE_ACTIONS[role] ?? [];
}
