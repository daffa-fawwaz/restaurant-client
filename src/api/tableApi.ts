import api from "./axios";
import type { CreateTablePayload } from "../types/Table";

export const getAllTable = async () => {
  const token = localStorage.getItem("token");
  const response = await api.get("/tables", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};

export const createTable = async (data: CreateTablePayload) => {
  const token = localStorage.getItem("token");
  const response = await api.post(
    "/tables",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  console.log(response.data);
  return response.data.data;
};

export const updateTable = async (id: number, data:CreateTablePayload ) => {
    const token = localStorage.getItem("token")

    const response = await api.put(`/tables/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return response.data.data
}

export const updateIsAvailable = async (id: number) => {
  const token = localStorage.getItem("token");

  const response = await api.patch(
    `/tables/${id}/toggle-status`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data.data;
};

export const deleteTable = async (id: number) => {
    const token = localStorage.getItem("token")

    const response = await api.delete(`/tables/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return response.data.data
}
