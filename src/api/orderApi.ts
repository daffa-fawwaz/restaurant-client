import api from "./axios";
import type { CreateOrderPayload, OrderStatus } from "../types/Order";

interface GetOrdersParams {
  status?: OrderStatus;
  tableId?: number;
}

export const createOrder = async (data: CreateOrderPayload) => {
  const token = localStorage.getItem("token");

  const response = await api.post("/order", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};

export const getAllOrder = async (params: GetOrdersParams = {}) => {
  const token = localStorage.getItem("token");

  const response = await api.get("/order", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });

  return response.data.data;
};

export const changeStatusOrder = async (id: number, status: OrderStatus) => {
  const token = localStorage.getItem("token");

  const response = await api.patch(
    `/order/${id}`,
    {
      status,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.data;
};

export const getOrderById = async (id: number) => {
  const token = localStorage.getItem("token");

  const response = await api.get(`/order/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};

export const payOrder = async (
  id: number,
  amountReceived: number,
) => {
  const token = localStorage.getItem("token");

  const response = await api.patch(
    `/order/${id}/payment`,
    {
      amountReceived,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.data;
};
