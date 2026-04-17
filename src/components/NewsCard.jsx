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

const NewsCard = ({ article, isNew, onClick }) => {
  return (
    <article 
      className={`news-card ${isNew ? 'new' : ''}`}
      onClick={() => onClick(article)}
    >
      <img 
        src={article.imageUrl} 
        alt={article.title} 
        className="news-card-image"
        onError={(e) => {
          e.target.src = `https://picsum.photos/seed/fallback${article.id}/400/250`;
        }}
      />
      <div className="news-card-content">
        <span className="news-card-category">{article.category}</span>
        <h3 className="news-card-title">{article.title}</h3>
        <p className="news-card-summary">{article.summary}</p>
        <div className="news-card-meta">
          <span className="news-card-meta-item">
            👤 {article.author}
          </span>
          <span className="news-card-meta-item">
            ⏰ {formatTime(article.publishTime)}
          </span>
          <span className="news-card-meta-item">
            👁️ {article.views.toLocaleString()}
          </span>
          <span className="news-card-meta-item">
            👍 {article.likes}
          </span>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
