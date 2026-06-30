import { useEffect, useState } from "react";
import type { Product } from "@/types";
import { getProducts, addProduct } from "@/services/productService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Loader2, AlertTriangle } from "lucide-react";

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // ফর্মে stock এবং min_stock যোগ করা হলো
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    cost_price: "",
    selling_price: "",
    stock: "",
    min_stock: "",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newProduct = await addProduct({
        name: formData.name,
        sku: formData.sku,
        cost_price: Number(formData.cost_price),
        selling_price: Number(formData.selling_price),
        stock: Number(formData.stock),
        min_stock: Number(formData.min_stock),
      });
      
      setProducts([newProduct, ...products]);
      setIsOpen(false); 
      
      setFormData({ name: "", sku: "", cost_price: "", selling_price: "", stock: "", min_stock: "" });
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input 
                  id="name" 
                  required 
                  placeholder="e.g. Wireless Mouse"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input 
                  id="sku" 
                  required 
                  placeholder="e.g. MOUSE-001"
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cost_price">Cost Price (৳)</Label>
                  <Input 
                    id="cost_price" 
                    type="number" 
                    required 
                    min="0"
                    placeholder="0.00"
                    value={formData.cost_price}
                    onChange={(e) => setFormData({...formData, cost_price: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="selling_price">Selling Price (৳)</Label>
                  <Input 
                    id="selling_price" 
                    type="number" 
                    required 
                    min="0"
                    placeholder="0.00"
                    value={formData.selling_price}
                    onChange={(e) => setFormData({...formData, selling_price: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Current Stock</Label>
                  <Input 
                    id="stock" 
                    type="number" 
                    required 
                    min="0"
                    placeholder="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min_stock">Minimum Stock Alert</Label>
                  <Input 
                    id="min_stock" 
                    type="number" 
                    required 
                    min="0"
                    placeholder="10"
                    value={formData.min_stock}
                    onChange={(e) => setFormData({...formData, min_stock: e.target.value})}
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                ) : (
                  "Save Product"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-md border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Cost/Sell Price</TableHead>
              <TableHead>Stock Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-gray-500">Loading products...</TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-gray-500">No products found. Add your first product!</TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-gray-500">{product.sku}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Cost: ৳ {product.cost_price}</span>
                      <span className="font-medium">Sell: ৳ {product.selling_price}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {/* ডাটাবেসের min_stock এর উপর ভিত্তি করে স্মার্ট অ্যালার্ট */}
                    {product.stock <= product.min_stock ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                        <AlertTriangle className="w-3 h-3" />
                        Low Stock ({product.stock})
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        In Stock ({product.stock})
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}