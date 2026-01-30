import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { Form, FormControl,FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AuthPage() {
  const { login, register, isLoggingIn, isRegistering } = useAuth();

  const loginForm = useForm({
    defaultValues: { username: "", password: "" },
  });

  const registerForm = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: { username: "", password: "", email: "" },
  });

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <span className="text-6xl">⚡</span>
          <h1 className="text-4xl font-bold text-white tracking-tighter">
            PROCEED TO VERIFY
          </h1>
          <p className="text-gray-500 text-sm">Empower Your Digital Presence Easy & Fast</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#111] border border-orange-500/20">
            <TabsTrigger value="login" className="data-[state=active]:bg-orange-500 data-[state=active]:text-black">Verify</TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-orange-500 data-[state=active]:text-black">Join</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card className="bg-[#090909] border-orange-500/20">
              <CardHeader>
                <CardTitle className="text-orange-500">Welcome Back</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit((data: any) => login(data))} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-400">Username</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-black border-orange-500/10 focus:border-orange-500" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-400">Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} className="bg-black border-orange-500/10 focus:border-orange-500" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full bg-orange-500 text-black hover:bg-orange-600" disabled={isLoggingIn}>
                      {isLoggingIn ? "Verifying..." : "Proceed"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card className="bg-[#090909] border-orange-500/20">
              <CardHeader>
                <CardTitle className="text-orange-500">Create Account</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit((data: any) => register(data))} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-400">Username</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-black border-orange-500/10 focus:border-orange-500" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-400">Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} className="bg-black border-orange-500/10 focus:border-orange-500" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-400">Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} className="bg-black border-orange-500/10 focus:border-orange-500" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full bg-orange-500 text-black hover:bg-orange-600" disabled={isRegistering}>
                      {isRegistering ? "Joining..." : "Get Started"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
