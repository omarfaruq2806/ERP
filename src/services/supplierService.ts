import { supabase } from '@/lib/supabase';
import type { Supplier } from '@/types';

export async function getSuppliers() {
  const { data, error } = await supabase
    .from('suppliers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Supplier[];
}

export async function addSupplier(supplier: Omit<Supplier, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('suppliers')
    .insert([supplier])
    .select()
    .single();

  if (error) throw error;
  return data as Supplier;
}