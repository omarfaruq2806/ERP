import { useEffect, useState } from "react";
import { getPurchases, addPurchase } from "@/services/purchaseService";
import { getProducts } from "@/services/productService";
import { getSuppliers } from "@/services/supplierService";
import type { Product, Supplier } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export function Purchases() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    product_id: "",
    supplier_id: "",
    quantity: 1,
    unit_cost: 0, // ডাটাবেসের সাথে মেলানো
    total: 0,
  });

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    try {
      const [purchasesData, productsData, suppliersData] = await Promise.all([
        getPurchases(),
        getProducts(),
        getSuppliers()
      ]);
      setPurchases(purchasesData);
      setProducts(productsData);
      setSuppliers(suppliersData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleProductChange(productId: string) {
    const selectedProduct = products.find(p => p.id === productId);
    if (selectedProduct) {
      setFormData({
        ...formData,
        product_id: productId,
        unit_cost: selectedProduct.cost_price, // cost_price ব্যবহার করছি
        total: selectedProduct.cost_price * formData.quantity
      });
    }
  }

  function handleQuantityChange(qty: number) {
    const cost = formData.unit_cost;
    setFormData({
      ...formData,
      quantity: qty,
      total: cost * qty
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const selectedProduct = products.find(p => p.id === formData.product_id);
      if (!selectedProduct) throw new Error("Product not found");

      // addPurchase ফাংশন কল করা
      await addPurchase(formData, selectedProduct.stock);
      await loadAllData(); 
      setIsOpen(false);
      setFormData({ product_id: "", supplier_id: "", quantity: 1, unit_cost: 0, total: 0 });
    } catch (error) {
      console.error("Error adding purchase:", error);
      alert("Failed to add purchase. Check console.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Purchases (কেনাকাটা)</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> New Purchase</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md p-4 bg-white border-white ">
            <DialogHeader><DialogTitle>Create New Purchase</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="space-y-2">
                <Label>Select Supplier</Label>
                <select 
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  value={formData.supplier_id}
                  onChange={(e) => setFormData({...formData, supplier_id: e.target.value})}
                >
                  <option value="" disabled>-- Select Supplier --</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name} - {s.phone}</option>
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
                      {p.name} (Current Stock: {p.stock}) - Cost: ৳{p.cost_price}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quantity to Buy</Label>
                  <Input 
                    type="number" min="1" required 
                    value={formData.quantity}
                    onChange={(e) => handleQuantityChange(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total Cost (৳)</Label>
                  <Input 
                    type="number" readOnly 
                    value={formData.total}
                    className="bg-gray-50"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Complete Purchase"}
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
              <TableHead>Supplier</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Total Cost (৳)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center">Loading...</TableCell></TableRow>
            ) : purchases.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-gray-500">No purchases found.</TableCell></TableRow>
            ) : purchases.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.purchase_date ? new Date(p.purchase_date).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell>{p.suppliers?.name}</TableCell>
                <TableCell>{p.products?.name}</TableCell>
                <TableCell className="text-green-600 font-medium">+{p.quantity}</TableCell>
                <TableCell className="font-bold">৳ {p.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}