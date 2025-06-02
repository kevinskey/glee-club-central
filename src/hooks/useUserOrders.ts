
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserOrder {
  id: string;
  user_id: string;
  item_ids: string[];
  total_price: number;
  status: 'pending' | 'paid' | 'fulfilled' | 'cancelled';
  shipping_address?: string;
  created_at: string;
}

interface CreateOrderData {
  item_ids: string[];
  total_price: number;
  shipping_address?: string;
}

export const useUserOrders = () => {
  const queryClient = useQueryClient();

  // Fetch user's orders
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['user-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as UserOrder[];
    },
  });

  // Create new order
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: CreateOrderData) => {
      const { data, error } = await supabase
        .from('user_orders')
        .insert([{
          user_id: (await supabase.auth.getUser()).data.user?.id,
          ...orderData
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
      toast.success('Order created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create order');
      console.error(error);
    }
  });

  // Update order status
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: UserOrder['status'] }) => {
      const { error } = await supabase
        .from('user_orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
      toast.success('Order status updated');
    },
    onError: (error) => {
      toast.error('Failed to update order status');
      console.error(error);
    }
  });

  return {
    orders,
    isLoading,
    error,
    createOrder: createOrderMutation.mutate,
    updateOrderStatus: updateOrderStatusMutation.mutate,
    isCreatingOrder: createOrderMutation.isPending,
    isUpdatingStatus: updateOrderStatusMutation.isPending
  };
};
