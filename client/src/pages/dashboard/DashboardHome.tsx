import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/hooks/use-auth";
import { useMyProfile } from "@/hooks/use-profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, MousePointerClick, TrendingUp } from "lucide-react";
import { PhonePreview } from "@/components/PhonePreview";

// Mock data for charts since we don't have historical data in schema yet
const chartData = [
  { name: "Mon", clicks: 40, views: 240 },
  { name: "Tue", clicks: 30, views: 139 },
  { name: "Wed", clicks: 20, views: 980 },
  { name: "Thu", clicks: 27, views: 390 },
  { name: "Fri", clicks: 18, views: 480 },
  { name: "Sat", clicks: 23, views: 380 },
  { name: "Sun", clicks: 34, views: 430 },
];

export default function DashboardHome() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useMyProfile();

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stats */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-bold font-display mb-2">Welcome back, {user?.username}</h1>
            <p className="text-muted-foreground">Here's what's happening with your link today.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard 
              title="Total Views" 
              value={profile?.views || 0} 
              icon={<Users className="w-4 h-4 text-blue-500" />} 
              loading={isLoading}
            />
            <StatCard 
              title="Total Clicks" 
              value={profile?.links?.reduce((acc, curr) => acc + (curr.clicks || 0), 0) || 0} 
              icon={<MousePointerClick className="w-4 h-4 text-green-500" />} 
              loading={isLoading}
            />
            <StatCard 
              title="Click Rate" 
              value={`${profile?.views ? Math.round((profile.links?.reduce((acc, curr) => acc + (curr.clicks || 0), 0) || 0) / profile.views * 100) : 0}%`}
              icon={<TrendingUp className="w-4 h-4 text-primary" />} 
              loading={isLoading}
            />
          </div>

          <Card className="border-border bg-card/50">
            <CardHeader>
              <CardTitle>Activity Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke="#525252" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#525252" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#171717", border: "1px solid #262626", borderRadius: "8px" }}
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    />
                    <Bar dataKey="views" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="clicks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Preview */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24">
             <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center">LIVE PREVIEW</h3>
             {isLoading ? (
               <div className="w-[320px] h-[640px] bg-secondary/20 rounded-[3rem] animate-pulse mx-auto" />
             ) : (
               <PhonePreview profile={profile || null} />
             )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

function StatCard({ title, value, icon, loading }: { title: string, value: string | number, icon: any, loading: boolean }) {
  return (
    <Card className="border-border bg-card/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon}
        </div>
        <div className="text-2xl font-bold font-mono">
          {loading ? <Skeleton className="h-8 w-16" /> : value}
        </div>
      </CardContent>
    </Card>
  );
}
