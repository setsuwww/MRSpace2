import { useForm, Link } from "@inertiajs/react"

import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Checkbox } from "@/Components/ui/checkbox"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/Components/ui/card"

export default function Login() {
  const { data, setData, post, errors, processing } = useForm({
    email: "",
    password: "",
    remember: false,
  })

  const submit = (e) => {
    e.preventDefault()
    post("/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-radial from-indigo-500/50 px-4">
      <Card className="w-full max-w-md bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-800">Login</CardTitle>
          <CardDescription className="text-gray-500">
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label>Email</Label>
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
              <Label>Password</Label>
              <Input
                type="password"
                value={data.password}
                onChange={(e) => setData("password", e.target.value)}
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={data.remember}
                onCheckedChange={(checked) => setData("remember", checked)}
              />
              <Label htmlFor="remember" className="select-none text-gray-700">
                Remember me
              </Label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={processing}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
            >
              Login
            </Button>

            <p className="text-sm text-gray-500 text-center">
              Don't have an account?{" "}
              <Link href="/register" className="text-indigo-500 hover:text-indigo-600">
                Register
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
