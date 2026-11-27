export type CustomerType = 'B2B' | 'B2C';

export interface OrderSummary {
  orderNumber: string;
  customerType: CustomerType;
  sku: string;
  quantity: number;
  promisedDeliveryDate: string;
}
