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

  const mapSupabaseUserToAppUser = (sbUser: SupabaseUser | null): User | null => {
    if (!sbUser) return null;
    return {
      id: sbUser.id,
      name: sbUser.user_metadata.name || sbUser.email?.split('@')[0] || 'Usuario',
      email: sbUser.email || '',
      role: sbUser.user_metadata.role || 'user'
    };
  };

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      const sbUser = session?.user || null;
      setSupabaseUser(sbUser);
      setUser(mapSupabaseUserToAppUser(sbUser));
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const sbUser = session?.user || null;
      setSupabaseUser(sbUser);
      setUser(mapSupabaseUserToAppUser(sbUser));
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error.message);
      let message = 'Email o contraseña incorrectos';
      if (error.message.includes('Email not confirmed')) {
        message = 'Debes confirmar tu email antes de iniciar sesión';
      }
      return { success: false, error: message };
    }

    return { success: true };
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
