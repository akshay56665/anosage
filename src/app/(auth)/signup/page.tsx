"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDebounceCallback } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 500);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const checkUsernameUnique = async () => {
    if (username) {
      console.log(username);
      setIsCheckingUsername(true);
      setUsernameMessage("");
    }
    try {
      const response = await axios.get(
        `api/username-validation?username=${username}`
      );
      const message = response.data.message;
      setUsernameMessage(message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      setUsernameMessage(
        axiosError.response?.data.message ?? "Error checking username"
      );
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    if (data.username === "" || data.email === "" || data.password === "") {
      toast({
        title: "Error",
        description: "All fields are mandatory",
        variant: "destructive",
      });
      setIsSubmitting(true);
      return;
    }

    try {
      const response = await axios.post<ApiResponse>("/api/signup", data);
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace(`/verify/${username}`);
    } catch (error) {
      console.error("Error in signup submition: ", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errMessage = axiosError.response?.data.message;
      toast({
        title: "Signup failed",
        variant: "destructive",
        description: errMessage,
      });
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    checkUsernameUnique();
  }, [username]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Join Us</h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                      placeholder="Username"
                    />
                  </FormControl>

                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  <p
                    className={`text-sm ${
                      usernameMessage === "Username is unique"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Signup
            </Button>
          </form>
          <div className="text-center mt-4">
            <p>
              Already a member?{" "}
              <Link
                href={"/signin"}
                className="text-blue-600 hover:text-blue-800"
              >
                Signin
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
}
