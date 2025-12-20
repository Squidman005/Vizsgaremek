import { redirect } from "@tanstack/react-router";
import { axiosClient } from "@/lib/axios-client";

export async function decodeJWT() {
  try {
    const res = await axiosClient.get("/api/auth/status", { withCredentials: true });

    if (!res.data || Object.keys(res.data).length === 0) {
      throw redirect({ to: "/login" });
    }

    return { user: res.data, loading: false };
  } catch (err: any) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      throw redirect({ to: "/login" });
    }
    return { user: null, loading: false };
  }
}
