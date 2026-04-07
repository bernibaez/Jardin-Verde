import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle, Clock, Truck, XCircle, Loader2, Package, Calendar, User, MapPin, DollarSign } from 'lucide-react';
import { Order } from '../../lib/services/orderService';

interface OrderStatusModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: Order['status']) => Promise<void>;
}

const statusConfig = {
  pending: {
    label: 'Pendiente',
    description: 'El pedido ha sido recibido y está esperando procesamiento',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Clock,
    nextStatus: 'processing'
  },
  processing: {
    label: 'Procesando',
    description: 'El pedido está siendo preparado para envío',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Package,
    nextStatus: 'shipped'
  },
  shipped: {
    label: 'Enviado',
    description: 'El pedido está en camino al destino',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: Truck,
    nextStatus: 'delivered'
  },
  delivered: {
    label: 'Entregado',
    description: 'El pedido ha sido entregado exitosamente',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle,
    nextStatus: null
  },
  cancelled: {
    label: 'Cancelado',
    description: 'El pedido ha sido cancelado',
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: XCircle,
    nextStatus: null
  }
};

export function OrderStatusModal({ order, isOpen, onClose, onUpdateStatus }: OrderStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<Order['status'] | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!order) return null;

  const currentStatusConfig = statusConfig[order.status];
  const selectedStatusConfig = selectedStatus ? statusConfig[selectedStatus] : null;

  const handleStatusUpdate = async () => {
    if (!selectedStatus || selectedStatus === order.status) return;

    setIsUpdating(true);
    try {
      await onUpdateStatus(order.id, selectedStatus);
      setSelectedStatus(null);
      onClose();
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusProgress = () => {
    const statusOrder: Array<Order['status']> = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(order.status);
    
    return statusOrder.map((status, index) => {
      const config = statusConfig[status as keyof typeof statusConfig];
      const isCompleted = index < currentIndex;
      const isCurrent = index === currentIndex;
      const isCancelled = order.status === 'cancelled' && status !== 'cancelled';
      
      return {
        status,
        config,
        isCompleted,
        isCurrent,
        isCancelled
      };
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-800">
            Actualizar Estado del Pedido
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-emerald-700 text-sm font-semibold mb-1">Pedido #{order.id.substring(0, 8)}</p>
                <h3 className="text-xl font-bold text-emerald-800">Resumen del Pedido</h3>
              </div>
              <Badge className={currentStatusConfig.color}>
                <currentStatusConfig.icon className="w-3 h-3 mr-1" />
                {currentStatusConfig.label}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Cliente: {order.user_id?.substring(0, 8)}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-bold">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4">Progreso del Pedido</h4>
            <div className="space-y-4">
              {getStatusProgress().map(({ status, config, isCompleted, isCurrent, isCancelled }) => (
                <div key={status} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    isCompleted ? 'bg-emerald-100 border-emerald-500' : 
                    isCurrent ? 'bg-emerald-500 border-emerald-500' : 
                    isCancelled ? 'bg-slate-100 border-slate-300' : 'bg-slate-100 border-slate-300'
                  }`}>
                    <config.icon className={`w-5 h-5 ${
                      isCompleted || isCurrent ? 'text-emerald-600' : 'text-slate-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium ${
                      isCurrent ? 'text-emerald-700' : isCompleted ? 'text-slate-700' : 'text-slate-500'
                    }`}>
                      {config.label}
                    </div>
                    <div className="text-sm text-slate-500">{config.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Selection */}
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4">Seleccionar Nuevo Estado</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(statusConfig).map(([status, config]) => {
                const isCurrent = status === order.status;
                const isSelected = selectedStatus === status;
                const statusOrder: Array<Order['status']> = ['pending', 'processing', 'shipped', 'delivered'];
                const isNextStatus = config.nextStatus && statusOrder.indexOf(status as Order['status']) === statusOrder.indexOf(order.status) + 1;
                
                return (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status as Order['status'])}
                    disabled={isCurrent}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      isSelected 
                        ? 'border-emerald-500 bg-emerald-50 shadow-md' 
                        : isCurrent
                        ? 'border-slate-300 bg-slate-50 cursor-not-allowed'
                        : isNextStatus
                        ? 'border-emerald-300 bg-emerald-50 hover:border-emerald-400 hover:bg-emerald-100'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <config.icon className={`w-5 h-5 ${
                        isSelected ? 'text-emerald-600' : isCurrent ? 'text-slate-400' : 'text-slate-600'
                      }`} />
                      <span className={`font-medium ${
                        isSelected ? 'text-emerald-700' : isCurrent ? 'text-slate-500' : 'text-slate-700'
                      }`}>
                        {config.label}
                      </span>
                    </div>
                    <p className={`text-sm ${
                      isSelected ? 'text-emerald-600' : 'text-slate-500'
                    }`}>
                      {config.description}
                    </p>
                    {isCurrent && (
                      <div className="mt-2 text-xs text-emerald-600 font-medium">
                        Estado actual
                      </div>
                    )}
                    {isNextStatus && !isSelected && (
                      <div className="mt-2 text-xs text-emerald-600 font-medium">
                        Siguiente paso recomendado
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4">Artículos del Pedido</h4>
            <div className="space-y-3">
              {order.items?.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                      <Package className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{item.name}</p>
                      <p className="text-sm text-slate-500">Cantidad: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-bold text-slate-800">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-700">Total del Pedido:</span>
                <span className="text-2xl font-bold text-emerald-600">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-4">Dirección de Envío</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                <div className="text-slate-700">
                  <p className="font-medium">{order.shipping_address?.address}</p>
                  <p>{order.shipping_address?.city}</p>
                  <p>Código Postal: {order.shipping_address?.zip}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isUpdating}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={!selectedStatus || selectedStatus === order.status || isUpdating}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Actualizando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Actualizar Estado
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper for status order
const statusOrder = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
