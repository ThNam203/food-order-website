"use client";

import { TextButton } from "@/components/buttons";
import { LoadingIcon } from "@/components/icons";
import { Input } from "@/components/input";
import { Separate } from "@/components/separate";
import { showErrorToast, showSuccessToast } from "@/components/toast";
import Background from "@/public/images/bg-login-page.jpg";
import { useAppDispatch } from "@/redux/hooks";
import { setProfile } from "@/redux/slices/profile";
import AuthService from "@/services/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { setCookie } from "cookies-next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ZodType, z } from "zod";
import Logo from "@/public/images/logo.png";
import style from "@/styles/sidebar.module.css";
import { cn } from "@/utils/cn";
export type LoginFormData = {
  email: string;
  password: string;
};

const loginSchema: ZodType<LoginFormData> = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const handleFormSubmit = async (data: LoginFormData) => {
    setIsLoggingIn(true);
    await AuthService.login(data)
      .then((res) => {
        dispatch(setProfile(res.data));
        showSuccessToast("Login Successfully");
        if (data.email === "admin@gmail.com") router.push("/dashboard");
        else router.push("/intro");
      })
      .catch((err) => {
        showErrorToast("Wrong email or password");
        console.log(err);
      })
      .finally(() => {
        setIsLoggingIn(false);
      });
  };
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="w-screen h-screen font-sans bg-transparent flex flex-row items-center justify-center text-primaryWord">
        <div className="xl:w-11/12 max-xl:w-full flex flex-row items-center justify-center gap-10">
          <Image
            width={940}
            height={560}
            src={Background}
            alt="hamburger"
            className="h-[35vw] max-xl:hidden rounded-md"
          />
          <div className="xl:w-1/3 max-xl:w-1/2 max-md:w-5/6 h-[560px] flex flex-col items-center justify-start pt-8 gap-4">
            <div className="font-extrabold text-xl select-none flex items-center gap-2">
              <Image src={Logo} alt="logo" width={40} height={40} />
              <span className={cn("text-nowrap text-primary")}>Fresh Mart</span>
            </div>
            <div className="w-2/3 flex flex-row items-center justify-between gap-4">
              <Separate classname="h-[2px]" />
              <span className="text-nowrap text-sm text-secondaryWord">
                Sign In
              </span>
              <Separate classname="h-[2px]" />
            </div>
            <div className="flex flex-col w-full gap-6 mt-4">
              <Input
                id="email"
                label="Email"
                errorMessages={errors.email ? errors.email.message : ""}
                placeholder="demo@example.com"
                {...register("email")}
              />
              <Input
                id="password"
                label="Password"
                type="password"
                errorMessages={errors.password ? errors.password.message : ""}
                {...register("password")}
              />
            </div>
            <TextButton
              type="submit"
              iconBefore={isLoggingIn ? <LoadingIcon /> : null}
              disabled={isLoggingIn}
              className="w-full mt-6 text-sm font-extrabold text-white bg-primary hover:bg-primary/80"
            >
              {isLoggingIn ? "" : "Sign Me In"}
            </TextButton>

            <span className="text-sm text-secondaryWord">
              Don&#39;t have an account
              <span
                onClick={() => router.push("/register")}
                className="text-primary cursor-pointer"
              >
                {" "}
                Sign up
              </span>
            </span>
          </div>
        </div>
      </div>
    </form>
  );
}
