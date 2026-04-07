import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  orderId?: string;
  userId?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    try {
      const savedNotifications = localStorage.getItem('jardin-verde-notifications');
      if (savedNotifications) {
        const parsedNotifications = JSON.parse(savedNotifications).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        setNotifications(parsedNotifications);
      }
    } catch (error) {
      console.error('Error loading notifications from localStorage:', error);
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    try {
      if (notifications.length > 0) {
        localStorage.setItem('jardin-verde-notifications', JSON.stringify(notifications));
      } else {
        localStorage.removeItem('jardin-verde-notifications');
      }
    } catch (error) {
      console.error('Error saving notifications to localStorage:', error);
    }
  }, [notifications]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Auto-remove success notifications after 5 seconds
    if (notification.type === 'success') {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 5000);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
    try {
      localStorage.removeItem('jardin-verde-notifications');
    } catch (error) {
      console.error('Error clearing notifications from localStorage:', error);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        removeNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// Helper functions for common notifications
export const createOrderNotification = (orderId: string, status: string, customerName?: string) => {
  const statusMessages = {
    pending: { title: 'Pedido Recibido', message: `El pedido #${orderId.substring(0, 8)} ha sido recibido y está pendiente de procesamiento.` },
    processing: { title: 'Pedido en Proceso', message: `El pedido #${orderId.substring(0, 8)} está siendo procesado.` },
    shipped: { title: 'Pedido Enviado', message: `¡Buenas noticias! El pedido #${orderId.substring(0, 8)} ha sido enviado y está en camino.` },
    delivered: { title: 'Pedido Entregado', message: `El pedido #${orderId.substring(0, 8)} ha sido entregado exitosamente.` },
    cancelled: { title: 'Pedido Cancelado', message: `El pedido #${orderId.substring(0, 8)} ha sido cancelado.` }
  };

  const statusConfig = statusMessages[status as keyof typeof statusMessages];
  if (!statusConfig) return null;

  return {
    type: status === 'cancelled' ? 'warning' : status === 'delivered' ? 'success' : 'info',
    ...statusConfig,
    orderId
  };
};
