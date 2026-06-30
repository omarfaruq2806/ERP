import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';

// সব প্রোডাক্ট নিয়ে আসার ফাংশন
export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Product[];
}

// নতুন প্রোডাক্ট অ্যাড করার ফাংশন
export async function addProduct(product: Omit<Product, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

// প্রোডাক্ট আপডেট করার ফাংশন
export async function updateProduct(id: string, updates: Partial<Product>) {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Product;
}

// প্রোডাক্ট ডিলিট করার ফাংশন
export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) throw error;
}