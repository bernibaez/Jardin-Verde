// Combined diagnostics script to check all critical tables
import { runProductDiagnostics } from './productDiagnostics';
import { runOrderDiagnostics } from './orderDiagnostics';
import { supabase } from '../../lib/supabaseClient';

export const runAllDiagnostics = async () => {
  console.log('🔍 STARTING COMPREHENSIVE SYSTEM DIAGNOSTICS');
  
  try {
    // Check basic connection
    console.log('\n=== BASIC CONNECTION TEST ===');
    const { data, error } = await supabase
      .from('_test_connection')
      .select('1')
      .limit(1);
    
    if (error && !error.message.includes('does not exist')) {
      console.error('❌ Basic connection failed:', error);
      return;
    } else {
      console.log('✅ Basic connection works');
    }

    // Run all diagnostics
    console.log('\n=== PRODUCT SYSTEM ===');
    await runProductDiagnostics();
    
    console.log('\n=== ORDER SYSTEM ===');
    await runOrderDiagnostics();
    
    console.log('\n=== SUMMARY ===');
    console.log('Diagnostics completed. Check console output for specific issues.');
    console.log('Common problems and solutions:');
    console.log('1. Table does not exist → Create table in Supabase dashboard');
    console.log('2. RLS policy issues → Check Row Level Security policies');
    console.log('3. Permission denied → Check user permissions and RLS');
    console.log('4. 500 errors → Check table structure and constraints');
    
  } catch (error) {
    console.error('❌ Diagnostic system error:', error);
  }
};

// Auto-run in development
if ((import.meta as any).env?.DEV) {
  // Wait a bit for app to load
  setTimeout(() => {
    runAllDiagnostics();
  }, 2000);
}
