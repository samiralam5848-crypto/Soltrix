import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract order from routing state
  const order = location.state?.order;

  // Fallback if accessed directly without state
  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center bg-white">
        <div className="border border-neutral-200 p-8 rounded-lg bg-neutral-50">
          <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">No order details found.</p>
          <Link to="/shop" className="nike-btn-black mt-4 inline-flex text-xs">
            Go to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-[75vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md border border-neutral-200 rounded-lg p-8 shadow-sm text-center">
        
        {/* Success Icon */}
        <div className="w-16 h-16 bg-neutral-100 border border-neutral-300 rounded-full flex items-center justify-center mx-auto mb-6 text-black">
          <CheckCircle size={32} strokeWidth={2.5} />
        </div>

        {/* Header */}
        <h2 className="text-2xl font-black uppercase tracking-tight text-black">
          Order Confirmed
        </h2>
        <p className="text-xs font-semibold text-gray-500 mt-2 uppercase tracking-wider">
          Thank you for shopping with Soltrix!
        </p>

        {/* Invoice Summary Block */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-5 my-6 text-left space-y-3.5 text-xs font-mono text-gray-800">
          <div className="flex justify-between border-b border-neutral-200 pb-2">
            <span className="text-gray-400 font-sans font-bold uppercase tracking-wider text-xxs">Order Number</span>
            <span className="font-bold font-sans">#{order.id}</span>
          </div>
          <div className="flex justify-between border-b border-neutral-200 pb-2">
            <span className="text-gray-400 font-sans font-bold uppercase tracking-wider text-xxs">Total Price</span>
            <span className="font-bold text-black text-sm">₹{(order.totalAmount || order.totalPrice || 0).toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between border-b border-neutral-200 pb-2">
            <span className="text-gray-400 font-sans font-bold uppercase tracking-wider text-xxs">Status</span>
            <span className="text-indigo-600 font-sans font-black uppercase tracking-wider text-xxs">{order.status}</span>
          </div>
          <div className="text-left pt-1">
            <span className="text-gray-400 font-sans font-bold uppercase tracking-wider text-xxs block mb-1">Deliver To</span>
            <span className="text-gray-600 block text-[11px] leading-relaxed truncate font-sans" title={order.shippingAddress}>
              {order.shippingAddress}
            </span>
          </div>
        </div>

        {/* Call to Actions */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/orders')}
            className="w-full nike-btn-black text-xs flex items-center justify-center space-x-2 cursor-pointer shadow-md"
          >
            <ShieldCheck size={14} />
            <span>Track Order Status</span>
          </button>
          
          <Link
            to="/shop"
            className="w-full nike-btn-white text-xs flex items-center justify-center space-x-2 cursor-pointer"
          >
            <ShoppingBag size={14} />
            <span>Continue Shopping</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
