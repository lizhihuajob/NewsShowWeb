import React from 'react';

const Header = ({ isConnected, newsCount }) => {
  return (
    <header className="header">
      <div className="container">
        <h1>📰 实时新闻门户</h1>
        <div className="real-time-indicator">
          <div className="dot" style={{ backgroundColor: isConnected ? '#4ade80' : '#f87171' }}></div>
          <span>{isConnected ? '实时连接中' : '连接断开'}</span>
          <span style={{ marginLeft: '20px' }}>当前新闻数: {newsCount}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
