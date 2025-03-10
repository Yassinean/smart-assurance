
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAPI } from '@/hooks/useAPI';
import { StatusBadge } from './StatusBadge';
import { ApiConnection } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { 
  Button, 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Input,
  Label,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { 
  ServerCog, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  PlusCircle,
  ExternalLink
} from 'lucide-react';

export function APIConnection() {
  const queryClient = useQueryClient();
  const api = useAPI();
  
  const [isAddingConnection, setIsAddingConnection] = useState(false);
  const [newConnection, setNewConnection] = useState({
    name: '',
    url: ''
  });
  
  const { data: connectionsData, isLoading, isError } = useQuery({
    queryKey: ['connections'],
    queryFn: api.fetchConnections
  });

  const testConnectionMutation = useMutation({
    mutationFn: api.testConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    }
  });
  
  const addConnectionMutation = useMutation({
    mutationFn: api.addConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      setIsAddingConnection(false);
      setNewConnection({ name: '', url: '' });
    }
  });

  const handleTestConnection = (connectionId: string) => {
    testConnectionMutation.mutate(connectionId);
  };
  
  const handleAddConnection = () => {
    if (!newConnection.name || !newConnection.url) return;
    
    addConnectionMutation.mutate({
      name: newConnection.name,
      url: newConnection.url
    });
  };

  const connections = connectionsData?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">API Connections</h2>
          <p className="text-muted-foreground mt-1">
            Manage your assurance microservice API connections
          </p>
        </div>
        <Button 
          onClick={() => setIsAddingConnection(true)} 
          className="flex items-center gap-2"
        >
          <PlusCircle size={16} />
          <span>Add Connection</span>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="border animate-pulse bg-muted/20">
              <CardHeader className="h-24" />
              <CardContent className="h-32" />
              <CardFooter className="h-16" />
            </Card>
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
          <XCircle className="mx-auto h-10 w-10 text-destructive mb-3" />
          <h3 className="font-semibold text-lg">Failed to load connections</h3>
          <p className="text-muted-foreground mt-2">Please try again later or contact support</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['connections'] })}
          >
            Retry
          </Button>
        </div>
      ) : connections.length === 0 ? (
        <div className="rounded-lg border bg-card p-8 text-center">
          <ServerCog className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
          <h3 className="font-semibold text-lg">No API connections</h3>
          <p className="text-muted-foreground mt-2">Add your first API connection to get started</p>
          <Button 
            className="mt-4"
            onClick={() => setIsAddingConnection(true)}
          >
            Add Connection
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connections.map((connection: ApiConnection) => (
            <Card key={connection.id} className="overflow-hidden card-hover border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ServerCog size={18} className="text-primary" />
                  {connection.name}
                </CardTitle>
                <CardDescription className="truncate text-xs flex items-center gap-1.5">
                  <span className="text-muted-foreground">URL:</span>
                  <span className="font-mono">{connection.url}</span>
                  <ExternalLink size={12} className="opacity-50" />
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <StatusBadge status={connection.status} size="sm" />
                  </div>
                  
                  {connection.lastConnected && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Last Connected</span>
                      <span className="text-sm">
                        {format(new Date(connection.lastConnected), 'MMM d, yyyy h:mm a')}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-3 flex gap-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full flex items-center gap-1.5"
                  onClick={() => handleTestConnection(connection.id)}
                  disabled={testConnectionMutation.isPending}
                >
                  {testConnectionMutation.isPending ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={14} />
                  )}
                  <span>Test Connection</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      <Dialog open={isAddingConnection} onOpenChange={setIsAddingConnection}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add API Connection</DialogTitle>
            <DialogDescription>
              Enter the details of your assurance microservice API.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Connection Name</Label>
              <Input
                id="name"
                value={newConnection.name}
                onChange={(e) => setNewConnection({ ...newConnection, name: e.target.value })}
                placeholder="Production API"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">API URL</Label>
              <Input
                id="url"
                value={newConnection.url}
                onChange={(e) => setNewConnection({ ...newConnection, url: e.target.value })}
                placeholder="https://api.example.com/v1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddingConnection(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddConnection}
              disabled={addConnectionMutation.isPending || !newConnection.name || !newConnection.url}
            >
              {addConnectionMutation.isPending ? (
                <>
                  <RefreshCw size={14} className="mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Connection'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
