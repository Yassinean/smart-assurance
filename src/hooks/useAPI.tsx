
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { ApiResponse, AssuranceApplication, ApiConnection } from '@/lib/types';

// Mock data for demonstration purposes
const MOCK_CONNECTIONS: ApiConnection[] = [
  {
    id: '1',
    name: 'Production API',
    url: 'https://api.assurance-service.com/v1',
    status: 'connected',
    lastConnected: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Staging API',
    url: 'https://staging-api.assurance-service.com/v1',
    status: 'connected',
    lastConnected: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Development API',
    url: 'https://dev-api.assurance-service.com/v1',
    status: 'disconnected',
    lastConnected: new Date(Date.now() - 86400000).toISOString(),
  },
];

const MOCK_APPLICATIONS: AssuranceApplication[] = [
  {
    id: '1',
    policyNumber: 'HL-2023-0001',
    customerName: 'John Doe',
    type: 'health',
    status: 'active',
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    premium: 350.50,
    coverageAmount: 500000,
    startDate: new Date(Date.now() - 30 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 335 * 86400000).toISOString(),
  },
  {
    id: '2',
    policyNumber: 'LF-2023-0425',
    customerName: 'Jane Smith',
    type: 'life',
    status: 'pending',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    premium: 125.75,
    coverageAmount: 250000,
  },
  {
    id: '3',
    policyNumber: 'AT-2023-0892',
    customerName: 'Robert Johnson',
    type: 'auto',
    status: 'under_review',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    premium: 780.25,
    coverageAmount: 30000,
  },
  {
    id: '4',
    policyNumber: 'PR-2023-1204',
    customerName: 'Emily Clark',
    type: 'property',
    status: 'approved',
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    premium: 950.00,
    coverageAmount: 750000,
  },
  {
    id: '5',
    policyNumber: 'TR-2023-0537',
    customerName: 'Michael Wong',
    type: 'travel',
    status: 'active',
    createdAt: new Date(Date.now() - 22 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    premium: 85.99,
    coverageAmount: 50000,
    startDate: new Date(Date.now() - 20 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 10 * 86400000).toISOString(),
  },
];

export function useAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConnections = useCallback(async (): Promise<ApiResponse<ApiConnection[]>> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return { data: MOCK_CONNECTIONS };
    } catch (err) {
      const errorMessage = 'Failed to fetch API connections';
      setError(errorMessage);
      toast.error(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const testConnection = useCallback(async (connectionId: string): Promise<ApiResponse<{ success: boolean }>> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const success = Math.random() > 0.2; // 80% success rate
      
      if (success) {
        toast.success('Connection test successful');
        return { data: { success: true } };
      } else {
        throw new Error('Connection test failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to test connection';
      setError(errorMessage);
      toast.error(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchApplications = useCallback(async (): Promise<ApiResponse<AssuranceApplication[]>> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { 
        data: MOCK_APPLICATIONS,
        meta: {
          total: MOCK_APPLICATIONS.length,
          page: 1,
          limit: 10
        }
      };
    } catch (err) {
      const errorMessage = 'Failed to fetch applications';
      setError(errorMessage);
      toast.error(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchApplicationById = useCallback(async (id: string): Promise<ApiResponse<AssuranceApplication>> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const application = MOCK_APPLICATIONS.find(app => app.id === id);
      
      if (!application) {
        throw new Error('Application not found');
      }
      
      return { data: application };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch application details';
      setError(errorMessage);
      toast.error(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const addConnection = useCallback(async (connection: Omit<ApiConnection, 'id' | 'status' | 'lastConnected'>): Promise<ApiResponse<ApiConnection>> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newConnection: ApiConnection = {
        id: `${Date.now()}`,
        status: 'connected',
        lastConnected: new Date().toISOString(),
        ...connection
      };
      
      toast.success('API connection added successfully');
      return { data: newConnection };
    } catch (err) {
      const errorMessage = 'Failed to add connection';
      setError(errorMessage);
      toast.error(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchConnections,
    testConnection,
    fetchApplications,
    fetchApplicationById,
    addConnection,
  };
}
