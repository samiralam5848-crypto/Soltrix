import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User, AlertCircle, CheckCircle, ShieldCheck } from 'lucide-react';

export default function Register() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      admin: false,
    },
  });

  const onSubmit = async (data) => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await signup(data.name, data.email, data.password, data.admin);
      setSuccess('Account created successfully! Redirecting to login...');
      reset();
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Registration failed. Email might be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-[70vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md border border-neutral-200 rounded-lg p-8 shadow-sm">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black uppercase tracking-tight text-black">
            Create Account
          </h2>
          <p className="text-xs font-semibold text-gray-400 mt-2 uppercase tracking-wider">
            Register to start ordering premium footwear
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="flex items-center space-x-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-xs mb-6 text-left">
            <AlertCircle size={16} className="text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-center space-x-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-xs mb-6 text-left">
            <CheckCircle size={16} className="text-green-600 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
          {/* Name */}
          <div>
            <label className="block text-black text-xs font-bold uppercase tracking-wider mb-2">Full Name *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <User size={16} />
              </div>
              <input
                type="text"
                placeholder="Enter full name"
                {...register('name', {
                  required: 'Full name is required',
                  minLength: { value: 3, message: 'Name must be at least 3 characters' },
                })}
                className={`w-full nike-input pl-10 ${errors.name ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.name && (
              <span className="text-red-500 text-xs mt-1 block font-semibold">{errors.name.message}</span>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-black text-xs font-bold uppercase tracking-wider mb-2">Email Address *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail size={16} />
              </div>
              <input
                type="text"
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email address is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                    message: 'Please enter a valid email address',
                  },
                })}
                className={`w-full nike-input pl-10 ${errors.email ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.email && (
              <span className="text-red-500 text-xs mt-1 block font-semibold">{errors.email.message}</span>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-black text-xs font-bold uppercase tracking-wider mb-2">Password *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock size={16} />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
                className={`w-full nike-input pl-10 ${errors.password ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.password && (
              <span className="text-red-500 text-xs mt-1 block font-semibold">{errors.password.message}</span>
            )}
          </div>

          {/* Admin Role Checkbox */}
          <div className="flex items-center space-x-2 py-2">
            <input
              type="checkbox"
              id="admin"
              {...register('admin')}
              className="rounded border-gray-300 text-black focus:ring-black h-4 w-4"
            />
            <label htmlFor="admin" className="flex items-center text-xs text-gray-500 font-extrabold uppercase tracking-wider cursor-pointer select-none">
              <ShieldCheck size={14} className="mr-1 text-black" />
              Register as Administrator
            </label>
          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full nike-btn-black flex items-center justify-center space-x-2 text-sm mt-4 cursor-pointer"
          >
            {loading ? (
              <span className="border-2 border-white border-t-transparent w-4 h-4 rounded-full animate-spin"></span>
            ) : (
              <span>Sign Up</span>
            )}
          </button>
        </form>

        {/* Link to Login */}
        <div className="text-center mt-6 pt-6 border-t border-neutral-100">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-black hover:underline font-black">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
