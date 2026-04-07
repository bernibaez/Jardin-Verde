import { supabase } from '../supabaseClient';
import { Product } from '../../app/context/CartContext';

export const productService = {
  async getProducts() {
    try {
      console.log('Fetching products...');
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        
        // Specific error handling
        if (error.code === 'PGRST116') {
          throw new Error('Products table does not exist');
        } else if (error.code === '42501') {
          throw new Error('Permission denied - check RLS policies on products table');
        } else if (error.code === '42P01') {
          throw new Error('Products table not found - please create the table');
        } else {
          throw new Error(`Error fetching products: ${error.message}`);
        }
      }
      
      console.log('Products fetched successfully:', data?.length || 0, 'products');
      return data as Product[];
    } catch (error) {
      console.error('Critical error in getProducts:', error);
      throw error;
    }
  },

  async getProductById(id: string | number) {
    try {
      console.log('Fetching product by ID:', id);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching product by ID:', error);
        throw new Error(`Error fetching product: ${error.message}`);
      }
      
      console.log('Product fetched successfully');
      return data as Product;
    } catch (error) {
      console.error('Critical error in getProductById:', error);
      throw error;
    }
  },

  async createProduct(product: Omit<Product, 'id'>) {
    try {
      console.log('Creating product:', product);
      
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

      if (error) {
        console.error('Error creating product:', error);
        throw new Error(`Error al crear el producto: ${error.message}`);
      }
      
      console.log('Product created successfully:', data);
      return data as Product;
    } catch (error) {
      console.error('Critical error in createProduct:', error);
      throw error;
    }
  },

  async updateProduct(id: string | number, product: Partial<Product>) {
    try {
      console.log('Updating product:', { id, updates: product });
      
      const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating product:', error);
        throw new Error(`Error updating product: ${error.message}`);
      }
      
      console.log('Product updated successfully:', data);
      return data as Product;
    } catch (error) {
      console.error('Critical error in updateProduct:', error);
      throw error;
    }
  },

  async uploadImage(file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  async deleteProduct(id: string | number) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};
