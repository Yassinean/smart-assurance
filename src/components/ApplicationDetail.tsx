
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAPI } from '@/hooks/useAPI';
import { StatusBadge } from './StatusBadge';
import { format } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  Button,
  Separator,
  Badge,
} from '@/components/ui';
import { 
  ArrowLeft,
  FileText,
  Calendar,
  CreditCard,
  Shield,
  Clock,
  User,
  FileIcon,
  Download,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const api = useAPI();
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['application', id],
    queryFn: () => api.fetchApplicationById(id as string),
    enabled: !!id
  });
  
  const application = data?.data;
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 min-h-[50vh]">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Loading application details...</h3>
      </div>
    );
  }
  
  if (isError || !application) {
    return (
      <div className="flex flex-col items-center justify-center py-12 min-h-[50vh]">
        <div className="rounded-full bg-destructive/10 p-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <h3 className="text-lg font-medium mb-2">Failed to load application details</h3>
        <p className="text-muted-foreground mb-6">The application could not be found or is unavailable</p>
        <Button onClick={() => navigate('/applications')}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Applications
        </Button>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/applications')}
          className="rounded-full"
        >
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <span>Application Details</span>
            <StatusBadge status={application.status} className="ml-2" />
          </h2>
          <p className="text-muted-foreground">
            Policy Number: <span className="font-medium">{application.policyNumber}</span>
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Policy Information</CardTitle>
              <CardDescription>Core details about this insurance policy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1.5">
                      <User size={14} />
                      <span>Customer</span>
                    </h4>
                    <p className="text-base font-medium">{application.customerName}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1.5">
                      <FileText size={14} />
                      <span>Policy Type</span>
                    </h4>
                    <p className="text-base font-medium capitalize">{application.type} Insurance</p>
                  </div>
                  
                  {application.premium && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1.5">
                        <CreditCard size={14} />
                        <span>Premium</span>
                      </h4>
                      <p className="text-base font-medium">{formatCurrency(application.premium)}</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {application.coverageAmount && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1.5">
                        <Shield size={14} />
                        <span>Coverage Amount</span>
                      </h4>
                      <p className="text-base font-medium">{formatCurrency(application.coverageAmount)}</p>
                    </div>
                  )}
                  
                  {application.startDate && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>Start Date</span>
                      </h4>
                      <p className="text-base font-medium">
                        {format(new Date(application.startDate), 'MMMM d, yyyy')}
                      </p>
                    </div>
                  )}
                  
                  {application.endDate && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>End Date</span>
                      </h4>
                      <p className="text-base font-medium">
                        {format(new Date(application.endDate), 'MMMM d, yyyy')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Documents</CardTitle>
              <CardDescription>Policy-related documentation</CardDescription>
            </CardHeader>
            {application.documents && application.documents.length > 0 ? (
              <CardContent>
                <div className="space-y-3">
                  {application.documents.map((doc) => (
                    <div 
                      key={doc.id} 
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-secondary/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-md">
                          <FileIcon size={18} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(doc.uploadedAt), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Download size={14} className="mr-1" />
                        <span>Download</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            ) : (
              <CardContent>
                <div className="rounded-lg border border-dashed p-6 text-center">
                  <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
                  <h3 className="font-medium mb-1">No documents available</h3>
                  <p className="text-sm text-muted-foreground">
                    There are no documents attached to this policy
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Status Timeline</CardTitle>
              <CardDescription>History of policy changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative pl-6 pb-4 after:absolute after:top-0 after:left-2 after:h-full after:w-[1px] after:bg-border">
                  <div className="absolute left-0 top-0 rounded-full bg-primary p-1">
                    <div className="h-2 w-2 rounded-full bg-background" />
                  </div>
                  <div>
                    <h4 className="font-medium">Application Created</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(new Date(application.createdAt), 'MMMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
                
                <div className="relative pl-6 pb-4 after:absolute after:top-0 after:left-2 after:h-full after:w-[1px] after:bg-border">
                  <div className="absolute left-0 top-0 rounded-full bg-primary p-1">
                    <div className="h-2 w-2 rounded-full bg-background" />
                  </div>
                  <div>
                    <h4 className="font-medium">Application Updated</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(new Date(application.updatedAt), 'MMMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
                
                <div className="relative pl-6">
                  <div className="absolute left-0 top-0 rounded-full bg-primary p-1">
                    <div className="h-2 w-2 rounded-full bg-background" />
                  </div>
                  <div>
                    <h4 className="font-medium">Current Status</h4>
                    <div className="mt-1">
                      <StatusBadge status={application.status} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Actions</CardTitle>
              <CardDescription>Manage this policy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full justify-start">
                  <FileText size={16} className="mr-2" />
                  Print Policy Details
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download size={16} className="mr-2" />
                  Export as PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
