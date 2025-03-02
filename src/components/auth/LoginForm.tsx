import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Facebook, Github, Mail } from "lucide-react";

interface LoginFormProps {
  onSubmit?: (data: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => void;
  onForgotPassword?: () => void;
  onSocialLogin?: (provider: string) => void;
}

const LoginForm = ({
  onSubmit = () => {},
  onForgotPassword = () => {},
  onSocialLogin = () => {},
}: LoginFormProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // You can replace this with useAuth() hook in a real implementation
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Call the onSubmit prop with the form data
      onSubmit({ email, password, rememberMe });
    } catch (error: any) {
      console.error("Error logging in:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Invalid email or password",
        duration: 5000,
      });
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Login to ArtiSell
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
            />
            <Label htmlFor="remember" className="text-sm cursor-pointer">
              Remember me
            </Label>
          </div>

          <Button
            type="button"
            variant="link"
            className="text-sm text-blue-600 hover:text-blue-800"
            onClick={onForgotPassword}
          >
            Forgot password?
          </Button>
        </div>

        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSocialLogin("facebook")}
            className="flex items-center justify-center"
          >
            <Facebook className="h-5 w-5 text-blue-600" />
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => onSocialLogin("github")}
            className="flex items-center justify-center"
          >
            <Github className="h-5 w-5" />
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => onSocialLogin("google")}
            className="flex items-center justify-center"
          >
            <Mail className="h-5 w-5 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
