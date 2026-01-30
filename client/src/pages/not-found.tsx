import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md bg-white/5 border-white/10 text-white backdrop-blur-md">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2 text-destructive">
            <AlertCircle className="h-8 w-8" />
            <h1 className="text-2xl font-bold font-display">404 Page Not Found</h1>
          </div>
          <p className="mt-4 text-muted-foreground">
            The link you entered into the void does not exist.
          </p>
          <div className="mt-8 flex justify-end">
            <Link href="/">
              <Button variant="outline" className="border-white/20 hover:bg-white/10 text-white">
                Return Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
