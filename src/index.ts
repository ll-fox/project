import React from 'react';
import ReactDOM from 'react-dom/client';
import { IntelligentChat } from './client/App';
import { ChatConfig } from './config';

// 扩展配置接口
export interface InitOptions extends ChatConfig {
  routeWhitelist?: string[]; // 路由白名单，支持字符串或正则表达式字符串
}

let chatRoot: ReactDOM.Root | null = null;
let chatContainer: HTMLElement | null = null;

// 添加全局变量存储原始方法
let originalPushState: typeof history.pushState;
let originalReplaceState: typeof history.replaceState;
let handlePopState: () => void;

/**
 * 初始化智能问答SDK
 * @param options 配置选项
 */
export function initIntelligentChat(options: InitOptions): void {
  // 如果已经初始化，先销毁
  if (chatRoot) {
    destroyIntelligentChat();
  }

  // 创建容器元素
  chatContainer = document.createElement('div');
  chatContainer.id = 'intelligent-chat-container';
  
  // 应用位置和z-index配置
  if (options.position) {
    chatContainer.style.position = 'fixed';
    chatContainer.style.bottom = `${options.position.bottom || 20}px`;
    chatContainer.style.right = `${options.position.right || 20}px`;
  }
  
  if (options.zIndex) {
    chatContainer.style.zIndex = options.zIndex.toString();
  }
  
  document.body.appendChild(chatContainer);

  // 检查当前路由是否在白名单中
  const shouldRender = checkRouteWhitelist(options.routeWhitelist);
  
  if (!shouldRender) {
    // 如果不在白名单中，隐藏组件
    if (chatContainer) {
      chatContainer.style.display = 'none';
    }
    return;
  }

  // 显示容器
  if (chatContainer) {
    chatContainer.style.display = 'block';
  }

  // 渲染组件
  if (!chatRoot) {
    chatRoot = ReactDOM.createRoot(chatContainer);
  }
  
  chatRoot.render(
    React.createElement(React.StrictMode, null, 
      React.createElement(IntelligentChat, { config: options })
    )
  );

  // 监听路由变化
  setupRouteListener(options.routeWhitelist);
}

/**
 * 检查当前路由是否在白名单中
 */
function checkRouteWhitelist(whitelist?: string[]): boolean {
  if (!whitelist || whitelist.length === 0) {
    return true; // 如果没有设置白名单，默认显示
  }

  const currentPath = window.location.pathname;
  
  return whitelist.some(route => {
    if (route.startsWith('^') && route.endsWith('$')) {
      // 处理正则表达式
      const regex = new RegExp(route);
      return regex.test(currentPath);
    }
    // 处理普通字符串匹配
    return currentPath.includes(route);
  });
}

/**
 * 设置路由变化监听
 */
function setupRouteListener(whitelist?: string[]): void {
  // 存储原始方法
  originalPushState = history.pushState;
  originalReplaceState = history.replaceState;
  
  handlePopState = () => updateVisibility(whitelist);

  history.pushState = function(...args) {
    originalPushState.apply(this, args);
    updateVisibility(whitelist);
  };

  history.replaceState = function(...args) {
    originalReplaceState.apply(this, args);
    updateVisibility(whitelist);
  };

  window.addEventListener('popstate', handlePopState);
}

/**
 * 根据当前路由更新组件可见性
 */
function updateVisibility(whitelist?: string[]): void {
  const shouldRender = checkRouteWhitelist(whitelist);
  
  if (chatContainer) {
    chatContainer.style.display = shouldRender ? 'block' : 'none';
  }
}

// 添加销毁方法
export function destroyIntelligentChat(): void {
  if (chatRoot) {
    chatRoot.unmount();
    chatRoot = null;
  }
  
  if (chatContainer) {
    document.body.removeChild(chatContainer);
    chatContainer = null;
  }
  
  // 清理路由监听
  if (originalPushState && originalReplaceState) {
    history.pushState = originalPushState;
    history.replaceState = originalReplaceState;
  }
  
  window.removeEventListener('popstate', handlePopState);
}

// 导出配置类型
export type { ChatConfig } from './config'; 