import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { axiosClient } from "@/lib/axios-client";

export function decodeJWT() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosClient.get("/api/auth/status");
        setUser(res.data);
      } catch {
        navigate({ to: "/login" });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  return { user, loading };
}
