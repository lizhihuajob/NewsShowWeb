import React from 'react';

const Pagination = ({ currentPage, totalPages, totalItems, onPageChange }) => {
  if (totalPages <= 1) return null;
  
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };
  
  const pageNumbers = getPageNumbers();
  
  return (
    <div className="pagination">
      <button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
      >
        上一页
      </button>
      
      {pageNumbers[0] > 1 && (
        <>
          <button 
            onClick={() => onPageChange(1)}
            className={currentPage === 1 ? 'active' : ''}
          >
            1
          </button>
          {pageNumbers[0] > 2 && <span>...</span>}
        </>
      )}
      
      {pageNumbers.map(page => (
        <button 
          key={page}
          onClick={() => onPageChange(page)}
          className={currentPage === page ? 'active' : ''}
        >
          {page}
        </button>
      ))}
      
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span>...</span>}
          <button 
            onClick={() => onPageChange(totalPages)}
            className={currentPage === totalPages ? 'active' : ''}
          >
            {totalPages}
          </button>
        </>
      )}
      
      <button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
      >
        下一页
      </button>
      
      <span className="pagination-info">
        共 {totalItems} 条新闻
      </span>
    </div>
  );
};

export default Pagination;
