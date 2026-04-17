import React, { useEffect } from 'react';

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const NewsModal = ({ article, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);
  
  if (!article) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="modal-category">{article.category}</span>
            <h3 style={{ marginTop: '10px', fontSize: '1.2rem', color: '#1a202c' }}>
              {article.title}
            </h3>
          </div>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="modal-image"
            onError={(e) => {
              e.target.src = `https://picsum.photos/seed/modal${article.id}/800/400`;
            }}
          />
          <div className="modal-meta">
            <span className="news-card-meta-item">
              👤 作者: {article.author}
            </span>
            <span className="news-card-meta-item">
              ⏰ 发布时间: {formatTime(article.publishTime)}
            </span>
            <span className="news-card-meta-item">
              👁️ 浏览量: {article.views.toLocaleString()}
            </span>
            <span className="news-card-meta-item">
              👍 点赞数: {article.likes}
            </span>
          </div>
          <div className="modal-content">
            <p>{article.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsModal;
