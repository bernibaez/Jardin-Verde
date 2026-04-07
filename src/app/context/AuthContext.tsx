import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthResponse {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (name: string, email: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const mapSupabaseUserToAppUser = (sbUser: SupabaseUser | null, fallbackRole?: string): User | null => {
    if (!sbUser) return null;
    
    // Priority order: fallbackRole > user_metadata.role > default 'user'
    const role = (fallbackRole || sbUser.user_metadata.role || 'user') as 'user' | 'admin';
    
    console.log('Mapping user:', {
      id: sbUser.id,
      email: sbUser.email,
      metadataRole: sbUser.user_metadata.role,
      fallbackRole,
      finalRole: role
    });
    
    return {
      id: sbUser.id,
      name: sbUser.user_metadata.name || sbUser.email?.split('@')[0] || 'Usuario',
      email: sbUser.email || '',
      role
    };
  };

  // Emergency function to restore admin role from metadata
  const restoreAdminRole = async (userId: string): Promise<string> => {
    try {
      console.log('Attempting to restore admin role for user:', userId);
      const { data: { user } } = await supabase.auth.getUser(userId);
      
      if (user?.user_metadata?.role === 'admin') {
        console.log('Admin role found in metadata, restoring...');
        // Also update the profiles table to ensure consistency
        await supabase
          .from('profiles')
          .upsert({ 
            id: userId, 
            role: 'admin',
            updated_at: new Date().toISOString()
          }, { 
            onConflict: 'id' 
          });
        return 'admin';
      }
      
      return 'user';
    } catch (error) {
      console.error('Error restoring admin role:', error);
      return 'user';
    }
  };

  const fetchUserRole = async (userId: string): Promise<string> => {
    try {
      // First try to get role from user metadata (fastest)
      const { data: { user } } = await supabase.auth.getUser(userId);
      if (user?.user_metadata?.role) {
        return user.user_metadata.role;
      }

      // Then try to get from profiles table with longer timeout
      const timeoutPromise = new Promise<string>((_, reject) => {
        setTimeout(() => reject(new Error('Role fetch timeout')), 10000); // Increased timeout
      });

      const fetchPromise = supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      const { data: profile, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;
      
      if (error) {
        console.error('Error fetching user profile:', error);
        // Check if it's a "No rows found" error - user might not have profile yet
        if (error.code === 'PGRST116') {
          console.log('No profile found for user, using default role');
          return 'user';
        }
        return 'user';
      }
      
      return profile?.role || 'user';
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return 'user';
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      // Check active sessions and sets the user
      const { data: { session } } = await supabase.auth.getSession();
      const sbUser = session?.user || null;
      setSupabaseUser(sbUser);
      
      if (sbUser) {
        // Load user immediately with fallback role
        const initialUser = mapSupabaseUserToAppUser(sbUser);
        setUser(initialUser);
        setLoading(false); // Set loading to false immediately
        
        // Check if user should be admin based on metadata
        const metadataRole = sbUser.user_metadata?.role;
        
        if (metadataRole === 'admin') {
          console.log('Admin detected in metadata, ensuring role consistency');
          // Use emergency restore to ensure consistency
          const restoredRole = await restoreAdminRole(sbUser.id);
          if (restoredRole === 'admin' && initialUser?.role !== 'admin') {
            const updatedUser = mapSupabaseUserToAppUser(sbUser, restoredRole);
            setUser(updatedUser);
          }
        } else {
          // Then fetch the actual role from profiles table for non-admin users
          const actualRole = await fetchUserRole(sbUser.id);
          if (actualRole && initialUser?.role && actualRole !== initialUser.role) {
            // Update user with correct role if different
            const updatedUser = mapSupabaseUserToAppUser(sbUser, actualRole);
            setUser(updatedUser);
          }
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    };
    
    loadUser();

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const sbUser = session?.user || null;
      setSupabaseUser(sbUser);
      
      if (sbUser) {
        // Load user immediately with fallback role
        const initialUser = mapSupabaseUserToAppUser(sbUser);
        setUser(initialUser);
        
        // Check if user should be admin based on metadata
        const metadataRole = sbUser.user_metadata?.role;
        
        if (metadataRole === 'admin') {
          console.log('Admin detected in metadata during auth change');
          const restoredRole = await restoreAdminRole(sbUser.id);
          if (restoredRole === 'admin' && initialUser?.role !== 'admin') {
            const updatedUser = mapSupabaseUserToAppUser(sbUser, restoredRole);
            setUser(updatedUser);
          }
        } else {
          // Then fetch the actual role from profiles table
          const actualRole = await fetchUserRole(sbUser.id);
          if (actualRole && initialUser?.role && actualRole !== initialUser.role) {
            // Update user with correct role if different
            const updatedUser = mapSupabaseUserToAppUser(sbUser, actualRole);
            setUser(updatedUser);
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Login timeout')), 10000);
      });

      const loginPromise = supabase.auth.signInWithPassword({
        email,
        password,
      });

      const { data, error } = await Promise.race([loginPromise, timeoutPromise]) as any;

      if (error) {
        console.error('Login error:', error.message);
        let message = 'Email o contraseña incorrectos';
        if (error.message.includes('Email not confirmed')) {
          message = 'Debes confirmar tu email antes de iniciar sesión';
        } else if (error.message.includes('Invalid login credentials')) {
          message = 'Email o contraseña incorrectos';
        } else if (error.message.includes('Too many requests')) {
          message = 'Demasiados intentos. Por favor espera unos minutos';
        }
        return { success: false, error: message };
      }

      // Verify the session was actually created
      if (!data?.session) {
        return { success: false, error: 'No se pudo crear la sesión. Intenta de nuevo.' };
      }

      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      if (err instanceof Error && err.message === 'Login timeout') {
        return { success: false, error: 'La conexión está tardando demasiado. Verifica tu internet e intenta de nuevo.' };
      }
      return { success: false, error: 'Ocurrió un error inesperado. Por favor intenta de nuevo.' };
    }
  };

  const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: 'user', // Default role
        },
      },
    });

    if (error) {
      console.error('Registration error:', error.message);
      return { success: false, error: error.message };
    }

    // Supabase can return success but with session null if confirmation is required
    if (data.user && !data.session) {
      return { success: true, error: 'Confirma tu email para completar el registro' };
    }

    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSupabaseUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
