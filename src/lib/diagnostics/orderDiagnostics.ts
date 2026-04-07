// Diagnostic script to check orders table and functionality
import { supabase } from '../../lib/supabaseClient';

export const runOrderDiagnostics = async () => {
  console.log('=== ORDER SYSTEM DIAGNOSTICS ===');
  
  try {
    // 1. Check if orders table exists
    console.log('1. Checking orders table existence...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'orders');
    
    if (tablesError) {
      console.error('Could not check tables:', tablesError);
    } else {
      const ordersTableExists = tables && tables.length > 0;
      console.log('Orders table exists:', ordersTableExists);
      
      if (!ordersTableExists) {
        console.error('❌ ORDERS TABLE DOES NOT EXIST');
        return;
      }
    }

    // 2. Check table structure
    console.log('2. Checking orders table structure...');
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_schema', 'public')
      .eq('table_name', 'orders')
      .order('ordinal_position');
    
    if (columnsError) {
      console.error('Could not check columns:', columnsError);
    } else {
      console.log('Orders table columns:', columns);
    }

    // 3. Check RLS policies
    console.log('3. Checking RLS policies...');
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('policyname, permissive, roles, cmd, qual')
      .eq('tablename', 'orders');
    
    if (policiesError) {
      console.error('Could not check policies:', policiesError);
    } else {
      console.log('RLS policies on orders table:', policies);
    }

    // 4. Test basic select
    console.log('4. Testing basic SELECT operation...');
    const { data: testSelect, error: selectError } = await supabase
      .from('orders')
      .select('count')
      .limit(1);
    
    if (selectError) {
      console.error('❌ SELECT operation failed:', selectError);
    } else {
      console.log('✅ SELECT operation works');
    }

    // 5. Test insert (if we can)
    console.log('5. Testing INSERT operation...');
    const testOrder = {
      user_id: '00000000-0000-0000-0000-000000000000', // Invalid UUID for testing
      items: [],
      total: 0,
      status: 'pending',
      shipping_address: {
        address: 'Test Address',
        city: 'Test City',
        zip: '12345'
      }
    };

    const { data: testInsert, error: insertError } = await supabase
      .from('orders')
      .insert([testOrder])
      .select()
      .single();

    if (insertError) {
      console.log('Expected INSERT error (invalid UUID):', insertError.message);
    } else {
      console.log('✅ INSERT operation works (unexpected)');
    }

    console.log('=== DIAGNOSTICS COMPLETE ===');
    
  } catch (error) {
    console.error('Diagnostic error:', error);
  }
};

// Auto-run diagnostics in development
if ((import.meta as any).env?.DEV) {
  runOrderDiagnostics();
}
