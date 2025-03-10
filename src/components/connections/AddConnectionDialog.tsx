
import { useState } from 'react';
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
} from '@/components/ui';
import { RefreshCw } from 'lucide-react';

interface AddConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (connection: { name: string; url: string }) => void;
  isAdding: boolean;
}

export function AddConnectionDialog({ open, onOpenChange, onAdd, isAdding }: AddConnectionDialogProps) {
  const [newConnection, setNewConnection] = useState({
    name: '',
    url: ''
  });

  const handleAdd = () => {
    if (!newConnection.name || !newConnection.url) return;
    onAdd(newConnection);
    setNewConnection({ name: '', url: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAdd}
            disabled={isAdding || !newConnection.name || !newConnection.url}
          >
            {isAdding ? (
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
  );
}
