import React from 'react';

const Filters = ({ categories, selectedCategory, sortBy, onCategoryChange, onSortChange }) => {
  const allCategories = ['全部', ...categories];
  
  const sortOptions = [
    { value: 'latest', label: '最新发布' },
    { value: 'popular', label: '最多浏览' },
    { value: 'likes', label: '最多点赞' },
    { value: 'oldest', label: '最早发布' },
  ];

  return (
    <section className="filters">
      <div className="container">
        <div className="filter-group">
          <label>新闻分类</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            {allCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>排序方式</label>
          <select 
            value={sortBy} 
            onChange={(e) => onSortChange(e.target.value)}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
};

export default Filters;
