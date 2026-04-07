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
      console.log('Fetching users from profiles table...');
      
      // Try the admin function first (most secure and efficient)
      try {
        const { data: adminFunctionData, error: adminFunctionError } = await supabase
          .rpc('get_all_users_for_admin');

        if (!adminFunctionError && adminFunctionData) {
          console.log('Successfully fetched users from admin function:', adminFunctionData.length);
          return adminFunctionData as User[];
        }
      } catch (functionError) {
        console.log('Admin function not available, trying admin view...');
      }

      // Try the admin view next
      try {
        const { data: adminViewData, error: adminViewError } = await supabase
          .from('admin_users_view')
          .select('*')
          .order('created_at', { ascending: false });

        if (!adminViewError && adminViewData) {
          console.log('Successfully fetched users from admin view:', adminViewData.length);
          return adminViewData as User[];
        }
      } catch (viewError) {
        console.log('Admin view not available, trying direct query...');
      }

      // Fallback: Direct query to profiles table
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching profiles:', error);
        throw error;
      }

      console.log('Fetched profiles:', profiles.length);

      // Get emails for each profile
      const usersWithEmails = await Promise.all(
        profiles.map(async (profile: any) => {
          try {
            // Try to get user email using admin API
            const { data: userData, error: userError } = await supabase.auth.admin.getUserById(profile.id);
            
            if (!userError && userData?.user?.email) {
              return {
                id: profile.id,
                name: profile.name,
                email: userData.user.email,
                role: profile.role,
                created_at: profile.created_at,
                updated_at: profile.updated_at
              } as User;
            } else {
              // Fallback: try to get from auth.users directly
              const { data: authData } = await supabase.auth.getUser(profile.id);
              return {
                id: profile.id,
                name: profile.name,
                email: authData.user?.email || 'N/A',
                role: profile.role,
                created_at: profile.created_at,
                updated_at: profile.updated_at
              } as User;
            }
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

      console.log('Final users with emails:', usersWithEmails.length);
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

      if (error) {
        console.error('Error updating user role:', error);
        throw error;
      }
      
      // Get the user email
      let email = 'N/A';
      try {
        const { data: userData } = await supabase.auth.admin.getUserById(userId);
        email = userData?.user?.email || 'N/A';
      } catch (emailError) {
        console.error('Error getting user email after role update:', emailError);
      }
      
      return {
        ...data,
        email
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

      if (profileError) {
        console.error('Error deleting profile:', profileError);
        throw profileError;
      }
      
      // Then try to delete the auth user (requires admin privileges)
      try {
        await supabase.auth.admin.deleteUser(userId);
        console.log('Successfully deleted auth user:', userId);
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

      if (error) {
        console.error('Error getting user stats:', error);
        return {
          totalUsers: 0,
          adminUsers: 0,
          regularUsers: 0,
          newUsersThisMonth: 0
        };
      }
      
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
