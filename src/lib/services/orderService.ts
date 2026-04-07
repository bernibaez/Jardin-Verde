import { supabase } from '../supabaseClient';

export interface Order {
  id: string;
  user_id: string;
  items: any[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  shipping_address: {
    address: string;
    city: string;
    zip: string;
  };
}

export const orderService = {
  async getOrders() {
    try {
      console.log('Fetching all orders...');
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        throw new Error(`Error fetching orders: ${error.message}`);
      }
      
      console.log('Orders fetched successfully:', data?.length || 0, 'orders');
      return data as Order[];
    } catch (error) {
      console.error('Critical error in getOrders:', error);
      throw error;
    }
  },

  async getUserOrders(userId: string) {
    try {
      console.log('Fetching orders for user:', userId);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user orders:', error);
        throw new Error(`Error fetching user orders: ${error.message}`);
      }
      
      console.log('User orders fetched successfully:', data?.length || 0, 'orders');
      return data as Order[];
    } catch (error) {
      console.error('Critical error in getUserOrders:', error);
      throw error;
    }
  },

  async createOrder(order: Omit<Order, 'id' | 'created_at'>) {
    try {
      console.log('Creating order with data:', order);
      
      const { data, error } = await supabase
        .from('orders')
        .insert([order])
        .select()
        .single();

      if (error) {
        console.error('Error creating order:', error);
        
        // Specific error handling
        if (error.code === '23505') {
          throw new Error('Duplicate order entry');
        } else if (error.code === '23503') {
          throw new Error('Foreign key violation - invalid user');
        } else if (error.code === '42501') {
          throw new Error('Permission denied - check RLS policies');
        } else {
          throw new Error(`Error creating order: ${error.message}`);
        }
      }
      
      console.log('Order created successfully:', data);
      return data as Order;
    } catch (error) {
      console.error('Critical error in createOrder:', error);
      throw error;
    }
  },

  async updateOrderStatus(id: string, status: Order['status']) {
    try {
      console.log('Updating order status:', { id, status });
      
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating order status:', error);
        throw new Error(`Error updating order status: ${error.message}`);
      }
      
      console.log('Order status updated successfully:', data);
      return data as Order;
    } catch (error) {
      console.error('Critical error in updateOrderStatus:', error);
      throw error;
    }
  }
};
