import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { orderService, Order } from '../../lib/services/orderService';
import { 
  Package, 
  Clock, 
  Truck, 
  CheckCircle, 
  XCircle, 
  ChevronRight,
  ShoppingBag,
  Loader2,
  Calendar,
  MapPin
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";

export function MyOrders() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getUserOrders(user!.id);
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas cancelar este pedido?')) {
      try {
        await orderService.updateOrderStatus(id, 'cancelled');
        toast.success('Pedido cancelado con éxito');
        fetchOrders();
      } catch (error) {
        toast.error('No se pudo cancelar el pedido');
      }
    }
  };

  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return { 
          label: 'Pendiente', 
          icon: Clock, 
          color: 'text-amber-600', 
          bg: 'bg-amber-50', 
          border: 'border-amber-200',
          step: 1 
        };
      case 'processing':
        return { 
          label: 'Procesando', 
          icon: Clock, 
          color: 'text-blue-600', 
          bg: 'bg-blue-50', 
          border: 'border-blue-200',
          step: 2 
        };
      case 'shipped':
        return { 
          label: 'Enviado', 
          icon: Truck, 
          color: 'text-indigo-600', 
          bg: 'bg-indigo-50', 
          border: 'border-indigo-200',
          step: 3 
        };
      case 'delivered':
        return { 
          label: 'Entregado', 
          icon: CheckCircle, 
          color: 'text-emerald-600', 
          bg: 'bg-emerald-50', 
          border: 'border-emerald-200',
          step: 4 
        };
      case 'cancelled':
        return { 
          label: 'Cancelado', 
          icon: XCircle, 
          color: 'text-rose-600', 
          bg: 'bg-rose-50', 
          border: 'border-rose-200',
          step: 0 
        };
      default:
        return { label: status, icon: Package, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200', step: 1 };
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-green-600 mb-4" />
        <p className="text-slate-500">Cargando tus pedidos...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-slate-300 mb-4" />
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Inicia sesión para ver tus pedidos</h1>
        <p className="text-slate-500 mb-8">Debes estar autenticado para acceder a tu historial de compras.</p>
        <Link to="/login" className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors">
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-green-100 p-2 rounded-lg">
          <ShoppingBag className="h-6 w-6 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800">Mis Pedidos</h1>
      </div>

      {orders.length === 0 ? (
        <Card className="border-dashed border-2 bg-slate-50/50">
          <CardContent className="py-16 text-center">
            <Package className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <p className="text-slate-500 text-lg">Aún no has realizado ningún pedido.</p>
            <Link to="/products" className="text-green-600 font-semibold hover:underline mt-2 inline-block">
              ¡Empieza a comprar ahora!
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <Card key={order.id} className="overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className={`h-1.5 w-full ${statusInfo.bg.replace('bg-', 'bg-').replace('50', '500')}`} />
                <CardHeader className="bg-white border-b border-slate-100 py-4">
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">ID Pedido</p>
                        <p className="font-mono text-sm font-semibold text-slate-700">#{order.id.substring(0, 8)}</p>
                      </div>
                      <div className="h-8 w-px bg-slate-200" />
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fecha</p>
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {order.status === 'pending' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50">
                              Cancelar Pedido
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás completamente seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción cancelará tu pedido de forma permanente. No podrás revertir esto una vez confirmado.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-xl">Volver</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleCancelOrder(order.id)}
                                className="bg-rose-600 hover:bg-rose-700 rounded-xl"
                              >
                                Sí, cancelar pedido
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</p>
                        <p className="text-lg font-black text-slate-800">${order.total.toFixed(2)}</p>
                      </div>
                      <Badge className={`${statusInfo.bg} ${statusInfo.color} ${statusInfo.border} border shadow-none px-3 py-1`}>
                        <StatusIcon className="h-3.5 w-3.5 mr-1.5" />
                        {statusInfo.label}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 bg-white">
                  {/* Status Tracker */}
                  <div className="mb-10 relative">
                    <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 -z-0" />
                    <div className="flex justify-between relative z-10">
                      {[
                        { label: 'Recibido', icon: Clock, step: 1 },
                        { label: 'Procesando', icon: Package, step: 2 },
                        { label: 'En camino', icon: Truck, step: 3 },
                        { label: 'Entregado', icon: CheckCircle, step: 4 }
                      ].map((s) => {
                        const isActive = statusInfo.step >= s.step;
                        const isCurrent = statusInfo.step === s.step;
                        const Icon = s.icon;
                        
                        return (
                          <div key={s.step} className="flex flex-col items-center">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                              isActive 
                                ? 'bg-green-600 border-green-100 text-white scale-110' 
                                : 'bg-white border-slate-50 text-slate-300'
                            } ${isCurrent ? 'ring-4 ring-green-50' : ''}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <span className={`mt-2 text-xs font-bold ${isActive ? 'text-green-700' : 'text-slate-400'}`}>
                              {s.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Items Summary */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Resumen de productos</h4>
                      <div className="space-y-2">
                        {order.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-slate-50">
                            <span className="text-slate-600 font-medium">
                              {item.name} <span className="text-slate-400 ml-1">x{item.quantity}</span>
                            </span>
                            <span className="font-bold text-slate-700">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <MapPin className="h-3 w-3" /> Dirección de envío
                      </h4>
                      <div className="text-sm text-slate-600 space-y-0.5">
                        <p className="font-bold text-slate-800">{order.shipping_address?.address || 'N/A'}</p>
                        <p>{order.shipping_address?.city || ''}, CP {order.shipping_address?.zip || ''}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
