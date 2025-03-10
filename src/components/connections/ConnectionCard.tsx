
import { ApiConnection } from '@/lib/types';
import { format } from 'date-fns';
import { ServerCog, RefreshCw, CheckCircle2, ExternalLink } from 'lucide-react';
import { StatusBadge } from '../StatusBadge';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui';

interface ConnectionCardProps {
  connection: ApiConnection;
  onTest: (id: string) => void;
  isTestingConnection: boolean;
}

export function ConnectionCard({ connection, onTest, isTestingConnection }: ConnectionCardProps) {
  return (
    <Card className="overflow-hidden card-hover border">
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
          onClick={() => onTest(connection.id)}
          disabled={isTestingConnection}
        >
          {isTestingConnection ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : (
            <CheckCircle2 size={14} />
          )}
          <span>Test Connection</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
