import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationKey: ["user_logout"],
    mutationFn: async () => {
      const resp = await client.api.auth.logout.$post();
      return resp.json();
    },

    onSuccess: async () => {
      router.refresh();
      await queryClient.invalidateQueries({ queryKey: ["current_user"] });
    },
  });
};
