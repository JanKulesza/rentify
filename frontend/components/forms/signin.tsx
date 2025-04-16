"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import FormInput from "../inputs/form-input";
import Link from "next/link";
import google from "@/public/google.svg";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema, SigninSchemaType } from "./signin-schema";
import { Form } from "../ui/form";
import Image from "next/image";
import Spinner from "../ui/spinner";

const SignInForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<SigninSchemaType>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SigninSchemaType) => {
    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:8080/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      console.log(res);

      if (res.ok) {
        const { token } = await res.json();

        localStorage.setItem("token", token);
        router.push("/");
      }
      if (res.status === 401) {
        form.setError("email", { message: "Invalid credentials." });
        form.setError("password", { message: "Invalid credentials." });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-3"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormInput
          name="email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          size={50}
        />
        <FormInput
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          size={50}
        />

        <Button variant="default" type="submit" className="mt-4 cursor-pointer">
          {isLoading ? <Spinner /> : "Log in"}
        </Button>
        <Button
          variant="ghost"
          className="border-thin border border-zinc-300 cursor-pointer"
          asChild
        >
          <Link href="/google">
            <Image src={google} alt="" className="w-8 h-8" />
            Sign In with Google
          </Link>
        </Button>
      </form>
    </Form>
  );
};

export default SignInForm;
