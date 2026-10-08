import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const getUser = cache(async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile && profile.status === 'active' ? profile : null;
});

export const requireUser = async () => {
  const profile = await getUser();
  if (!profile) redirect('/masuk');
  return profile;
};

export const requireAdmin = async (requiredPerm?: string) => {
  const profile = await requireUser();
  const isSuper = profile.role === 'super_admin';
  const isAdmin = profile.role === 'admin';

  if (!isSuper && !isAdmin) redirect('/');

  if (requiredPerm && !isSuper) {
    const perms = (profile.perms as Record<string, boolean>) || {};
    if (!perms[requiredPerm]) redirect('/admin?unauthorized=1');
  }

  return profile;
};
