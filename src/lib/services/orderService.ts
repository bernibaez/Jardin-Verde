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
        .select(`
          *,
          order_items (
            *,
            products (
              name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        throw new Error(`Error fetching orders: ${error.message}`);
      }
      
      // Transform data to match Order interface
      const transformedData = data.map(order => ({
        ...order,
        items: order.order_items.map((item: any) => ({
          ...item,
          name: item.products?.name || 'Producto eliminado'
        })),
        shipping_address: typeof order.shipping_address === 'string' 
          ? JSON.parse(order.shipping_address) 
          : order.shipping_address
      }));

      console.log('Orders fetched successfully:', transformedData.length, 'orders');
      return transformedData as Order[];
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
        .select(`
          *,
          order_items (
            *,
            products (
              name
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user orders:', error);
        throw new Error(`Error fetching user orders: ${error.message}`);
      }
      
      // Transform data to match Order interface
      const transformedData = data.map(order => ({
        ...order,
        items: order.order_items.map((item: any) => ({
          ...item,
          name: item.products?.name || 'Producto eliminado'
        })),
        shipping_address: typeof order.shipping_address === 'string' 
          ? JSON.parse(order.shipping_address) 
          : order.shipping_address
      }));

      console.log('User orders fetched successfully:', transformedData.length, 'orders');
      return transformedData as Order[];
    } catch (error) {
      console.error('Critical error in getUserOrders:', error);
      throw error;
    }
  },

  async createOrder(order: Omit<Order, 'id' | 'created_at'>) {
    try {
      console.log('Creating order with data:', order);
      
      // 1. Insert into orders table first
      const orderToInsert = {
        user_id: order.user_id,
        total: order.total,
        status: order.status,
        shipping_address: JSON.stringify(order.shipping_address)
      };

      const { data: createdOrder, error: orderError } = await supabase
        .from('orders')
        .insert([orderToInsert])
        .select()
        .single();

      if (orderError) {
        console.error('Error creating order in orders table:', orderError);
        throw new Error(`Error al crear la orden: ${orderError.message}`);
      }

      const orderId = createdOrder.id;
      console.log('Order created successfully with ID:', orderId);

      // 2. Insert into order_items table
      const orderItems = order.items.map(item => ({
        order_id: orderId,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        // We might want to delete the order here if items fail, but let's keep it simple
        throw new Error(`Error al registrar los productos de la orden: ${itemsError.message}`);
      }
      
      console.log('Order items created successfully');
      return { ...createdOrder, items: order.items } as Order;
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
        .select(`
          *,
          order_items (
            *,
            products (
              name
            )
          )
        `)
        .single();

      if (error) {
        console.error('Error updating order status:', error);
        throw new Error(`Error updating order status: ${error.message}`);
      }
      
      // Transform data to match Order interface
      const transformedOrder = {
        ...data,
        items: data.order_items.map((item: any) => ({
          ...item,
          name: item.products?.name || 'Producto eliminado'
        })),
        shipping_address: typeof data.shipping_address === 'string' 
          ? JSON.parse(data.shipping_address) 
          : data.shipping_address
      };

      console.log('Order status updated successfully:', transformedOrder);
      return transformedOrder as Order;
    } catch (error) {
      console.error('Critical error in updateOrderStatus:', error);
      throw error;
    }
  }
};
