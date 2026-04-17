import React from 'react';

const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)} 天前`;
  
  return date.toLocaleDateString('zh-CN');
};

const FeaturedNews = ({ article, onClick }) => {
  if (!article) return null;
  
  return (
    <article className="featured-news" onClick={() => onClick(article)}>
      <img 
        src={article.imageUrl} 
        alt={article.title} 
        className="featured-news-image"
        onError={(e) => {
          e.target.src = `https://picsum.photos/seed/fallback${article.id}/800/400`;
        }}
      />
      <div className="featured-news-content">
        <span className="featured-news-category">⭐ 头条推荐</span>
        <h2 className="featured-news-title">{article.title}</h2>
        <p className="featured-news-summary">{article.content}</p>
        <div className="news-card-meta">
          <span className="news-card-meta-item">
            👤 {article.author}
          </span>
          <span className="news-card-meta-item">
            📂 {article.category}
          </span>
          <span className="news-card-meta-item">
            ⏰ {formatTime(article.publishTime)}
          </span>
          <span className="news-card-meta-item">
            👁️ {article.views.toLocaleString()}
          </span>
        </div>
      </div>
    </article>
  );
};

export default FeaturedNews;
