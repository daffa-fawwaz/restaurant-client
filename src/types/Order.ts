export interface CreateOrderItem {
  menuId: number;
  quantity: number;
  note?: string;
}

export interface CreateOrderPayload {
  tableId: number;
  source: "ADMIN";
  nameCustomer: string;
  items: CreateOrderItem[];
}


export interface OrderMenu {
  id: number;
  name: string;
  description: string;
  image: string | null;
  category: string;
  price: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | "IN_PROGRESS"
  | "SERVED"
  | "PAID";

export interface OrderItem {
  id: number;
  orderId: number;
  menuId: number;
  quantity: number;
  price: string;
  note: string | null;
  createdAt: string;

  menu: {
    id: number;
    name: string;
    description: string;
    image: string | null;
    category: string;
    price: string;
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface Order {
  id: number;
  tableId: number;
  source: string;
  status: OrderStatus;
  nameCustomer: string | null;

  subtotal: string;
  serviceCharge: string;
  total: string;

  isPaid: boolean;
  amountReceived: string | null;
  changeAmount: string | null;
  paidAt: string | null;

  createdAt: string;
  updatedAt: string;

  table: {
    id: number;
    number: number;
    capacity: number;
    isAvailable: boolean;
    createdAt: string;
  };

  items: OrderItem[];
}

export interface CreateOrderPayload {
  tableId: number;
  source: "ADMIN";
  nameCustomer?: string;
  items: {
    menuId: number;
    quantity: number;
    note?: string;
  }[];
}
