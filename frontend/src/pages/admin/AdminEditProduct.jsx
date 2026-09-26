import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { api } from '../../services/api';
import { ArrowLeft, CheckCircle, AlertCircle, ShieldCheck, Loader } from 'lucide-react';

export default function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const fetchProductDetails = useCallback(async () => {
    setFetching(true);
    try {
      const data = await api.products.getById(id);
      // Pre-fill form values
      reset({
        name: data.name || data.title || '',
        brand: data.brand || '',
        description: data.description || '',
        price: data.price != null ? data.price.toString() : '',
        discountPrice: data.discountPrice ? data.discountPrice.toString() : '',
        category: data.category || 'SNEAKERS',
        gender: data.gender || 'Unisex',
        color: data.color || 'Multicolor',
        sizes: data.sizes || '',
        stock: data.stock != null ? data.stock.toString() : '0',
        imageUrl: data.imageUrl || '',
      });
    } catch {
      setError('Failed to fetch product details.');
    } finally {
      setFetching(false);
    }
  }, [id, reset]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  const onSubmit = async (data) => {
    setError('');
    setSuccess('');
    setLoading(true);

    const payload = {
      name: data.name,
      brand: data.brand,
      description: data.description,
      price: parseFloat(data.price),
      discountPrice: data.discountPrice ? parseFloat(data.discountPrice) : null,
      gender: data.gender,
      color: data.color,
      category: data.category,
      sizes: data.sizes,
      stock: parseInt(data.stock),
      imageUrl: data.imageUrl || '/images/shoes/nike-airmax.jpg',
    };

    try {
      await api.products.update(id, payload);
      setSuccess('Product updated successfully! Redirecting...');
      setTimeout(() => {
        navigate('/admin/products');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to update product.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-2">
          <Loader className="animate-spin text-black" size={32} />
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Fetching Product Details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-12 text-left">
        
        {/* Back Link */}
        <Link to="/admin/products" className="inline-flex items-center text-gray-400 hover:text-black mb-8 transition-colors text-xs font-bold uppercase tracking-wider">
          <ArrowLeft size={14} className="mr-1.5" /> Back to Catalog
        </Link>

        {/* Title */}
        <h1 className="text-3xl font-black text-black uppercase tracking-tighter mb-8 border-b border-neutral-100 pb-4">
          Edit Shoe Product
        </h1>

        {/* Alerts */}
        {error && (
          <div className="flex items-center space-x-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-xs mb-6">
            <AlertCircle size={16} className="text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="flex items-center space-x-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-xs mb-6 animate-pulse">
            <CheckCircle size={16} className="text-green-600 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 border border-neutral-200 rounded-lg p-6 bg-neutral-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-black text-xs font-bold uppercase tracking-wider mb-2">Shoe Name *</label>
              <input
                type="text"
                placeholder="e.g. Air Max"
                {...register('name', { required: 'Shoe name is required' })}
                className={`w-full nike-input ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && (
                <span className="text-red-500 text-xs mt-1 block font-semibold">{errors.name.message}</span>
              )}
            </div>
            <div>
              <label className="block text-black text-xs font-bold uppercase tracking-wider mb-2">Brand Name *</label>
              <input
                type="text"
                placeholder="e.g. Nike"
                {...register('brand', { required: 'Brand is required' })}
                className={`w-full nike-input ${errors.brand ? 'border-red-500' : ''}`}
              />
              {errors.brand && (
                <span className="text-red-500 text-xs mt-1 block font-semibold">{errors.brand.message}</span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-black text-xs font-bold uppercase tracking-wider mb-2">Description *</label>
            <textarea
              rows={3}
              placeholder="Enter product details..."
              {...register('description', { required: 'Description is required' })}
              className={`w-full nike-input ${errors.description ? 'border-red-500' : ''}`}
            />
            {errors.description && (
              <span className="text-red-500 text-xs mt-1 block font-semibold">{errors.description.message}</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-black text-xs font-bold uppercase tracking-wider mb-2">Price (INR) *</label>
              <input
                type="number"
                placeholder="4999"
                {...register('price', {
                  required: 'Price is required',
                  min: { value: 1, message: 'Price must be greater than 0' },
                })}
                className={`w-full nike-input font-mono ${errors.price ? 'border-red-500' : ''}`}
              />
              {errors.price && (
                <span className="text-red-500 text-xs mt-1 block font-semibold">{errors.price.message}</span>
              )}
            </div>
            <div>
              <label className="block text-black text-xs font-bold uppercase tracking-wider mb-2">Discount Price</label>
              <input
                type="number"
                placeholder="3999"
                {...register('discountPrice')}
                className="w-full nike-input font-mono"
              />
            </div>
            <div>
              <label className="block text-black text-xs font-bold uppercase tracking-wider mb-2">Stock Quantity *</label>
              <input
                type="number"
                placeholder="20"
                {...register('stock', {
                  required: 'Stock quantity is required',
                  min: { value: 0, message: 'Stock cannot be negative' },
                })}
                className={`w-full nike-input font-mono ${errors.stock ? 'border-red-500' : ''}`}
              />
              {errors.stock && (
                <span className="text-red-500 text-xs mt-1 block font-semibold">{errors.stock.message}</span>
              )}
            </div>
            <div>
              <label className="block text-black text-xs font-bold uppercase tracking-wider mb-2">Category *</label>
              <select
                {...register('category')}
                className="w-full bg-white border border-neutral-200 rounded px-3 py-2.5 text-black text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black cursor-pointer"
              >
                <option value="SNEAKERS">SNEAKERS</option>
                <option value="RUNNING">RUNNING</option>
                <option value="CASUAL">CASUAL</option>
                <option value="FORMAL">FORMAL</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-black text-xs font-bold uppercase tracking-wider mb-2">Gender *</label>
              <select
                {...register('gender')}
                className="w-full bg-white border border-neutral-200 rounded px-3 py-2.5 text-black text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-black cursor-pointer"
              >
                <option value="Unisex">Unisex</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
              </select>
            </div>
            <div>
              <label className="block text-black text-xs font-bold uppercase tracking-wider mb-2">Color *</label>
              <input
                type="text"
                placeholder="e.g. Red, Core Black, Multicolor"
                {...register('color', { required: 'Color is required' })}
                className={`w-full nike-input ${errors.color ? 'border-red-500' : ''}`}
              />
              {errors.color && (
                <span className="text-red-500 text-xs mt-1 block font-semibold">{errors.color.message}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-black text-xs font-bold uppercase tracking-wider mb-2">Sizes (Comma separated) *</label>
              <input
                type="text"
                placeholder="7,8,9,10"
                {...register('sizes', { required: 'Sizes are required' })}
                className={`w-full nike-input font-mono ${errors.sizes ? 'border-red-500' : ''}`}
              />
              {errors.sizes && (
                <span className="text-red-500 text-xs mt-1 block font-semibold">{errors.sizes.message}</span>
              )}
            </div>
            <div>
              <label className="block text-black text-xs font-bold uppercase tracking-wider mb-2">Image path / URL</label>
              <input
                type="text"
                placeholder="e.g. /images/shoes/adidas-ultrboost.jpg"
                {...register('imageUrl')}
                className="w-full nike-input font-mono"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex space-x-3 border-t border-neutral-200 pt-5 mt-6">
            <Link
              to="/admin/products"
              className="flex-1 nike-btn-white text-center text-xs py-3"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 nike-btn-black text-xs flex items-center justify-center space-x-2 cursor-pointer shadow-md"
            >
              {loading ? (
                <span className="border-2 border-white border-t-transparent w-4 h-4 rounded-full animate-spin"></span>
              ) : (
                <>
                  <ShieldCheck size={14} />
                  <span>Update Product</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
