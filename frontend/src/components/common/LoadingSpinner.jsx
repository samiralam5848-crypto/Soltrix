export default function LoadingSpinner({ fullPage = false, message = 'Loading...' }) {
  if (fullPage) {
    return (
      <div className="bg-white flex flex-col items-center justify-center min-h-[60vh] py-20">
        <div className="border-3 border-black border-t-transparent w-10 h-10 rounded-full animate-spin"></div>
        <span className="mt-4 text-xs font-bold uppercase tracking-wider text-gray-400">{message}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <div className="border-2 border-black border-t-transparent w-5 h-5 rounded-full animate-spin"></div>
      <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">{message}</span>
    </div>
  );
}
