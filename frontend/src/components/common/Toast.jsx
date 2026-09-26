import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback((message, type = 'success') => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setToast({ message, type });
    timerRef.current = setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  const closeToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-slideIn">
          <div className={`flex items-center space-x-3 p-4 rounded-lg shadow-xl border text-sm font-semibold max-w-sm ${
            toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
            toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
            toast.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
            'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            {toast.type === 'success' && <CheckCircle size={18} className="text-green-600 shrink-0" />}
            {toast.type === 'error' && <AlertCircle size={18} className="text-red-500 shrink-0" />}
            {toast.type === 'warning' && <AlertTriangle size={18} className="text-amber-500 shrink-0" />}
            {toast.type === 'info' && <Info size={18} className="text-blue-500 shrink-0" />}
            
            <span className="flex-grow text-left">{toast.message}</span>
            
            <button 
              onClick={closeToast}
              className="text-gray-400 hover:text-gray-600 shrink-0 bg-transparent border-0 cursor-pointer p-0.5"
              aria-label="Close Notification"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
