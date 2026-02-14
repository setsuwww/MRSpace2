import { useForm, Link } from "@inertiajs/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function Register() {
  const { data, setData, post, errors, processing } = useForm({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const submit = (e) => {
    e.preventDefault();
    post("/register");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-radial from-indigo-500/50 px-4">
      <Card className="w-full max-w-md bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-800">Register</CardTitle>
          <CardDescription className="text-gray-500">
            Create your account to get started.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label className="text-gray-700">Name</Label>
              <Input
                type="text"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="text-gray-700">Email</Label>
              <Input
                type="email"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label className="text-gray-700">Password</Label>
              <Input
                type="password"
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label className="text-gray-700">Confirm Password</Label>
              <Input
                type="password"
                value={data.password_confirmation}
                onChange={(e) =>
                  setData("password_confirmation", e.target.value)
                }
              />
              {errors.password_confirmation && (
                <p className="text-sm text-red-500">
                  {errors.password_confirmation}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={processing}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm transition-colors"
            >
              Register
            </Button>

            <p className="text-sm text-gray-500 text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-500 hover:text-indigo-600 underline">
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
