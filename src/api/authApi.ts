import api from "./axios";

interface LoginPayload {
    email: string
    password: string
}

interface LoginResponse {
    succes: boolean
    status: number
    message: string
    data: {
        accessToken: string
    }
}

export const login = async (
  payload: LoginPayload,
) => {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    payload,
  );

  return response.data.data;
};