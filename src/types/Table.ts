export interface Table {
    id: number
    number: number
    capacity: number
    createdAt: string
    isAvailable: boolean
}

export interface CreateTablePayload {
  number: number;
  capacity: number;
  isAvailable: boolean;
}