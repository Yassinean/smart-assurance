
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAPI } from '@/hooks/useAPI';
import { StatusBadge } from './StatusBadge';
import { formatDistance } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
  Card,
  CardContent,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { 
  Search, 
  FileText, 
  SlidersHorizontal, 
  Loader2,
  ArrowUpDown,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ApplicationStatus, ApplicationType } from '@/lib/types';

export function ApplicationList() {
  const api = useAPI();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ApplicationType | 'all'>('all');
  
  const { data: applicationsData, isLoading, isError } = useQuery({
    queryKey: ['applications'],
    queryFn: api.fetchApplications
  });

  const applications = applicationsData?.data || [];
  
  // Filter applications based on search and filters
  const filteredApplications = applications.filter(app => {
    const matchesSearch = searchQuery === '' || 
      app.policyNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesType = typeFilter === 'all' || app.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'health', label: 'Health' },
    { value: 'life', label: 'Life' },
    { value: 'auto', label: 'Auto' },
    { value: 'property', label: 'Property' },
    { value: 'travel', label: 'Travel' },
  ];
  
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'active', label: 'Active' },
    { value: 'expired', label: 'Expired' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Applications</h2>
        <p className="text-muted-foreground mt-1">
          View and manage assurance applications
        </p>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by policy number or customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-40">
                <Select 
                  value={typeFilter} 
                  onValueChange={(value) => setTypeFilter(value as ApplicationType | 'all')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-44">
                <Select 
                  value={statusFilter} 
                  onValueChange={(value) => setStatusFilter(value as ApplicationStatus | 'all')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-3 text-lg text-muted-foreground">Loading applications...</span>
            </div>
          ) : isError ? (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
              <h3 className="font-semibold text-lg">Failed to load applications</h3>
              <p className="text-muted-foreground mt-2">Please try again later</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <FileText className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
              {searchQuery || statusFilter !== 'all' || typeFilter !== 'all' ? (
                <>
                  <h3 className="font-semibold text-lg">No matching applications</h3>
                  <p className="text-muted-foreground mt-2">Try adjusting your search or filters</p>
                </>
              ) : (
                <>
                  <h3 className="font-semibold text-lg">No applications found</h3>
                  <p className="text-muted-foreground mt-2">Applications will appear here once added</p>
                </>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Policy Number</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((application) => (
                    <TableRow key={application.id} className="group">
                      <TableCell className="font-medium">
                        {application.policyNumber}
                      </TableCell>
                      <TableCell>{application.customerName}</TableCell>
                      <TableCell>
                        <span className="capitalize">{application.type}</span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={application.status} size="sm" />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDistance(new Date(application.updatedAt), new Date(), { addSuffix: true })}
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/applications/${application.id}`}
                          className="flex items-center justify-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <span>View</span>
                          <ExternalLink size={14} />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {filteredApplications.length > 0 && (
            <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
              <div>
                Showing <span className="font-medium">{filteredApplications.length}</span> of{' '}
                <span className="font-medium">{applications.length}</span> applications
              </div>
              
              <div className="flex items-center gap-1">
                <SlidersHorizontal size={14} />
                <span>Filters applied</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
