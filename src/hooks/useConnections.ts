
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAPI } from '@/hooks/useAPI';
import { ApiConnection } from '@/lib/types';

export function useConnections() {
  const queryClient = useQueryClient();
  const api = useAPI();
  
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
    }
  });
  
  return {
    connections: connectionsData?.data || [],
    isLoading,
    isError,
    testConnection: testConnectionMutation.mutate,
    addConnection: addConnectionMutation.mutate,
    isTestingConnection: testConnectionMutation.isPending,
    isAddingConnection: addConnectionMutation.isPending,
  };
}
