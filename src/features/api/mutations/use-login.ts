import { client } from "@/lib/rpc";
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.auth)["sign-in"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.auth)["sign-in"]["$post"]
>;

export const useLogin = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationKey: ["sign-in"],
    mutationFn: async ({ json }) => {
      const response = await client.api.auth["sign-in"].$post({ json });
      return response.json();
    },
  });
};
