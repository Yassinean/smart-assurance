
import { useState } from 'react';
import { useConnections } from '@/hooks/useConnections';
import { ConnectionCard } from './connections/ConnectionCard';
import { AddConnectionDialog } from './connections/AddConnectionDialog';
import { Button } from '@/components/ui';
import { PlusCircle, ServerCog, XCircle } from 'lucide-react';

export function APIConnection() {
  const [isAddingConnection, setIsAddingConnection] = useState(false);
  const { 
    connections, 
    isLoading, 
    isError, 
    testConnection, 
    addConnection,
    isTestingConnection,
    isAddingConnection: isAdding
  } = useConnections();

  const handleAddConnection = (connection: { name: string; url: string }) => {
    addConnection(connection);
    setIsAddingConnection(false);
  };

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
            <div key={i} className="border animate-pulse bg-muted/20 h-[200px] rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
          <XCircle className="mx-auto h-10 w-10 text-destructive mb-3" />
          <h3 className="font-semibold text-lg">Failed to load connections</h3>
          <p className="text-muted-foreground mt-2">Please try again later or contact support</p>
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
          {connections.map((connection) => (
            <ConnectionCard
              key={connection.id}
              connection={connection}
              onTest={testConnection}
              isTestingConnection={isTestingConnection}
            />
          ))}
        </div>
      )}
      
      <AddConnectionDialog
        open={isAddingConnection}
        onOpenChange={setIsAddingConnection}
        onAdd={handleAddConnection}
        isAdding={isAdding}
      />
    </div>
  );
}
