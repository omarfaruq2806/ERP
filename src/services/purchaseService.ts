import { supabase } from '@/lib/supabase';
import type { Purchase } from '@/types';

// সব কেনাকাটার ডাটা নিয়ে আসার ফাংশন
export async function getPurchases() {
  const { data, error } = await supabase
    .from('purchases')
    .select(`
      *,
      products ( name ),
      suppliers ( name )
    `)
    .order('purchase_date', { ascending: false });

  if (error) throw error;
  return data;
}

// নতুন প্রোডাক্ট কেনা এবং স্টক বাড়ানোর ম্যাজিক লজিক
export async function addPurchase(purchase: any, currentStock: number) {
  
  // total কলামটি ডাটাবেস নিজে হিসাব করবে, তাই আমরা সেটি বাদ দিচ্ছি
  const { total, ...purchaseDataToInsert } = purchase;

  // ১. purchases টেবিলে কেনার ডাটা সেভ করা
  const { data: newPurchase, error: purchaseError } = await supabase
    .from('purchases')
    .insert([purchaseDataToInsert])
    .select()
    .single();

  if (purchaseError) throw purchaseError;

  // ২. কেনার পর প্রোডাক্টের নতুন স্টক হিসাব করা (এখানে স্টক বাড়বে +)
  // Number() ব্যবহার করছি যাতে টেক্সট হিসেবে পাশাপাশি বসে না যায় (যেমন ১০+৫=১০৫ না হয়ে ১৫ হয়)
  const updatedStock = Number(currentStock) + Number(purchase.quantity);

  // ৩. products টেবিলে গিয়ে স্টক আপডেট করে দেওয়া
  const { error: stockError } = await supabase
    .from('products')
    .update({ stock: updatedStock }) 
    .eq('id', purchase.product_id);

  if (stockError) {
    console.error("স্টক আপডেট করতে সমস্যা হয়েছে:", stockError);
    throw stockError;
  }

  return newPurchase;
}