import { createBrowserRouter } from 'react-router';
import { Layout } from './pages/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';
import { MyOrders } from './pages/MyOrders';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';
import { ErrorBoundary } from './components/ErrorBoundary';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, Component: Home },
      { path: 'about', Component: About },
      { path: 'products', Component: Products },
      { path: 'product/:id', Component: ProductDetail },
      { path: 'cart', Component: Cart },
      { path: 'checkout', Component: Checkout },
      { path: 'admin', Component: Admin },
      { path: 'profile', Component: Profile },
      { path: 'my-orders', Component: MyOrders },
      { path: '*', Component: NotFound },
    ],
  },
  {
    path: '/login',
    Component: Login,
  },
]);
