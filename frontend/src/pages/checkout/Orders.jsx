import { useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api';
import { ShoppingBag, Calendar, MapPin, CheckCircle, Clock, Truck, ShieldAlert } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.orders.getMyOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Could not retrieve your orders. Make sure the backend is active.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="flex items-center space-x-1 text-xxs font-extrabold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            <Clock size={10} />
            <span>Pending</span>
          </span>
        );
      case 'APPROVED':
        return (
          <span className="flex items-center space-x-1 text-xxs font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            <CheckCircle size={10} />
            <span>Approved</span>
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="flex items-center space-x-1 text-xxs font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            <Truck size={10} />
            <span>Shipped</span>
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="flex items-center space-x-1 text-xxs font-extrabold text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            <CheckCircle size={10} />
            <span>Delivered</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="flex items-center space-x-1 text-xxs font-extrabold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            <ShieldAlert size={10} />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="text-xxs font-extrabold text-gray-500 bg-neutral-100 border border-neutral-300 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {status}
          </span>
        );
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12 text-left">
        
        <h1 className="text-3xl font-black text-black uppercase tracking-tighter mb-8 border-b border-neutral-100 pb-4">
          Order History
        </h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="border-3 border-black border-t-transparent w-8 h-8 rounded-full animate-spin"></div>
            <span className="mt-4 text-xs font-bold uppercase tracking-wider text-gray-400">Loading order history...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12 border border-red-100 bg-red-50/50 rounded-lg">
            <p className="text-sm font-semibold text-red-500">{error}</p>
            <button
              onClick={fetchOrders}
              className="nike-btn-black mt-4 text-xs cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 border border-neutral-200 rounded-lg bg-neutral-50 max-w-xl mx-auto">
            <div className="w-12 h-12 bg-white border border-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <ShoppingBag size={20} />
            </div>
            <h2 className="text-base font-bold text-black uppercase tracking-tight">No orders placed yet</h2>
            <p className="text-gray-500 mt-2 text-xs max-w-xs mx-auto">
              Once you place an order, you can review its status and invoice tracking logs right here.
            </p>
          </div>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-neutral-200 rounded-lg overflow-hidden hover:border-neutral-300 transition-colors"
              >
                
                {/* Header card summary toggle */}
                <div
                  onClick={() => toggleExpand(order.id)}
                  className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-bold text-black uppercase tracking-wider">Order #{order.id}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xxs text-gray-400 font-mono font-bold">
                      <span className="flex items-center uppercase font-sans"><Calendar size={11} className="mr-1 text-black" /> {order.orderDate ? new Date(order.orderDate).toLocaleDateString('en-IN', {
                        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      }) : 'Recent'}</span>
                      <span className="font-sans font-black text-black">Total: ₹{(order.totalAmount || order.totalPrice || 0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <span className="text-xxs font-extrabold uppercase tracking-widest text-black hover:underline cursor-pointer">
                    {expandedOrder === order.id ? 'Hide Details ▲' : 'View Details ▼'}
                  </span>
                </div>

                {/* Expanded items view */}
                {expandedOrder === order.id && (
                  <div className="border-t border-neutral-200 p-5 bg-white space-y-4 animate-slideDown">
                    {/* Address details */}
                    <div className="flex items-start space-x-2 text-xs text-gray-600 font-semibold">
                      <MapPin size={14} className="text-black mt-0.5 shrink-0" />
                      <div>
                        <span className="text-gray-400 uppercase text-xxs tracking-wider font-extrabold">Ship to: </span>
                        <span>{order.shippingAddress}</span>
                      </div>
                    </div>

                    {/* Shoe Items details */}
                    <div className="space-y-2.5">
                      <h4 className="text-xxs font-extrabold text-gray-400 uppercase tracking-widest border-b border-neutral-100 pb-1.5">Items in Order</h4>
                      <div className="divide-y divide-neutral-100">
                        {(order.orderItems || []).map((item) => (
                          <div key={item.id} className="py-3 flex justify-between items-center text-xs font-semibold">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded bg-white border border-neutral-200 p-1 flex items-center justify-center shrink-0">
                                <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-contain" />
                              </div>
                              <div className="text-left">
                                <h5 className="font-bold text-black uppercase truncate w-44 md:w-64">{item.product.name}</h5>
                                <p className="text-gray-400 text-xxs font-mono font-bold mt-0.5 uppercase font-sans">Brand: {item.product.brand} | Size: UK {item.size} | Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <span className="font-mono text-black font-extrabold">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
