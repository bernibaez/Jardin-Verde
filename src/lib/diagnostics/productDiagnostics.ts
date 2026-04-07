// Diagnostic script to check products table and functionality
import { supabase } from '../../lib/supabaseClient';

export const runProductDiagnostics = async () => {
  console.log('=== PRODUCT SYSTEM DIAGNOSTICS ===');
  
  try {
    // 1. Check if products table exists
    console.log('1. Checking products table existence...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'products');
    
    if (tablesError) {
      console.error('Could not check tables:', tablesError);
    } else {
      const productsTableExists = tables && tables.length > 0;
      console.log('Products table exists:', productsTableExists);
      
      if (!productsTableExists) {
        console.error('❌ PRODUCTS TABLE DOES NOT EXIST');
        return;
      }
    }

    // 2. Check table structure
    console.log('2. Checking products table structure...');
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_schema', 'public')
      .eq('table_name', 'products')
      .order('ordinal_position');
    
    if (columnsError) {
      console.error('Could not check columns:', columnsError);
    } else {
      console.log('Products table columns:', columns);
    }

    // 3. Check RLS policies
    console.log('3. Checking RLS policies...');
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('policyname, permissive, roles, cmd, qual')
      .eq('tablename', 'products');
    
    if (policiesError) {
      console.error('Could not check policies:', policiesError);
    } else {
      console.log('RLS policies on products table:', policies);
    }

    // 4. Test basic select
    console.log('4. Testing basic SELECT operation...');
    const { data: testSelect, error: selectError } = await supabase
      .from('products')
      .select('count')
      .limit(1);
    
    if (selectError) {
      console.error('❌ SELECT operation failed:', selectError);
      console.error('Error details:', {
        message: selectError.message,
        details: selectError.details,
        hint: selectError.hint,
        code: selectError.code
      });
    } else {
      console.log('✅ SELECT operation works');
    }

    // 5. Test full select like productService
    console.log('5. Testing full SELECT like productService...');
    try {
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (productsError) {
        console.error('❌ Full SELECT failed:', productsError);
        console.error('Error details:', {
          message: productsError.message,
          details: productsError.details,
          hint: productsError.hint,
          code: productsError.code
        });
      } else {
        console.log('✅ Full SELECT works, found', products?.length || 0, 'products');
      }
    } catch (err) {
      console.error('❌ Unexpected error in full SELECT:', err);
    }

    console.log('=== PRODUCT DIAGNOSTICS COMPLETE ===');
    
  } catch (error) {
    console.error('Diagnostic error:', error);
  }
};

// Auto-run diagnostics in development
if ((import.meta as any).env?.DEV) {
  runProductDiagnostics();
}
