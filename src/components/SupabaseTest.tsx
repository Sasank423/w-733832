
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const SupabaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState<'loading' | 'connected' | 'error'>('loading');

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // A simple query to check if we can connect to Supabase
        const { data, error } = await supabase.from('_dummy_query').select('*').limit(1);
        
        if (error && error.code === '42P01') {
          // Error code 42P01 means relation does not exist, which is expected
          // since we're querying a non-existent table. This confirms we can connect.
          setConnectionStatus('connected');
        } else if (error) {
          console.error('Supabase connection error:', error);
          setConnectionStatus('error');
        } else {
          setConnectionStatus('connected');
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setConnectionStatus('error');
      }
    };

    checkConnection();
  }, []);

  const handleCreateTable = async () => {
    try {
      toast({
        title: "Note",
        description: "In a real app, you would create tables using migrations in Supabase directly, not from the client side.",
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Supabase Connection Test</h2>
      <div className="mb-4">
        <p>Connection Status: {' '}
          {connectionStatus === 'loading' && 'Testing connection...'}
          {connectionStatus === 'connected' && '✅ Connected successfully'}
          {connectionStatus === 'error' && '❌ Connection failed'}
        </p>
      </div>
      <div className="space-y-2">
        <Button onClick={handleCreateTable}>
          Next Steps
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          To start building with Supabase, set up your database tables from the Supabase dashboard.
        </p>
      </div>
    </div>
  );
};

export default SupabaseTest;
