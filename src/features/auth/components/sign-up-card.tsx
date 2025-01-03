"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { z, TypeOf } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormItem,
  FormField,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { RegisterReqPayloadSchema, registerReqPayloadSchema } from "../schemas";
import { useRegister } from "@/features/api/mutations/use-register";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const SignUpCard = () => {
  const { mutate: signUp, isPending } = useRegister();
  const queryClient = useQueryClient();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(registerReqPayloadSchema),
    defaultValues: { name: "", email: "", password: "" },
    disabled: isPending,
  });

  async function onSubmitRegister(data: RegisterReqPayloadSchema) {
    signUp(
      { json: data },
      {
        onSuccess: async () => {
          router.refresh();
          await queryClient.invalidateQueries({ queryKey: ["current_user"] });
        },
      },
    );
  }

  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          By signing up, you agree to our{" "}
          <Link href="/privacy">
            <span className="text-blue-700">Privacy Policy</span>
          </Link>{" "}
          and{" "}
          <Link href="/terms">
            <span className="text-blue-700">Terms of Services</span>
          </Link>{" "}
        </CardDescription>
      </CardHeader>

      <div className="p-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(onSubmitRegister)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="Enter your name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="Enter email address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter password"
                      min={8}
                      max={256}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isPending} size="lg" className="w-full">
              Sign up
            </Button>
          </form>
        </Form>
      </CardContent>

      <div className="p-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex flex-col gap-y-4">
        <Button
          disabled={isPending}
          variant="secondary"
          size="lg"
          className="w-full"
        >
          <FcGoogle className="mr-2 size-5" />
          Login with Google
        </Button>

        <Button
          disabled={isPending}
          variant="secondary"
          size="lg"
          className="w-full"
        >
          <FaGithub className="mr-2 size-5" />
          Login with Github
        </Button>
      </CardContent>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7 flex items-center justify-center">
        <p>Already have an account?</p>
        <Link href="/sign-in">
          <span className="text-blue-700">&nbsp;Sign in</span>
        </Link>
      </CardContent>
    </Card>
  );
};
