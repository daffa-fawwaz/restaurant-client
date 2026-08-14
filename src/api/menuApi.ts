import api from "./axios";
import type { Menu } from "../types/Menu";


interface ApiResponse<T> {
    succes: boolean
    status: number
    messages: string
    data: T
}

export const getMenus = async () => {
  const response = await api.get<ApiResponse<Menu[]>>("/menus")

  return response.data.data;
};

export const createMenu = async (formData: FormData,): Promise<Menu> => {
    const token = localStorage.getItem('token')
    const response = await api.post<ApiResponse<Menu>>("/menus", formData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return response.data.data
}

export const updateAvailable = async (id: number): Promise<Menu> => {
    const token = localStorage.getItem("token")

    const response = await api.patch<ApiResponse<Menu>>(`/menus/is-avail/${id}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return response.data.data
}

export const updateMenu = async (id: number, formData: Menu): Promise<Menu> => {
    const token = localStorage.getItem("token")

    const response = await api.put<ApiResponse<Menu>>(`/menus/${id}`, formData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return response.data.data
} 

export const deleteMenu = async (id: number) => {
    const token = localStorage.getItem("token")

    const response = await api.delete<ApiResponse<Menu>>(`/menus/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

