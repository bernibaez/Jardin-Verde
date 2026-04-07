import { supabase } from '../supabaseClient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export const userService = {
  async getUsers(): Promise<User[]> {
    try {
      // First get all profiles
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching profiles:', error);
        throw error;
      }

      // Then get emails for each user
      const usersWithEmails = await Promise.all(
        profiles.map(async (profile: any) => {
          try {
            // Try to get user email from auth.users
            const { data: userData, error: userError } = await supabase.auth.admin.getUserById(profile.id);
            
            return {
              id: profile.id,
              name: profile.name,
              email: userData?.user?.email || 'N/A',
              role: profile.role,
              created_at: profile.created_at,
              updated_at: profile.updated_at
            } as User;
          } catch (authError) {
            console.error(`Error getting email for user ${profile.id}:`, authError);
            return {
              id: profile.id,
              name: profile.name,
              email: 'N/A',
              role: profile.role,
              created_at: profile.created_at,
              updated_at: profile.updated_at
            } as User;
          }
        })
      );

      return usersWithEmails;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async updateUserRole(userId: string, role: 'admin' | 'user'): Promise<User> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      
      // Get the user email
      const { data: userData } = await supabase.auth.admin.getUserById(userId);
      
      return {
        ...data,
        email: userData?.user?.email || 'N/A'
      } as User;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },

  async deleteUser(userId: string): Promise<void> {
    try {
      // First delete the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) throw profileError;
      
      // Then try to delete the auth user (requires admin privileges)
      try {
        await supabase.auth.admin.deleteUser(userId);
      } catch (authError) {
        console.error('Error deleting auth user:', authError);
        // Continue even if auth deletion fails - profile is already deleted
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  async getUserStats(): Promise<{
    totalUsers: number;
    adminUsers: number;
    regularUsers: number;
    newUsersThisMonth: number;
  }> {
    try {
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
        regularUsers: users.filter(u => u.role === 'user').length,
        newUsersThisMonth
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        totalUsers: 0,
        adminUsers: 0,
        regularUsers: 0,
        newUsersThisMonth: 0
      };
    }
  }
};
