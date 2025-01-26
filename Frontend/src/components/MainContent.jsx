import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Skeleton Loader Component for News Cards
const SkeletonLoader = () => (
  <div className="bg-white p-4 rounded-lg shadow-md animate-pulse">
    <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-300 rounded w-5/6 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
    <div className="h-48 bg-gray-300 rounded mb-4"></div>
    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
  </div>
);

const MainContent = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch news from the backend when the component mounts
  useEffect(() => {
    axios.get('http://localhost:5000/api/fetch-news')
      .then((response) => {
        setNews(response.data); // Store the fetched news in state
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching news:', error);
        setError('Failed to load news. Please try again later.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main News Section with Skeleton Loader */}
        <section className="lg:col-span-3 grid grid-cols-1 gap-4">
          {[...Array(5)].map((_, idx) => (
            <SkeletonLoader key={idx} />
          ))}
        </section>

        {/* Sidebar with Skeleton Loader */}
        <aside className="lg:col-span-1 space-y-4">
          <h2 className="font-semibold text-lg">All Updates</h2>
          {[...Array(3)].map((_, idx) => (
            <SkeletonLoader key={idx} />
          ))}
        </aside>
      </main>
    );
  }

  if (error) {
    return <p className="text-center text-lg text-red-600">{error}</p>;
  }

  return (
    <main className="p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* Main News Section */}
      <section className="lg:col-span-3 grid grid-cols-1 gap-4">
        {news.length > 0 ? (
          news.map((article) => (
            <div key={article._id || article.title} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">{article.title}</h3>
              <p className="text-gray-600 mt-2">{article.description}</p>
              <p className="text-gray-500 mt-2">By {article.author || 'Unknown'}</p>
              <img
                src={article.image_url || 'https://via.placeholder.com/500'} // Use image_url from database
                alt={article.title || 'News'}
                className="mt-4 w-full h-72 object-cover rounded"
              />
              {/* <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 mt-2 block">Read More</a> */}
            </div>
          ))
        ) : (
          <p className="text-center text-lg">No news available</p>
        )}
      </section>

      {/* Sidebar with Additional News Updates */}
      <aside className="lg:col-span-1 space-y-4">
        <h2 className="font-semibold text-lg">All Updates</h2>
        {news.length > 0 ? (
          news.map((article) => (
            <div key={article._id || article.title} className="bg-gray-100 p-4 rounded">
              <h3 className="font-semibold">{article.title}</h3>
              <p className="text-gray-600">{article.description}</p>
              <p className="text-gray-500">By {article.author || 'Unknown'}</p>
              {/* <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-600">Read More</a> */}
            </div>
          ))
        ) : (
          <p className="text-center text-lg">No updates available</p>
        )}
      </aside>
    </main>
  );
};

export default MainContent;
