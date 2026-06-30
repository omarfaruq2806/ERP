import { useEffect, useState } from "react";
import { getSales, addSale } from "@/services/saleService";
import { getProducts } from "@/services/productService";
import { getCustomers } from "@/services/customerService";
import type { Product, Customer } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export function Sales() {
  const [sales, setSales] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    product_id: "",
    customer_id: "",
    quantity: 1,
    unit_price: 0, // ডাটাবেসের সাথে মেলানোর জন্য যোগ করা হলো
    total: 0,      // total_price পরিবর্তন করে total করা হলো
  });
  
  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    try {
      const [salesData, productsData, customersData] = await Promise.all([
        getSales(),
        getProducts(),
        getCustomers()
      ]);
      setSales(salesData);
      setProducts(productsData);
      setCustomers(customersData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  // প্রোডাক্ট সিলেক্ট করলে অটোমেটিক দাম ক্যালকুলেট করার লজিক
  function handleProductChange(productId: string) {
    const selectedProduct = products.find(p => p.id === productId);
    if (selectedProduct) {
      setFormData({
        ...formData,
        product_id: productId,
        unit_price: selectedProduct.selling_price, // unit_price সেট করা হলো
        total: selectedProduct.selling_price * formData.quantity // total আপডেট করা হলো
      });
    }
  }

  function handleQuantityChange(qty: number) {
    const price = formData.unit_price; // স্টেটের unit_price ব্যবহার করা হলো
    setFormData({
      ...formData,
      quantity: qty,
      total: price * qty // total আপডেট করা হলো
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // স্টক চেক করা
      const selectedProduct = products.find(p => p.id === formData.product_id);
      if (!selectedProduct) throw new Error("Product not found");
      
      if (selectedProduct.stock < formData.quantity) {
        alert(`Sorry! Only ${selectedProduct.stock} items available in stock.`);
        setIsSubmitting(false);
        return;
      }

      await addSale(formData, selectedProduct.stock);
      await loadAllData(); // ডাটা রিলোড করা
      setIsOpen(false);
      // ফর্ম রিসেট করার সময় সঠিক নাম ব্যবহার করা হলো
      setFormData({ product_id: "", customer_id: "", quantity: 1, unit_price: 0, total: 0 });
    } catch (error) {
      console.error("Error adding sale:", error);
      alert("Failed to add sale. Check console.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sales (বিক্রি)</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> New Sale</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md p-4 bg-white border-white ">
            <DialogHeader><DialogTitle>Create New Sale</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="space-y-2">
                <Label>Select Customer</Label>
                <select 
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  value={formData.customer_id}
                  onChange={(e) => setFormData({...formData, customer_id: e.target.value})}
                >
                  <option  value="" disabled>-- Select Customer --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id} >{c.name} - {c.phone}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Select Product</Label>
                <select 
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  value={formData.product_id}
                  onChange={(e) => handleProductChange(e.target.value)}
                >
                  <option value="" disabled>-- Select Product --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Stock: {p.stock}) - ৳{p.selling_price}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input 
                    type="number" min="1" required 
                    value={formData.quantity}
                    onChange={(e) => handleQuantityChange(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total Price (৳)</Label>
                  {/* value তে formData.total দেওয়া হলো */}
                  <Input 
                    type="number" readOnly 
                    value={formData.total}
                    className="bg-gray-50"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Complete Sale"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-md border p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Total (৳)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center">Loading...</TableCell></TableRow>
            ) : sales.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-gray-500">No sales found.</TableCell></TableRow>
            ) : sales.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.sale_date ? new Date(s.sale_date).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell>{s.customers?.name}</TableCell>
                <TableCell>{s.products?.name}</TableCell>
                <TableCell>{s.quantity}</TableCell>
                {/* s.total_price পরিবর্তন করে s.total করা হলো */}
                <TableCell className="font-bold">৳ {s.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}