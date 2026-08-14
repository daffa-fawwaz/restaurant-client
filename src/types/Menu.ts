export interface Menu {
    id: number
    name: string
    description: string
    image: string | null
    category: string
    price: string
    isAvailable: boolean
    createdAt: string
}

export interface UpdateMenuPayload {
  name: string;
  description: string;
  category: string;
  price: number;
  isAvailable: boolean;
}

