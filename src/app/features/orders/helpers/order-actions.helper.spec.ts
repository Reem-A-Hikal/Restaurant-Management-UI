import { OrderStatus } from '../models/order-enums';
import { getAvailableActions, getVisibleActions } from './order-actions.helper';

describe('order-actions.helper', () => {
  describe('getAvailableActions', () => {
    it('returns confirm and cancel for a New order', () => {
      expect(getAvailableActions(OrderStatus.New)).toEqual([
        'confirm',
        'cancel',
      ]);
    });

    it('returns preparing and cancel for Confirmed order', () => {
      expect(getAvailableActions(OrderStatus.Confirmed)).toEqual([
        'preparing',
        'cancel',
      ]);
    });

    it('returns ready and cancel for Preparing order', () => {
      expect(getAvailableActions(OrderStatus.Preparing)).toEqual([
        'ready',
        'cancel',
      ]);
    });

    it('returns only cancel for ready order', () => {
      expect(getAvailableActions(OrderStatus.Ready)).toEqual(['cancel']);
    });

    it('returns no actions for OutForDelivery order', () => {
      expect(getAvailableActions(OrderStatus.OutForDelivery)).toEqual([]);
    });

    it('returns no actions for Delivered order', () => {
      expect(getAvailableActions(OrderStatus.Delivered)).toEqual([]);
    });

    it('returns no actions for Cancelled order', () => {
      expect(getAvailableActions(OrderStatus.Cancelled)).toEqual([]);
    });

    it('returns an empty array for an unrecognized status value', () => {
      expect(getAvailableActions(99 as OrderStatus)).toEqual([]);
    });
  });

  describe('getVisibleActions', () => {
    it('gives Admin every action allowed by the order status', () => {
      expect(getVisibleActions(OrderStatus.New, 'Admin')).toEqual([
        'confirm',
        'cancel',
      ]);
    });

    it('filters out cancel for Chef, since Chef cannot cancel per backend authorize rules', () => {
      expect(getVisibleActions(OrderStatus.Confirmed, 'Chef')).toEqual([
        'preparing',
      ]);
    });

    it('returns no actions for DeliveryPerson, since DeliveryPerson has no order actions at all', () => {
      expect(getVisibleActions(OrderStatus.Ready, 'DeliveryPerson')).toEqual(
        [],
      );
    });

    it('only allow cancel for customer, even on statuses with staff-only actions', () => {
      expect(getVisibleActions(OrderStatus.Preparing, 'Customer')).toEqual([
        'cancel',
      ]);
    });

    it('returns no actions for unrecognized role', () => {
      expect(getVisibleActions(OrderStatus.New, 'SomeUnknownRole')).toEqual([]);
    });

    it('returns no actions once the order is Delivered, regardless of the role', () => {
      expect(getVisibleActions(OrderStatus.Delivered, 'Admin')).toEqual([]);
      expect(getVisibleActions(OrderStatus.Delivered, 'Chef')).toEqual([]);
    });
  });
});
