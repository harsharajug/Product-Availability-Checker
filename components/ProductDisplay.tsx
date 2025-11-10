import React from 'react';
import { ProductInfo } from '../types';
import { TagIcon, CheckCircleIcon, XCircleIcon, CurrencyDollarIcon } from './icons';

interface ProductDisplayProps {
  product: ProductInfo;
}

const getAvailabilityStyles = (availability: string) => {
    const lowerAvailability = availability.toLowerCase();
    if (lowerAvailability.includes('in stock')) {
        return {
            bgColor: 'bg-green-100 dark:bg-green-900/40',
            textColor: 'text-green-800 dark:text-green-300',
            icon: <CheckCircleIcon className="h-6 w-6" />,
        };
    }
    if (lowerAvailability.includes('unavailable') || lowerAvailability.includes('out of stock')) {
        return {
            bgColor: 'bg-red-100 dark:bg-red-900/40',
            textColor: 'text-red-800 dark:text-red-300',
            icon: <XCircleIcon className="h-6 w-6" />,
        };
    }
    return {
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/40',
        textColor: 'text-yellow-800 dark:text-yellow-300',
        icon: <TagIcon className="h-6 w-6" />,
    };
};


export const ProductDisplay: React.FC<ProductDisplayProps> = ({ product }) => {
  const availabilityStyles = getAvailabilityStyles(product.availability);
  
  const isValidImageUrl = product.imageUrl && product.imageUrl.startsWith('http');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-transform duration-500 ease-in-out animate-fade-in-up">
      <div className="grid md:grid-cols-2">
        <div className="p-6 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
          <img
            src={isValidImageUrl ? product.imageUrl : `https://picsum.photos/400/400?random=${product.title}`}
            alt={product.title}
            className="max-h-80 w-auto object-contain rounded-lg"
          />
        </div>
        <div className="p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight mb-4">{product.title}</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
                <div className={`p-2 rounded-full ${availabilityStyles.bgColor} ${availabilityStyles.textColor}`}>
                    {availabilityStyles.icon}
                </div>
                <div className="ml-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Availability</p>
                    <p className={`text-lg font-semibold ${availabilityStyles.textColor}`}>{product.availability}</p>
                </div>
            </div>

            <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
                    <CurrencyDollarIcon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                    <p className="text-lg font-semibold text-blue-800 dark:text-blue-300">{product.price}</p>
                </div>
            </div>
          </div>

        </div>
      </div>
      {/* Fix: Add sources display as required by Google Search grounding guidelines */}
      {product.sources && product.sources.length > 0 && (
        <div className="p-6 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Sources:</h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            {product.sources.map((source, index) => (
              <li key={index}>
                <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                  {source.title || source.uri}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Fix: Removed invalid `jsx` prop from style tag. This is not a Next.js project. */}
      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
