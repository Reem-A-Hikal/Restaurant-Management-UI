export enum OrderStatus {
  New = 'New',
  Confirmed = 'Confirmed',
  Preparing = 'Preparing',
  Ready = 'Ready',
  OutForDelivery = 'OutForDelivery',
  Delivered = 'Delivered',
  Canceled = 'Canceled',
}

export enum PaymentMethod {
  Stripe = 'Stripe',
  Cash = 'Cash',
}

export enum OrderSource {
  Website = 'Website',
  Phone = 'Phone',
  ThirdParty = 'ThirdParty',
}

export class OrderDto {
  public OrderId: number = 0;

  /**
   * Gets or sets the order number.
   */
  public OrderNumber: string = ''; // Auto-generated

  /**
   * Gets or sets the date and time when the order was placed.
   */
  public OrderDate: Date = new Date();

  /**
   * Gets or sets the status of the order.
   */
  public Status: OrderStatus = OrderStatus.New; // New, Confirmed, Preparing, Ready, OutForDelivery, Delivered, Canceled

  public StatusDisplay: string = '';

  /**
   * Items total before fees/discounts
   */
  public SubTotal: number = 0;

  /**
   * Gets or sets the delivery fee for the order.
   */
  public DeliveryFee: number = 0;

  /**
   * Gets or sets the tax amount for the order.
   */
  public Tax: number = 0;

  /**
   * Gets or sets the discount amount for the order.
   */
  public Discount: number = 0.0;

  /**
   * Gets or sets the total amount for the order.
   */
  public TotalAmount: number = 0; // Total amount including items, delivery fee, tax, and discount

  /**
   * Gets or sets the payment status of the order.
   */
  public PaymentStatus: string = 'Pending'; // Pending, Completed, Failed

  public CustomerName: string | null = null;
  public CustomerId: string | null = null;

  public CustomerAddress: string | null = null;

  /**
   * Gets or sets the delivery person assigned to the order.
   */
  public DeliveryPersonName: string | null = null;
}
