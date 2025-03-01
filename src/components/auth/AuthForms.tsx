import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent } from "../ui/card";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthFormsProps {
  defaultTab?: "login" | "register";
  onLoginSubmit?: (data: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => void;
  onRegisterSubmit?: (data: {
    name: string;
    email: string;
    password: string;
  }) => void;
  onForgotPassword?: () => void;
  onSocialLogin?: (provider: string) => void;
}

const AuthForms = ({
  defaultTab = "login",
  onLoginSubmit = () => {},
  onRegisterSubmit = () => {},
  onForgotPassword = () => {},
  onSocialLogin = () => {},
}: AuthFormsProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">(defaultTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value as "login" | "register");
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <Card className="border-0 shadow-none">
        <Tabs
          defaultValue={defaultTab}
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <div className="px-6 pt-6">
            <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
              Welcome to ArtiSell
            </h1>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
          </div>

          <CardContent className="p-0">
            <TabsContent value="login" className="m-0">
              <LoginForm
                onSubmit={onLoginSubmit}
                onForgotPassword={onForgotPassword}
                onSocialLogin={onSocialLogin}
              />
            </TabsContent>

            <TabsContent value="register" className="m-0">
              <RegisterForm
                onSubmit={onRegisterSubmit}
                onLoginClick={() => setActiveTab("login")}
              />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default AuthForms;
