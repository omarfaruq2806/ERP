import { supabase } from '@/lib/supabase';
import type { Customer } from '@/types';

// সব কাস্টমার নিয়ে আসার ফাংশন
export async function getCustomers() {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Customer[];
}

// নতুন কাস্টমার অ্যাড করার ফাংশন
export async function addCustomer(customer: Omit<Customer, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('customers')
    .insert([customer])
    .select()
    .single();

  if (error) throw error;
  return data as Customer;
}