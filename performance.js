// Performance monitoring script
(function() {
  'use strict';
  
  // Track page load performance
  window.addEventListener('load', function() {
    // Get performance metrics
    const perfData = performance.getEntriesByType('navigation')[0];
    const paintMetrics = performance.getEntriesByType('paint');
    
    console.log('=== Performance Metrics ===');
    console.log('DOM Content Loaded:', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart, 'ms');
    console.log('Page Load Complete:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
    console.log('Total Load Time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
    
    // Log paint times if available
    paintMetrics.forEach(paint => {
      console.log(`${paint.name}:`, paint.startTime, 'ms');
    });
    
    // Track scroll performance
    let scrollCount = 0;
    let lastScrollTime = performance.now();
    
    const originalUpdateWealthCounter = window.updateWealthCounter;
    window.updateWealthCounter = function() {
      scrollCount++;
      const now = performance.now();
      if (now - lastScrollTime > 1000) { // Log every second
        console.log('Scroll events per second:', scrollCount);
        scrollCount = 0;
        lastScrollTime = now;
      }
      return originalUpdateWealthCounter.apply(this, arguments);
    };
  });
  
  // Monitor memory usage (if available)
  if (performance.memory) {
    setInterval(() => {
      const memory = performance.memory;
      console.log('Memory Usage:', {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + 'MB',
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + 'MB',
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + 'MB'
      });
    }, 5000);
  }
})(); 