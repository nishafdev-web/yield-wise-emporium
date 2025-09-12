import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  category: string;
  image_url: string | null;
  stock: number;
  is_organic: boolean;
  safety_level: string;
  usage_instructions: string | null;
  safety_guidelines: string | null;
  created_at: string;
  created_by: string | null;
  updated_at: string;
}

interface UseProductsOptions {
  category?: string;
  search?: string;
  safetyLevel?: string;
  isOrganic?: boolean;
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('products')
        .select('*')
        .gt('stock', 0); // Only show products in stock

      // Apply filters
      if (options.category) {
        query = query.eq('category', options.category);
      }

      if (options.search) {
        query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`);
      }

      if (options.safetyLevel) {
        query = query.eq('safety_level', options.safetyLevel);
      }

      if (options.isOrganic !== undefined) {
        query = query.eq('is_organic', options.isOrganic);
      }

      // Order by name
      query = query.order('name');

      const { data, error } = await query;

      if (error) throw error;

      setProducts(data || []);
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Error Loading Products",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [options.category, options.search, options.safetyLevel, options.isOrganic]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
};

// Hook for getting product reviews/ratings
export const useProductReviews = (productId: string) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select(`
            *,
            profiles!inner(full_name)
          `)
          .eq('product_id', productId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setReviews(data || []);
        
        if (data && data.length > 0) {
          const avgRating = data.reduce((sum, review) => sum + review.rating, 0) / data.length;
          setAverageRating(avgRating);
          setReviewCount(data.length);
        } else {
          setAverageRating(0);
          setReviewCount(0);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  return {
    reviews,
    averageRating,
    reviewCount,
    loading,
  };
};