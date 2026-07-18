import { DeliveryDto } from '../../deliveries/models/delivery.model';

export interface TimelineStep {
  label: string;
  sub?: string;
  time: string;
  done: boolean;
  icon: string;
}

interface RawStep extends TimelineStep {
  priority: number; // 3=Delivered, 2=PickedUp, 1=Assigned, 0=Cancelled
  attemptNumber: number;
}

function isValidDate(value: string | null | undefined): value is string {
  return !!value && new Date(value).getFullYear() > 1970;
}

function buildStepsForDelivery(
  delivery: DeliveryDto,
  attemptNumber: number,
  showAttemptLabel: boolean,
): RawStep[] {
  const attemptPrefix = showAttemptLabel ? `Attempt ${attemptNumber} · ` : '';
  const courier = delivery.deliveryPersonName
    ? `${attemptPrefix}Courier: ${delivery.deliveryPersonName}`
    : attemptPrefix || undefined;

  const steps: RawStep[] = [];

  if (isValidDate(delivery.assignedAt)) {
    steps.push({
      label: 'Courier Assigned',
      sub: courier,
      time: delivery.assignedAt,
      done: true,
      icon: 'fa-truck',
      priority: 1,
      attemptNumber,
    });
  }
  if (isValidDate(delivery.deliveryStartTime)) {
    steps.push({
      label: 'Picked Up by Courier',
      sub: courier,
      time: delivery.deliveryStartTime,
      done: true,
      icon: 'fa-box',
      priority: 2,
      attemptNumber,
    });
  }
  if (isValidDate(delivery.deliveryEndTime)) {
    steps.push({
      label: 'Delivered Successfully',
      sub: courier,
      time: delivery.deliveryEndTime,
      done: true,
      icon: 'fa-check',
      priority: 3,
      attemptNumber,
    });
  }
  if (isValidDate(delivery.cancelledAt)) {
    steps.push({
      label: 'Delivery Cancelled',
      sub: delivery.notes ?? courier,
      time: delivery.cancelledAt,
      done: false,
      icon: 'fa-xmark',
      priority: 0,
      attemptNumber,
    });
  }

  return steps;
}

function sortSteps(a: RawStep, b: RawStep): number {
  const timeA = new Date(a.time).getTime();
  const timeB = new Date(b.time).getTime();
  if (timeA !== timeB) return timeB - timeA;
  if (a.priority !== b.priority) return b.priority - a.priority;
  return b.attemptNumber - a.attemptNumber;
}

/**
 * Builds the delivery timeline (assigned → picked up → delivered/cancelled)
 * across all delivery attempts for an order, sorted newest first.
 */
export function buildDeliveryTimeline(
  activeDelivery: DeliveryDto | null,
  history: DeliveryDto[],
): TimelineStep[] {
  const all = [...history];
  if (
    activeDelivery &&
    !all.some((d) => d.deliveryId === activeDelivery.deliveryId)
  ) {
    all.unshift(activeDelivery);
  }

  const sortedByCreation = [...all].sort((a, b) => a.deliveryId - b.deliveryId);
  const showAttemptLabel = sortedByCreation.length > 1;

  const allSteps = sortedByCreation.flatMap((delivery, index) =>
    buildStepsForDelivery(delivery, index + 1, showAttemptLabel),
  );

  return allSteps
    .filter((s) => s.time)
    .sort(sortSteps)
    .map((s) => ({
      ...s,
      time: new Date(s.time).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }));
}