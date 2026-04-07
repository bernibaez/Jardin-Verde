import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router';
import { Sprout, Mail, Lock, User, Leaf, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (!isLogin) {
      if (!name) {
        setError('Por favor ingresa tu nombre');
        return;
      }
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }
      if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return;
      }
    }

    setIsLoading(true);

    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Tiempo de espera agotado')), 15000);
      });

      const authPromise = (async () => {
        if (isLogin) {
          const { success, error: loginError } = await login(email, password);
          if (success) {
            navigate(from, { replace: true });
          } else {
            setError(loginError || 'Email o contraseña incorrectos');
          }
        } else {
          const { success, error: regError } = await register(name, email, password);
          if (success) {
            if (regError) {
              setError(regError);
              setIsLogin(true);
            } else {
              navigate(from, { replace: true });
            }
          } else {
            setError(regError || 'Ocurrió un error en el registro');
          }
        }
      })();

      await Promise.race([authPromise, timeoutPromise]);
    } catch (err) {
      if (err instanceof Error && err.message === 'Tiempo de espera agotado') {
        setError('La operación está tardando demasiado. Verifica tu conexión a internet e intenta de nuevo.');
      } else {
        setError('Ocurrió un error inesperado. Por favor intenta de nuevo.');
      }
      console.error('Login/Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="relative">
              <Sprout className="h-10 w-10 text-[#2D5128]" />
              <Leaf className="h-5 w-5 text-[#2D5128] absolute -bottom-1 -right-1" />
            </div>
            <span className="text-2xl font-bold text-[#2D5128]">Jardín Verde</span>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Bienvenido al sistema' : 'Únete a Jardín Verde'}
            </h1>
            <p className="text-gray-600">
              {isLogin 
                ? 'Inicia sesión ingresando la información abajo'
                : 'Crea tu cuenta para disfrutar de nuestros servicios'
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Juan Pérez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D5128] focus:border-[#2D5128] outline-none transition-colors"
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D5128] focus:border-[#2D5128] outline-none transition-colors"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D5128] focus:border-[#2D5128] outline-none transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D5128] focus:border-[#2D5128] outline-none transition-colors"
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[#2D5128] border-gray-300 rounded focus:ring-[#2D5128]"
                  />
                  Recordarme
                </label>
                <Link to="/forgot-password" className="text-sm text-[#2D5128] hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#2D5128] hover:bg-[#1f3d1f] text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{isLogin ? 'Iniciando sesión...' : 'Registrando...'}</span>
                </>
              ) : (
                <span>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</span>
              )}
            </button>

            <div className="text-center text-sm text-gray-600">
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
              <button
                type="button"
                onClick={toggleMode}
                className="ml-1 text-[#2D5128] hover:underline font-medium"
                disabled={isLoading}
              >
                {isLogin ? 'Regístrate' : 'Inicia sesión'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Panel - Illustration */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-[#e8f0e8] to-[#2D5128]">
        {/* Abstract shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-[#2D5128]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#2D5128]/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#2D5128]/15 rounded-full blur-2xl"></div>
        </div>

        {/* Garden Illustration */}
        <div className="relative h-full flex items-center justify-center p-12">
          <div className="text-center text-white">
            <div className="mb-8">
              <div className="relative inline-block">
                <Sprout className="h-32 w-32 text-white/90" />
                <Leaf className="h-16 w-16 text-white/80 absolute -bottom-4 -right-4" />
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-4 text-white">
              {isLogin ? 'Bienvenido de nuevo' : 'Únete a nuestra comunidad'}
            </h2>
            <p className="text-xl text-white/80 max-w-md mx-auto mb-8">
              Transforma tu espacio en un paraíso verde con nuestros productos y servicios de jardinería
            </p>
            <div className="flex flex-col gap-4 text-white/90">
              <div className="flex items-center justify-center gap-3">
                <Leaf className="h-5 w-5" />
                <span>Productos 100% orgánicos</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Sprout className="h-5 w-5" />
                <span>Asesoría profesional</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Leaf className="h-5 w-5" />
                <span>Diseño sostenible</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
