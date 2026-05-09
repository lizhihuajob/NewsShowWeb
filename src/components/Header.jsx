import React from 'react';

const Header = ({ 
  isConnected, 
  newsCount, 
  categories, 
  selectedCategory, 
  sortBy, 
  onCategoryChange, 
  onSortChange 
}) => {
  const allCategories = ['全部', ...categories];
  
  const sortOptions = [
    { value: 'latest', label: '最新发布' },
    { value: 'popular', label: '最多浏览' },
    { value: 'likes', label: '最多点赞' },
    { value: 'oldest', label: '最早发布' },
  ];

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <div className="logo">
            <span className="logo-icon">📰</span>
            <span className="logo-text">实时新闻</span>
          </div>
          <div className="status-bar">
            <div 
              className="status-dot" 
              style={{ backgroundColor: isConnected ? '#34C759' : '#FF3B30' }}
            ></div>
            <span className="status-text">
              {isConnected ? '实时更新中' : '连接断开'}
            </span>
            <span className="news-count">
              共 {newsCount} 条新闻
            </span>
          </div>
        </div>
        
        <div className="header-right">
          <div className="filter-wrapper">
            <label className="filter-label">分类</label>
            <select 
              className="apple-select"
              value={selectedCategory} 
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              {allCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-wrapper">
            <label className="filter-label">排序</label>
            <select 
              className="apple-select"
              value={sortBy} 
              onChange={(e) => onSortChange(e.target.value)}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
