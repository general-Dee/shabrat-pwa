import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Product } from '@/lib/types'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('name')
        if (error) throw error

        const mapped: Product[] = data.map((p: any) => {
          let imageUrl = p.image_url || '/placeholder.png'
          if (imageUrl.includes('res.cloudinary.com')) {
            imageUrl = imageUrl.replace('/upload/', '/upload/f_auto,q_auto/')
          }
          return {
            _id: p.id.toString(),
            name: p.name,
            category: p.category,
            price: p.price,
            unit: p.unit,
            description: p.description || '',
            imageUrl: imageUrl,
            imagePublicId: p.image_public_id || '',
            stock: p.stock ?? 0,
          }
        })
        setProducts(mapped)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return { products, loading, error }
}