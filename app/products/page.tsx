'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Package, ShoppingCart, ArrowLeft } from 'lucide-react'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // In a real app, you'd call API endpoints
        // For now, showing placeholder
        setProducts([])
        setLoading(false)
      } catch (error) {
        console.error('Error loading products:', error)
        setLoading(false)
      }
    }

    loadData()
  }, [selectedCategory])

  const handleAddToCart = async (productId: string) => {
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      })
      if (response.ok) {
        alert('تمت إضافة المنتج إلى السلة')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              عودة
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">المنتجات</h1>
          <Link href="/cart">
            <Button size="sm">
              <ShoppingCart className="w-4 h-4 mr-2" />
              السلة
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Categories Filter */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">الفئات</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(null)}
              className="whitespace-nowrap"
            >
              الكل
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat.id)}
                className="whitespace-nowrap"
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg">لا توجد منتجات متاحة حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {product.image_url && (
                  <div className="aspect-square bg-muted overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-primary">
                      {product.price} ر.س
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {product.stock_quantity} متاح
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    disabled={product.stock_quantity === 0}
                  >
                    <Button
                      className="w-full"
                      disabled={product.stock_quantity === 0}
                      onClick={() => handleAddToCart(product.id)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      أضف للسلة
                    </Button>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
