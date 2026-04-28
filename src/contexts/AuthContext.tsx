import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile, Role } from '../types';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, role: Role, fullName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (data) {
      // Map DB column names to our Profile type
      const mapped: Profile = {
        id: data.id,
        email: data.email,
        full_name: data.full_name,
        avatar_url: data.avatar_url || '',
        role: data.role,
        phone: data.phone || '',
        college: data.college_name || '',
        college_id_verified: data.college_id_verified || false,
        is_verified: data.is_verified || false,
        is_online: data.is_active || false,
        last_seen: data.last_login_at || data.updated_at || new Date().toISOString(),
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
      setProfile(mapped);
    } else {
      setProfile(null);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, role: Role, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    if (data.user) {
      // Insert profile using actual DB column names
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        email,
        full_name: fullName,
        role,
        is_active: true,
      });
      if (profileError) {
        console.error('Profile insert error:', profileError);
      }

      if (role === 'freelancer') {
        const { data: existing } = await supabase
          .from('freelancer_profiles')
          .select('id')
          .eq('user_id', data.user.id)
          .maybeSingle();
        if (!existing) {
          await supabase.from('freelancer_profiles').insert({
            user_id: data.user.id,
            title: '',
            bio: '',
          });
        }
      } else if (role === 'client') {
        const { data: existing } = await supabase
          .from('client_profiles')
          .select('id')
          .eq('user_id', data.user.id)
          .maybeSingle();
        if (!existing) {
          await supabase.from('client_profiles').insert({
            user_id: data.user.id,
            company_name: '',
          });
        }
      }

      // Create wallet
      await supabase.from('wallets').insert({
        user_id: data.user.id,
      }).then(() => {}); // ignore error if already exists
    }
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'Not authenticated' };
    // Map our type field names back to DB column names
    const dbUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (updates.full_name !== undefined) dbUpdates.full_name = updates.full_name;
    if (updates.avatar_url !== undefined) dbUpdates.avatar_url = updates.avatar_url;
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
    if (updates.college !== undefined) dbUpdates.college_name = updates.college;
    if (updates.is_online !== undefined) dbUpdates.is_active = updates.is_online;
    if (updates.is_verified !== undefined) dbUpdates.is_verified = updates.is_verified;

    const { error } = await supabase
      .from('profiles')
      .update(dbUpdates)
      .eq('id', user.id);
    if (!error) {
      setProfile(prev => prev ? { ...prev, ...updates } : null);
    }
    return { error: error?.message ?? null };
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signUp, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
