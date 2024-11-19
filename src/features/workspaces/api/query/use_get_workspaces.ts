import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

export const useGetWorkspaces = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const resp = await client.api.workspaces.$get();

      if (!resp.ok) {
        throw new Error("cannot fetch workspaces");
      }

      return resp.json();
    },
  });
};
