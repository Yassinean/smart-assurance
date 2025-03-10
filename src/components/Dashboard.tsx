
import { useQuery } from '@tanstack/react-query';
import { useAPI } from '@/hooks/useAPI';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Activity,
  AlertTriangle,
  FileText,
  CheckCircle,
  Clock,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ApplicationStatus } from '@/lib/types';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export function Dashboard() {
  const navigate = useNavigate();
  const api = useAPI();
  
  const { data: applicationsData, isLoading: isLoadingApps } = useQuery({
    queryKey: ['applications'],
    queryFn: api.fetchApplications
  });
  
  const { data: connectionsData, isLoading: isLoadingConnections } = useQuery({
    queryKey: ['connections'],
    queryFn: api.fetchConnections
  });
  
  const applications = applicationsData?.data || [];
  const connections = connectionsData?.data || [];
  
  const getStatusCount = (status: ApplicationStatus) => {
    return applications.filter(app => app.status === status).length;
  };
  
  const getTypeCount = (type: string) => {
    return applications.filter(app => app.type === type).length;
  };
  
  const countByStatus = [
    { name: 'Active', value: getStatusCount('active'), color: '#10B981' },
    { name: 'Pending', value: getStatusCount('pending'), color: '#3B82F6' },
    { name: 'Under Review', value: getStatusCount('under_review'), color: '#8B5CF6' },
    { name: 'Approved', value: getStatusCount('approved'), color: '#059669' },
    { name: 'Rejected', value: getStatusCount('rejected'), color: '#EF4444' },
    { name: 'Cancelled', value: getStatusCount('cancelled'), color: '#6B7280' },
    { name: 'Expired', value: getStatusCount('expired'), color: '#9CA3AF' },
  ].filter(item => item.value > 0);
  
  const countByType = [
    { name: 'Health', count: getTypeCount('health') },
    { name: 'Life', count: getTypeCount('life') },
    { name: 'Auto', count: getTypeCount('auto') },
    { name: 'Property', count: getTypeCount('property') },
    { name: 'Travel', count: getTypeCount('travel') },
  ];
  
  const activityData = [
    { month: 'Jan', applications: 12 },
    { month: 'Feb', applications: 19 },
    { month: 'Mar', applications: 15 },
    { month: 'Apr', applications: 25 },
    { month: 'May', applications: 31 },
    { month: 'Jun', applications: 28 },
    { month: 'Jul', applications: 21 },
  ];
  
  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-1">
          Overview of your assurance application system
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                <FileText className="h-6 w-6 text-blue-700 dark:text-blue-400" />
              </div>
              <BarChart3 className="h-4 w-4 text-blue-600/50 dark:text-blue-400/50" />
            </div>
            <h3 className="text-2xl font-semibold mt-4">{applications.length}</h3>
            <p className="text-sm text-muted-foreground">Total Applications</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-700 dark:text-green-400" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-600/50 dark:text-green-400/50" />
            </div>
            <h3 className="text-2xl font-semibold mt-4">{getStatusCount('active')}</h3>
            <p className="text-sm text-muted-foreground">Active Policies</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                <Clock className="h-6 w-6 text-purple-700 dark:text-purple-400" />
              </div>
              <Activity className="h-4 w-4 text-purple-600/50 dark:text-purple-400/50" />
            </div>
            <h3 className="text-2xl font-semibold mt-4">{getStatusCount('pending') + getStatusCount('under_review')}</h3>
            <p className="text-sm text-muted-foreground">Pending Review</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-amber-700 dark:text-amber-400" />
              </div>
              <Users className="h-4 w-4 text-amber-600/50 dark:text-amber-400/50" />
            </div>
            <h3 className="text-2xl font-semibold mt-4">{connections.filter(c => c.status === 'error').length}</h3>
            <p className="text-sm text-muted-foreground">API Connection Issues</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Application Activity</CardTitle>
            <CardDescription>Application submissions over time</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                      backdropFilter: 'blur(4px)',
                      borderRadius: '6px',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                    labelStyle={{ marginBottom: '5px', fontWeight: 'bold' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="applications" 
                    stroke="#2563eb" 
                    strokeWidth={2.5}
                    dot={{ stroke: '#2563eb', strokeWidth: 2, r: 4, fill: 'white' }}
                    activeDot={{ stroke: '#2563eb', strokeWidth: 2, r: 6, fill: 'white' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Application Status</CardTitle>
            <CardDescription>Distribution by current status</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoadingApps ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : countByStatus.length > 0 ? (
              <div className="h-[230px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={countByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {countByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                        backdropFilter: 'blur(4px)',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center p-8 text-center">
                <p className="text-muted-foreground">No application data available</p>
              </div>
            )}
            
            <div className="mt-2 space-y-1">
              {countByStatus.map((status) => (
                <div key={status.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                    <span>{status.name}</span>
                  </div>
                  <span className="font-medium">{status.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recent Applications</CardTitle>
            <CardDescription>Latest policy applications</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoadingApps ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : recentApplications.length > 0 ? (
              <div>
                {recentApplications.map((app, index) => (
                  <div 
                    key={app.id}
                    className={cn(
                      "flex items-center justify-between py-4 px-6 hover:bg-secondary/40 transition-colors",
                      index < recentApplications.length - 1 && "border-b"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{app.customerName}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{app.policyNumber}</span>
                          <span>•</span>
                          <span className="capitalize">{app.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={app.status} size="sm" />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full opacity-0 group-hover:opacity-100" 
                        onClick={() => navigate(`/applications/${app.id}`)}
                      >
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center p-8 text-center">
                <p className="text-muted-foreground">No recent applications</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="border">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">API Connections</CardTitle>
            <CardDescription>Current microservice connections</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoadingConnections ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : connections.length > 0 ? (
              <div>
                {connections.map((connection, index) => (
                  <div 
                    key={connection.id}
                    className={cn(
                      "flex items-center justify-between py-4 px-6 hover:bg-secondary/40 transition-colors",
                      index < connections.length - 1 && "border-b"
                    )}
                  >
                    <div>
                      <p className="font-medium">{connection.name}</p>
                      <p className="text-xs font-mono text-muted-foreground">{connection.url}</p>
                    </div>
                    <StatusBadge status={connection.status} size="sm" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center p-8 text-center">
                <p className="text-muted-foreground">No API connections</p>
              </div>
            )}
          </CardContent>
          <CardHeader className="pb-0 pt-3 px-6">
            <Button 
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => navigate('/connections')}
            >
              Manage Connections
            </Button>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
