import { OrderAction } from './order-actions.helper';

const ROLE_ACTIONS: Record<string, OrderAction[]> = {
  Admin: ['confirm', 'preparing', 'ready', 'cancel'],
  Chef: ['confirm', 'preparing', 'ready'], // Chef can't cancel per backend authorize rules
  Customer: ['cancel'],
  DeliveryPerson: [],
};

export function getActionForRole(role: string): OrderAction[] {
  return ROLE_ACTIONS[role] ?? [];
}
