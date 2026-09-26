import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProductCard from '../../components/common/ProductCard';
import { Heart, ArrowLeft } from 'lucide-react';

export default function Wishlist() {
  const { wishlist, user } = useAuth();

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-100 py-8 px-6">
        <div className="max-w-8xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="text-left">
            <Link to="/shop" className="flex items-center text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-black transition-colors mb-2 gap-1">
              <ArrowLeft size={12} />
              <span>Back to Shop</span>
            </Link>
            <h1 className="text-3xl font-black text-black uppercase tracking-tighter flex items-center gap-2">
              <Heart size={28} className="fill-black text-black" />
              <span>My Favorites ({wishlist.length})</span>
            </h1>
          </div>
          {user && (
            <p className="text-sm text-gray-400 font-medium">
              Curated items saved under <strong className="text-black font-semibold">{user.email}</strong>
            </p>
          )}
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-8xl mx-auto px-6 py-12">
        {wishlist.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 max-w-md mx-auto">
            <div className="w-20 h-20 bg-neutral-50 border border-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <Heart size={36} strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-extrabold text-black uppercase tracking-wider">Your Wishlist is Empty</h2>
            <p className="text-sm text-gray-400 mt-2 leading-relaxed">
              Explore our premium collection of Soltrix shoes and save your favorite styles here for later checkout.
            </p>
            <Link to="/shop" className="inline-block mt-8 border border-black bg-black text-white hover:bg-white hover:text-black font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded transition-all duration-200">
              Explore Products
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {wishlist.map((item) => (
              <div key={item.id} className="relative group">
                <ProductCard product={item.product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
