import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import Header from './components/Header';
import Filters from './components/Filters';
import FeaturedNews from './components/FeaturedNews';
import NewsCard from './components/NewsCard';
import Pagination from './components/Pagination';
import NewsModal from './components/NewsModal';

const App = () => {
  const [news, setNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [newArticleIds, setNewArticleIds] = useState(new Set());
  const [selectedArticle, setSelectedArticle] = useState(null);
  
  const itemsPerPage = 10;
  
  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        category: selectedCategory,
        sort: sortBy,
        page: currentPage,
        limit: itemsPerPage,
      });
      
      const response = await fetch(`/api/news?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setNews(data.data);
        setTotalItems(data.total);
        if (categories.length === 0) {
          setCategories(data.categories);
        }
      }
    } catch (error) {
      console.error('获取新闻失败:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, sortBy, currentPage, categories.length]);
  
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);
  
  useEffect(() => {
    const socket = io({
      path: '/socket.io',
      transports: ['websocket', 'polling'],
    });
    
    socket.on('connect', () => {
      console.log('已连接到服务器');
      setIsConnected(true);
    });
    
    socket.on('disconnect', () => {
      console.log('与服务器断开连接');
      setIsConnected(false);
    });
    
    socket.on('categories', (data) => {
      setCategories(data);
    });
    
    socket.on('newArticle', (article) => {
      console.log('收到新新闻:', article.title);
      
      setNewArticleIds(prev => new Set([...prev, article.id]));
      
      if (selectedCategory === '全部' || selectedCategory === article.category) {
        if (sortBy === 'latest') {
          setNews(prev => [article, ...prev].slice(0, itemsPerPage));
          setTotalItems(prev => prev + 1);
        }
      }
      
      setTimeout(() => {
        setNewArticleIds(prev => {
          const next = new Set(prev);
          next.delete(article.id);
          return next;
        });
      }, 5000);
    });
    
    return () => {
      socket.disconnect();
    };
  }, [selectedCategory, sortBy]);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortBy]);
  
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };
  
  const handleSortChange = (sort) => {
    setSortBy(sort);
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };
  
  const handleCloseModal = () => {
    setSelectedArticle(null);
  };
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const featuredArticle = sortBy === 'latest' && selectedCategory === '全部' && news.length > 0 ? news[0] : null;
  const displayNews = sortBy === 'latest' && selectedCategory === '全部' ? news.slice(1) : news;
  
  return (
    <div className="App">
      <Header isConnected={isConnected} newsCount={totalItems} />
      
      <Filters
        categories={categories}
        selectedCategory={selectedCategory}
        sortBy={sortBy}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
      />
      
      <main className="container">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>加载中...</p>
          </div>
        ) : (
          <>
            {featuredArticle && (
              <FeaturedNews 
                article={featuredArticle} 
                onClick={handleArticleClick}
              />
            )}
            
            {displayNews.length > 0 ? (
              <div className="news-grid">
                {displayNews.map(article => (
                  <NewsCard
                    key={article.id}
                    article={article}
                    isNew={newArticleIds.has(article.id)}
                    onClick={handleArticleClick}
                  />
                ))}
              </div>
            ) : (
              <div className="no-news">
                <h3>暂无新闻</h3>
                <p>当前分类下暂无新闻内容，请尝试其他分类。</p>
              </div>
            )}
            
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>
      
      <footer className="footer">
        <div className="container">
          <p>© 2024 实时新闻门户 - 具备实时更新、模块化文章布局和动态排序选项</p>
          <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>
            使用 React + Express + Socket.io 构建 | 支持 Docker 部署
          </p>
        </div>
      </footer>
      
      {selectedArticle && (
        <NewsModal
          article={selectedArticle}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default App;
