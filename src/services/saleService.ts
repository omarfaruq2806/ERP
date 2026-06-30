import { supabase } from '@/lib/supabase';
import type { Sale } from '@/types';

// সব সেলস ডাটা নিয়ে আসার ফাংশন (কাস্টমার ও প্রোডাক্টের নাম সহ)
export async function getSales() {
  const { data, error } = await supabase
    .from('sales')
    .select(`
      *,
      products ( name ),
      customers ( name )
    `)
    .order('sale_date', { ascending: false });

  if (error) throw error;
  return data;
}

// নতুন সেল অ্যাড করা এবং স্টক কমানোর ম্যাজিক লজিক
// নতুন সেল অ্যাড করা এবং স্টক কমানোর ম্যাজিক লজিক
// নতুন সেল অ্যাড করা এবং স্টক কমানোর ম্যাজিক লজিক
export async function addSale(sale: any, currentStock: number) {
  
  // ডাটাবেস যেহেতু total নিজে হিসাব করবে, তাই আমরা total বাদ দিয়ে বাকি ডাটা আলাদা করছি
  const { total, ...saleDataToInsert } = sale;

  // 🌟 ম্যাজিক ট্রিক: একটি অটোমেটিক ইনভয়েস নম্বর তৈরি করে দিচ্ছি (যেমন: INV-1718902...)
  saleDataToInsert.invoice_no = `INV-${Date.now()}`;

  // ১. sales টেবিলে বিক্রির ডাটা সেভ করা 
  const { data: newSale, error: saleError } = await supabase
    .from('sales')
    .insert([saleDataToInsert])
    .select()
    .single();

  if (saleError) throw saleError;

  // ২. বিক্রির পর প্রোডাক্টের নতুন স্টক হিসাব করা
  const updatedStock = currentStock - sale.quantity;

  // ৩. products টেবিলে গিয়ে স্টক আপডেট করে দেওয়া
  const { error: stockError } = await supabase
    .from('products')
    .update({ stock: updatedStock }) 
    .eq('id', sale.product_id);

  if (stockError) {
    console.error("স্টক আপডেট করতে সমস্যা হয়েছে:", stockError);
    throw stockError;
  }

  return newSale;
}