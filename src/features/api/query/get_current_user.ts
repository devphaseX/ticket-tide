"use client";

import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["current_user"],
    queryFn: async () => {
      const resp = await client.api.auth.current.$get();
      const respPayload = await resp.json();
      if (!respPayload.success) {
        return null;
      }
      return respPayload.data;
    },
  });
};
