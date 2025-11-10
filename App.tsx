
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ProductDisplay } from './components/ProductDisplay';
import { Loader } from './components/Loader';
import { fetchProductInfoFromUrl } from './services/geminiService';
import { ProductInfo } from './types';
import { AmazonIcon } from './components/icons';

const App: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckAvailability = useCallback(async () => {
    if (!url) {
      setError('Please enter an Amazon product URL.');
      return;
    }

    // Basic URL validation
    try {
      const parsedUrl = new URL(url);
      if (!parsedUrl.hostname.includes('amazon.')) {
        setError('Please enter a valid Amazon product URL.');
        return;
      }
    } catch (_) {
      setError('Invalid URL format. Please enter a valid Amazon product URL.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProductInfo(null);

    try {
      const info = await fetchProductInfoFromUrl(url);
      setProductInfo(info);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch product information. The URL might be invalid, the product page structure may have changed, or there was an API error.');
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto text-center">
           <div className="flex justify-center items-center gap-4 mb-4">
            <AmazonIcon className="h-12 w-12 text-yellow-500" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Product Availability Checker
            </h1>
          </div>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Paste an Amazon product link below to get its latest price and availability status, powered by Gemini.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mt-8">
          <SearchBar
            url={url}
            setUrl={setUrl}
            onSubmit={handleCheckAvailability}
            isLoading={isLoading}
          />

          {error && (
            <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}
        </div>

        <div className="mt-8">
          {isLoading && <Loader />}
          {productInfo && (
            <div className="max-w-3xl mx-auto">
              <ProductDisplay product={productInfo} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
