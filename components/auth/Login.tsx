import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import Link from "next/link";
import Image from "next/image";

interface LoginProps {
  onClose: () => void;
}

export default function Login({ onClose }: LoginProps) {
  return (
    <div className="fixed w-full h-screen z-50">
      <div
        className="overlay absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <Card className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-md shadow-lg bg-white ">
        <CardHeader>
          <CardTitle className="text-2xl ">Login</CardTitle>
          <CardDescription>Masuk untuk melanjutkan</CardDescription>
        </CardHeader>
        <CardContent>
          <form action="" className="flex flex-col items-start gap-3">
            <Label>Email</Label>
            <Input
              placeholder="Email"
              className="bg-primary/5 border-black/20"
            />
            <Label className="mt-2">Password</Label>
            <Input
              placeholder="Password"
              type="password"
              className="bg-primary/5 border-black/20"
            />
            <Link
              href="/forgot-password"
              className="text-sm font-semibold text-primary"
            >
              Lupa password?
            </Link>
            <Button className="w-full mt-4 text-white font-semibold h-11">
              Masuk
            </Button>
            <Separator className="w-full my-2" />
            <div className="another w-full flex flex-col gap-6">
              <Button
                variant="outline"
                className="w-full h-12 font-semibold flex items-center gap-2 rounded-full text-sm border-black/30"
              >
                <Image
                  src="/logo/google.svg"
                  alt="Google Logo"
                  width={18}
                  height={18}
                />
                Masuk dengan Google
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 font-semibold flex items-center gap-2 rounded-full text-sm border-black/30"
              >
                <Image
                  src="/logo/facebook.svg"
                  alt="Facebook Logo"
                  width={18}
                  height={18}
                />
                Masuk dengan Facebook
              </Button>
            </div>
            <CardFooter className="mt-4 items-center flex w-full justify-center p-0">
              <span className="text-sm text-foreground/70 flex items-center gap-1">
                Belum punya akun?
                <Link href="/register" className="text-primary font-semibold">
                  Daftar
                </Link>
              </span>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
