import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.auth)["sign-up"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.auth)["sign-up"]["$post"]
>;

export const useRegister = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationKey: ["sign-up"],
    mutationFn: async ({ json }) => {
      const response = await client.api.auth["sign-up"].$post({ json });
      return response.json();
    },
  });
};
