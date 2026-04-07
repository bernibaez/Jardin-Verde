import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Package, 
  ShoppingBag, 
  LayoutDashboard, 
  LogOut,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Image as ImageIcon,
  DollarSign,
  Users,
  Eye,
  ArrowLeft,
  Search,
  Box,
  Upload,
  Loader2,
  Shield,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Crown,
  Filter,
  Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { productService } from '../../lib/services/productService';
import { orderService, Order } from '../../lib/services/orderService';
import { userService, User } from '../../lib/services/userService';
import { Product } from '../context/CartContext';
import { useNotifications, createOrderNotification } from '../context/NotificationContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { OrderStatusModal } from '../components/OrderStatusModal';
import { NotificationCenter } from '../components/NotificationCenter';

export function Admin() {
  const { user, isAdmin, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [tempStatus, setTempStatus] = useState<Order['status'] | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | 'admin' | 'user'>('all');
  const [isOrderStatusModalOpen, setIsOrderStatusModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: '',
    stock: '10',
    rating: 4.5
  });

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/login', { replace: true });
    }
  }, [isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, ordersData, usersData] = await Promise.all([
        productService.getProducts(),
        orderService.getOrders(),
        userService.getUsers()
      ]);
      setProducts(productsData);
      setOrders(ordersData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: '', category: '', description: '', image: '', stock: '10', rating: 4.5 });
    setIsProductDialogOpen(true);
  };

  const handleOpenEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description,
      image: product.image,
      stock: (product.stock || 0).toString(),
      rating: product.rating || 4.5
    });
    setIsProductDialogOpen(true);
  };

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setTempStatus(order.status);
    setIsOrderStatusModalOpen(true);
  };

  const handleDeleteProduct = async (id: number | string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto del catálogo?')) {
      try {
        await productService.deleteProduct(id);
        toast.success('Producto eliminado con éxito');
        fetchData();
      } catch (error) {
        toast.error('Error al eliminar el producto');
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const publicUrl = await productService.uploadImage(file);
      setFormData({ ...formData, image: publicUrl });
      toast.success('Imagen subida correctamente');
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      toast.error('Error al subir la imagen. Asegúrate de que el bucket "products" existe en Supabase.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = { 
        ...formData, 
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, productData);
        toast.success('¡Producto actualizado correctamente!');
      } else {
        await productService.createProduct(productData as any);
        toast.success('¡Nuevo producto añadido al catálogo!');
      }
      setIsProductDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Error al guardar los cambios en el producto');
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      setIsUpdatingStatus(true);
      const updatedOrder = await orderService.updateOrderStatus(id, status);
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === id ? { ...order, status } : order
        )
      );
      
      // Create notification for status update
      const notification = createOrderNotification(id, status);
      if (notification) {
        addNotification({
          type: notification.type as 'success' | 'error' | 'warning' | 'info',
          title: notification.title,
          message: notification.message,
          orderId: notification.orderId
        });
      }
      
      toast.success('Estado del pedido actualizado con éxito');
      
      if (selectedOrder?.id === id) {
        setSelectedOrder(updatedOrder);
        setTempStatus(status);
      }
    } catch (error) {
      console.error('Error actualizando estado:', error);
      toast.error('Error al actualizar el estado del pedido');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      await userService.updateUserRole(userId, newRole);
      toast.success('Rol de usuario actualizado correctamente');
      fetchData();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Error al actualizar el rol del usuario');
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (confirm(`¿Estás seguro de que quieres eliminar al usuario "${userName}"? Esta acción no se puede deshacer.`)) {
      try {
        await userService.deleteUser(userId);
        toast.success('Usuario eliminado correctamente');
        fetchData();
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Error al eliminar el usuario');
      }
    }
  };

  const getRoleBadge = (role: User['role']) => {
    switch (role) {
      case 'admin': 
        return <Badge className="bg-purple-50 text-purple-700 border-purple-200"><Crown className="w-3 h-3 mr-1" /> Administrador</Badge>;
      case 'user': 
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200"><UserCheck className="w-3 h-3 mr-1" /> Usuario</Badge>;
      default: 
        return <Badge>{role}</Badge>;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(userSearchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-500/10"><Clock className="w-3 h-3 mr-1" /> Pendiente</Badge>;
      case 'processing': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-500/10"><Clock className="w-3 h-3 mr-1" /> Procesando</Badge>;
      case 'shipped': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-500/10"><Truck className="w-3 h-3 mr-1" /> Enviado</Badge>;
      case 'delivered': return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/10"><CheckCircle className="w-3 h-3 mr-1" /> Entregado</Badge>;
      case 'cancelled': return <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-500/10"><XCircle className="w-3 h-3 mr-1" /> Cancelado</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };
  const OrderStatusCell = ({ order }: { order: Order }) => {
    const [localStatus, setLocalStatus] = useState<Order['status']>(order.status);
    const hasChanged = localStatus !== order.status;

    return (
      <div className="flex items-center gap-2">
        <select 
          className="text-xs border-slate-200 bg-white rounded-lg p-1.5 focus:ring-emerald-500 outline-none transition-all"
          value={localStatus}
          onChange={(e) => setLocalStatus(e.target.value as Order['status'])}
        >
          <option value="pending">Pendiente</option>
          <option value="processing">Procesando</option>
          <option value="shipped">Enviado</option>
          <option value="delivered">Entregado</option>
          <option value="cancelled">Cancelado</option>
        </select>
        {hasChanged && (
          <Button 
            size="icon" 
            className="h-8 w-8 bg-emerald-600 hover:bg-emerald-700 animate-in zoom-in-50 duration-200"
            onClick={() => handleUpdateOrderStatus(order.id, localStatus)}
            disabled={isUpdatingStatus}
          >
            {isUpdatingStatus ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
          </Button>
        )}
      </div>
    );
  };
    const stats = [
    { title: 'Ventas Totales', value: `$${orders.reduce((acc, curr) => acc + (curr.status !== 'cancelled' ? curr.total : 0), 0).toFixed(2)}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Pedidos', value: orders.length, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Productos', value: products.length, icon: Package, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Usuarios', value: users.length, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
        <p className="text-gray-600 font-medium">Accediendo al Panel de Administración...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 bg-gradient-to-b from-emerald-50 to-white border-r border-emerald-100 sticky top-0 h-screen shadow-lg">
        <div className="p-6 flex items-center gap-3 border-b border-emerald-200 bg-gradient-to-r from-emerald-600 to-emerald-700">
          <div className="bg-white p-2.5 rounded-xl shadow-lg">
            <LayoutDashboard className="h-6 w-6 text-emerald-600" />
          </div>
          <span className="font-bold text-white text-lg">Jardín Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-4 px-4 py-3.5 text-slate-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-emerald-100 rounded-xl transition-all duration-200 group">
            <div className="bg-slate-100 group-hover:bg-emerald-200 p-2 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-slate-600 group-hover:text-emerald-700" />
            </div>
            <span className="font-medium">Tienda Pública</span>
          </button>
          <div className="pt-6 pb-3 px-4">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">Dashboard</span>
          </div>
          <button className="w-full flex items-center gap-4 px-4 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-200/50">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <span>General</span>
          </button>
        </nav>
        <div className="p-4 border-t border-emerald-200 bg-gradient-to-b from-emerald-50 to-white">
          <div className="flex items-center gap-4 px-4 py-4 bg-gradient-to-r from-emerald-100 to-emerald-50 rounded-2xl mb-4 border border-emerald-200">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm uppercase shadow-lg">
              {user?.name?.substring(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{user?.name}</p>
              <p className="text-xs text-emerald-600 font-medium truncate">Administrador</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-rose-600 hover:text-rose-700 hover:bg-gradient-to-r hover:from-rose-50 hover:to-rose-100 rounded-xl transition-all duration-200 group" onClick={logout}>
            <div className="bg-rose-100 group-hover:bg-rose-200 p-2 rounded-lg mr-3 transition-colors">
              <LogOut className="h-4 w-4 text-rose-600 group-hover:text-rose-700" />
            </div>
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-auto">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 px-8 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Panel de Control</h2>
            <p className="text-sm text-slate-500">Gestiona productos, pedidos y más.</p>
          </div>
          <div className="flex items-center gap-3">
            <NotificationCenter />
             <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-200" onClick={handleOpenAddDialog}>
               <Plus className="h-4 w-4 mr-2" /> Añadir Producto
             </Button>
          </div>
        </header>

        <div className="p-8 space-y-8 max-w-[1400px] mx-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`${stat.bg} p-3 rounded-xl`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="bg-white border border-slate-200 p-1 shadow-sm rounded-xl">
              <TabsTrigger value="products" className="rounded-lg data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
                <Package className="w-4 h-4 mr-2" /> Catálogo
              </TabsTrigger>
              <TabsTrigger value="orders" className="rounded-lg data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
                <ShoppingBag className="w-4 h-4 mr-2" /> Gestión de Pedidos
              </TabsTrigger>
              <TabsTrigger value="users" className="rounded-lg data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
                <Users className="w-4 h-4 mr-2" /> Gestión de Usuarios
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b border-slate-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Inventario</CardTitle>
                      <CardDescription>Visualiza y gestiona todos tus productos disponibles.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow>
                        <TableHead className="w-[80px]">Imagen</TableHead>
                        <TableHead>Producto</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow><TableCell colSpan={6} className="text-center py-12">Cargando catálogo...</TableCell></TableRow>
                      ) : products.length === 0 ? (
                        <TableRow><TableCell colSpan={6} className="text-center py-12 text-slate-500">No hay productos en el catálogo.</TableCell></TableRow>
                      ) : products.map((product) => (
                        <TableRow key={product.id} className="hover:bg-slate-50/50 transition-colors">
                          <TableCell>
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                              {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="w-full h-full p-3 text-slate-400" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-semibold text-slate-800">{product.name}</div>
                            <div className="text-xs text-slate-500 line-clamp-1 max-w-xs">{product.description}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-medium">
                              {product.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Box className="w-3 h-3 text-slate-400" />
                              <span className={`font-medium ${product.stock === 0 ? 'text-rose-600' : 'text-slate-700'}`}>
                                {product.stock || 0} unid.
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="font-bold text-slate-700">${product.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50" onClick={() => handleOpenEditDialog(product)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-rose-600 hover:bg-rose-50" onClick={() => handleDeleteProduct(product.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b border-slate-100">
                  <CardTitle>Pedidos Recibidos</CardTitle>
                  <CardDescription>Actualiza el estatus de los envíos y revisa los detalles.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow>
                        <TableHead>ID Pedido</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Estado Actual</TableHead>
                        <TableHead>Actualizar Estatus</TableHead>
                        <TableHead className="text-right">Detalles</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow><TableCell colSpan={6} className="text-center py-12">Cargando pedidos...</TableCell></TableRow>
                      ) : orders.length === 0 ? (
                        <TableRow><TableCell colSpan={6} className="text-center py-12 text-slate-500">Aún no se han recibido pedidos.</TableCell></TableRow>
                      ) : orders.map((order) => (
                        <TableRow key={order.id} className="hover:bg-slate-50/50 transition-colors">
                          <TableCell className="font-mono text-xs text-slate-500">#{order.id.substring(0, 8)}</TableCell>
                          <TableCell className="text-slate-600">{new Date(order.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="font-bold text-slate-800">${order.total.toFixed(2)}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>
                            <OrderStatusCell order={order} />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-emerald-600 hover:bg-emerald-50" 
                              onClick={() => handleViewOrderDetails(order)}
                            >
                              <Eye className="w-4 h-4 mr-2" /> Ver Detalles
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b border-slate-100">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <CardTitle>Gestión de Usuarios</CardTitle>
                      <CardDescription>Visualiza y gestiona todos los usuarios registrados en la plataforma.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">{users.length} usuarios totales</span>
                    </div>
                  </div>
                  
                  {/* Search and Filter Controls */}
                  <div className="flex flex-col sm:flex-row gap-4 mt-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Buscar por nombre o email..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-emerald-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={selectedRole === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedRole('all')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Todos
                      </Button>
                      <Button
                        variant={selectedRole === 'admin' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedRole('admin')}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <Crown className="w-4 h-4 mr-1" />
                        Admin
                      </Button>
                      <Button
                        variant={selectedRole === 'user' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedRole('user')}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <UserCheck className="w-4 h-4 mr-1" />
                        Usuarios
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Fecha de Registro</TableHead>
                        <TableHead>Última Actualización</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow><TableCell colSpan={6} className="text-center py-12">Cargando usuarios...</TableCell></TableRow>
                      ) : filteredUsers.length === 0 ? (
                        <TableRow><TableCell colSpan={6} className="text-center py-12 text-slate-500">
                          {users.length === 0 ? 'No hay usuarios registrados.' : 'No se encontraron usuarios con los filtros aplicados.'}
                        </TableCell></TableRow>
                      ) : filteredUsers.map((userItem) => (
                        <TableRow key={userItem.id} className="hover:bg-slate-50/50 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm uppercase shadow-lg">
                                {userItem.name?.substring(0, 2) || 'U'}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-800">{userItem.name}</div>
                                <div className="text-xs text-slate-500">ID: {userItem.id.substring(0, 8)}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-slate-400" />
                              <span className="text-slate-700">{userItem.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getRoleBadge(userItem.role)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-slate-600">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              <span className="text-sm">{new Date(userItem.created_at).toLocaleDateString()}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-slate-600">
                              {userItem.updated_at 
                                ? new Date(userItem.updated_at).toLocaleDateString()
                                : 'Nunca'
                              }
                            </div>
                          </TableCell>
                          <TableCell className="text-right space-x-1">
                            {userItem.role === 'user' ? (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-purple-600 hover:bg-purple-50" 
                                onClick={() => handleUpdateUserRole(userItem.id, 'admin')}
                                title="Convertir en Administrador"
                              >
                                <Crown className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-blue-600 hover:bg-blue-50" 
                                onClick={() => handleUpdateUserRole(userItem.id, 'user')}
                                title="Convertir en Usuario"
                              >
                                <UserCheck className="w-4 h-4" />
                              </Button>
                            )}
                            {userItem.id !== user?.id && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-rose-600 hover:bg-rose-50" 
                                onClick={() => handleDeleteUser(userItem.id, userItem.name)}
                                title="Eliminar Usuario"
                              >
                                <UserX className="w-4 h-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Order Status Modal */}
      <OrderStatusModal
        order={selectedOrder}
        isOpen={isOrderStatusModalOpen}
        onClose={() => {
          setIsOrderStatusModalOpen(false);
          setSelectedOrder(null);
        }}
        onUpdateStatus={handleUpdateOrderStatus}
      />

      {/* Product Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="sm:max-w-[550px] rounded-2xl">
          <form onSubmit={handleSaveProduct}>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-slate-800">{editingProduct ? 'Editar Producto' : 'Añadir al Catálogo'}</DialogTitle>
              <DialogDescription>Completa los campos para {editingProduct ? 'actualizar' : 'agregar'} el producto.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-5 py-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="bg-slate-50 border-slate-200 focus-visible:ring-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Precio de Venta ($)</Label>
                  <Input id="price" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required className="bg-slate-50 border-slate-200 focus-visible:ring-emerald-500" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stock">Stock Disponible</Label>
                  <Input id="stock" type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} required className="bg-slate-50 border-slate-200 focus-visible:ring-emerald-500" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Categoría</Label>
                <Input id="category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required className="bg-slate-50 border-slate-200 focus-visible:ring-emerald-500" placeholder="Ej: Plantas, Herramientas..." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Imagen del Producto</Label>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Label htmlFor="file-upload" className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl p-3 cursor-pointer hover:bg-slate-50 transition-colors group">
                        {isUploading ? (
                          <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                        ) : (
                          <Upload className="h-5 w-5 text-slate-400 group-hover:text-emerald-600" />
                        )}
                        <span className="text-sm font-medium text-slate-600">Subir desde dispositivo</span>
                        <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                      </Label>
                    </div>
                    <div className="flex-1">
                      <Input id="image" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="bg-slate-50 border-slate-200 focus-visible:ring-emerald-500" placeholder="O pega una URL..." />
                    </div>
                  </div>
                  {formData.image && (
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm group">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      <button 
                        type="button" 
                        onClick={() => setFormData({...formData, image: ''})}
                        className="absolute top-1 right-1 bg-white/80 backdrop-blur-sm p-1 rounded-full text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descripción Detallada</Label>
                <Textarea id="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required className="bg-slate-50 border-slate-200 focus-visible:ring-emerald-500 min-h-[100px]" />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="ghost" onClick={() => setIsProductDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-100 px-8">
                {editingProduct ? 'Actualizar Producto' : 'Añadir Producto'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-2xl overflow-hidden p-0 border-none">
          {selectedOrder && (
            <div className="flex flex-col h-full max-h-[90vh]">
              <div className="bg-emerald-600 p-8 text-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-emerald-100 text-sm mb-1 uppercase tracking-wider font-semibold">Resumen de Compra</p>
                    <h3 className="text-2xl font-bold">#{selectedOrder.id.substring(0, 8)}</h3>
                  </div>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <p className="text-emerald-50 opacity-80 text-sm">Fecha: {new Date(selectedOrder.created_at).toLocaleString()}</p>
              </div>
              
              <div className="p-8 overflow-auto space-y-8 bg-white">
                <section>
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Artículos</h4>
                  <div className="space-y-4">
                    {selectedOrder.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center">
                            <Package className="h-5 w-5 text-slate-400" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{item.name}</p>
                            <p className="text-xs text-slate-500">Cant: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-bold text-slate-800">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <section>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Información de Envío</h4>
                    <div className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
                      <p className="font-semibold text-slate-800">{selectedOrder.shipping_address?.address || 'N/A'}</p>
                      <p>{selectedOrder.shipping_address?.city || ''}</p>
                      <p>Código Postal: {selectedOrder.shipping_address?.zip || ''}</p>
                    </div>
                  </section>
                  <section>
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Control de Estatus</h4>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: 'pending', label: 'Pendiente', activeClass: 'bg-amber-600 border-amber-600 shadow-amber-100' },
                          { id: 'processing', label: 'Procesando', activeClass: 'bg-blue-600 border-blue-600 shadow-blue-100' },
                          { id: 'shipped', label: 'Enviado', activeClass: 'bg-indigo-600 border-indigo-600 shadow-indigo-100' },
                          { id: 'delivered', label: 'Entregado', activeClass: 'bg-emerald-600 border-emerald-600 shadow-emerald-100' },
                          { id: 'cancelled', label: 'Cancelado', activeClass: 'bg-rose-600 border-rose-600 shadow-rose-100' }
                        ].map((s) => (
                          <button
                            key={s.id}
                            onClick={() => setTempStatus(s.id as Order['status'])}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                              tempStatus === s.id
                                ? `${s.activeClass} text-white shadow-md`
                                : `bg-white text-slate-600 border-slate-200 hover:bg-slate-50`
                            }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                      
                      {tempStatus !== selectedOrder.status && (
                        <Button 
                          className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-100"
                          onClick={() => handleUpdateOrderStatus(selectedOrder.id, tempStatus!)}
                          disabled={isUpdatingStatus}
                        >
                          {isUpdatingStatus ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          )}
                          Guardar Cambios de Estatus
                        </Button>
                      )}
                      
                      <p className="text-[10px] text-slate-400 text-center">
                        Selecciona un nuevo estado y confirma para actualizar.
                      </p>
                    </div>
                  </section>
                </div>

                <div className="border-t border-slate-100 pt-6 mt-6 flex justify-between items-center">
                   <p className="text-slate-500 font-medium">Importe Total</p>
                   <p className="text-3xl font-black text-emerald-600">${selectedOrder.total.toFixed(2)}</p>
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                <Button onClick={() => setIsOrderDetailsOpen(false)} className="bg-slate-800 hover:bg-slate-900 rounded-xl px-8 shadow-lg">Cerrar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
