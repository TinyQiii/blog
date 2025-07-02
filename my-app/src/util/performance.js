// 性能优化工具函数

/**
 * 防抖函数 - 延迟执行，避免频繁调用
 * @param {Function} func 要执行的函数
 * @param {number} wait 等待时间（毫秒）
 * @param {boolean} immediate 是否立即执行
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, wait, immediate = false) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

/**
 * 节流函数 - 限制函数执行频率
 * @param {Function} func 要执行的函数
 * @param {number} limit 限制时间（毫秒）
 * @returns {Function} 节流后的函数
 */
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * 懒加载图片
 * @param {string} src 图片源地址
 * @param {string} placeholder 占位图片
 * @returns {Promise} 图片加载完成的Promise
 */
export function lazyLoadImage(src, placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+') {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/**
 * 虚拟滚动优化 - 计算可见项目
 * @param {Array} items 所有项目
 * @param {number} containerHeight 容器高度
 * @param {number} itemHeight 项目高度
 * @param {number} scrollTop 滚动位置
 * @param {number} buffer 缓冲区大小
 * @returns {Object} 可见项目的开始和结束索引
 */
export function getVisibleRange(items, containerHeight, itemHeight, scrollTop, buffer = 5) {
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + buffer
  );
  
  return {
    startIndex,
    endIndex,
    visibleItems: items.slice(startIndex, endIndex + 1),
    offsetY: startIndex * itemHeight
  };
}

/**
 * 内存优化 - 清理对象引用
 * @param {Object} obj 要清理的对象
 */
export function clearObjectReferences(obj) {
  if (obj && typeof obj === 'object') {
    Object.keys(obj).forEach(key => {
      if (obj[key] && typeof obj[key] === 'object') {
        clearObjectReferences(obj[key]);
      }
      obj[key] = null;
    });
  }
}

/**
 * 批量DOM操作优化
 * @param {Function} operations 要执行的操作函数
 * @param {number} batchSize 批处理大小
 */
export function batchDOMOperations(operations, batchSize = 10) {
  return new Promise((resolve) => {
    let index = 0;
    
    function processBatch() {
      const endIndex = Math.min(index + batchSize, operations.length);
      
      for (let i = index; i < endIndex; i++) {
        operations[i]();
      }
      
      index = endIndex;
      
      if (index < operations.length) {
        requestAnimationFrame(processBatch);
      } else {
        resolve();
      }
    }
    
    requestAnimationFrame(processBatch);
  });
}

/**
 * 缓存函数结果
 * @param {Function} fn 要缓存的函数
 * @param {number} ttl 缓存时间（毫秒）
 * @returns {Function} 带缓存的函数
 */
export function memoize(fn, ttl = 5000) {
  const cache = new Map();
  
  return function(...args) {
    const key = JSON.stringify(args);
    const now = Date.now();
    
    if (cache.has(key)) {
      const { value, timestamp } = cache.get(key);
      if (now - timestamp < ttl) {
        return value;
      }
    }
    
    const result = fn.apply(this, args);
    cache.set(key, { value: result, timestamp: now });
    
    return result;
  };
}

/**
 * 性能监控
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
  }
  
  start(label) {
    this.metrics.set(label, performance.now());
  }
  
  end(label) {
    const startTime = this.metrics.get(label);
    if (startTime) {
      const duration = performance.now() - startTime;
      console.log(`${label}: ${duration.toFixed(2)}ms`);
      this.metrics.delete(label);
      return duration;
    }
    return 0;
  }
  
  measure(label, fn) {
    this.start(label);
    const result = fn();
    this.end(label);
    return result;
  }
}

/**
 * 资源预加载
 * @param {Array} resources 要预加载的资源列表
 */
export function preloadResources(resources) {
  resources.forEach(resource => {
    if (resource.type === 'image') {
      const img = new Image();
      img.src = resource.url;
    } else if (resource.type === 'script') {
      const script = document.createElement('script');
      script.src = resource.url;
      script.async = true;
      document.head.appendChild(script);
    } else if (resource.type === 'style') {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = resource.url;
      document.head.appendChild(link);
    }
  });
}

/**
 * 检测设备性能
 * @returns {Object} 设备性能信息
 */
export function getDevicePerformance() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  return {
    // 网络信息
    networkType: connection ? connection.effectiveType : 'unknown',
    downlink: connection ? connection.downlink : null,
    rtt: connection ? connection.rtt : null,
    
    // 硬件信息
    hardwareConcurrency: navigator.hardwareConcurrency || 1,
    deviceMemory: navigator.deviceMemory || null,
    
    // 屏幕信息
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    pixelRatio: window.devicePixelRatio || 1,
    
    // 浏览器信息
    userAgent: navigator.userAgent,
    platform: navigator.platform,
  };
}

/**
 * 根据设备性能调整动画
 * @param {string} animationType 动画类型
 * @returns {boolean} 是否启用动画
 */
export function shouldEnableAnimation(animationType = 'all') {
  const performance = getDevicePerformance();
  
  // 低端设备禁用复杂动画
  if (performance.hardwareConcurrency <= 2 || performance.deviceMemory <= 2) {
    return false;
  }
  
  // 慢速网络禁用预加载动画
  if (performance.networkType === 'slow-2g' || performance.networkType === '2g') {
    return animationType !== 'preload';
  }
  
  return true;
}

// 导出性能监控实例
export const performanceMonitor = new PerformanceMonitor(); 