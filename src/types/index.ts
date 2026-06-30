export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string | null;
  category?: string | null;
  cost_price: number;
  selling_price: number;
  stock: number;         // stock_quantity এর বদলে stock
  min_stock: number;     // নতুন যোগ হলো
  created_at: string;
}
export interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  created_at: string;
}


export interface Purchase {
  id: string;
  supplier_id: string;
  product_id: string;
  quantity: number;
  unit_cost: number;
  total?: number; 
  purchase_date?: string;
  created_at?: string;
}

export interface Sale {
  id: string;
  invoice_no?: string | null;
  customer_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total: number; // total_price এর বদলে total
  sale_date?: string;
  created_at?: string;
}