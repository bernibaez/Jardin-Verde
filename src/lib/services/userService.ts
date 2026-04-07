import { supabase } from '../supabaseClient';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
  created_at: string;
  last_sign_in_at?: string;
}

export const userService = {
  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as User[];
  },

  async updateUserRole(userId: string, role: 'admin' | 'customer'): Promise<User> {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as User;
  },

  async deleteUser(userId: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) throw error;
  },

  async getUserStats(): Promise<{
    totalUsers: number;
    adminUsers: number;
    customerUsers: number;
    newUsersThisMonth: number;
  }> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) throw error;
    
    const users = data as User[];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const newUsersThisMonth = users.filter(user => {
      const createdAt = new Date(user.created_at);
      return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
    }).length;

    return {
      totalUsers: users.length,
      adminUsers: users.filter(u => u.role === 'admin').length,
      customerUsers: users.filter(u => u.role === 'customer').length,
      newUsersThisMonth
    };
  }
};
