import ProductCard from './ProductCard';

export default function ProductGrid({ products = [] }) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 border border-neutral-200 rounded-lg bg-neutral-50 w-full">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">No products available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
