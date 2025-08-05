try {

  // Modern browser support - no complex fallbacks needed

  let yale = null;
  let yaleCounter = null;
  let yaleCounterStart = null;

const babies = document.getElementById('babies-wrapper');
const babyCounter = document.getElementById('baby-counter');

const thousand = new Intl.NumberFormat('en-US');
const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

let additionalInstructionsShown = false;

// Function to get Yale element with fallback
function getYaleElement() {
  if (!yale) {
    yale = document.getElementById('yale');
    console.log('Getting Yale element:', !!yale);
  }
  return yale;
}

// Function to get Yale counter with fallback
function getYaleCounter() {
  if (!yaleCounter) {
    yaleCounter = document.getElementById('yale-counter');
  }
  return yaleCounter;
}

// Function to get Yale counter start with fallback
function getYaleCounterStart() {
  if (!yaleCounterStart) {
    yaleCounterStart = document.getElementById('yale-counter-start');
  }
  return yaleCounterStart;
}

// Modern browser event handling with performance optimizations

function detectConfusedUser(e, timer) {
  if (!additionalInstructionsShown) {
    additionalInstructionsShown = true;

    setTimeout(function(){
      if (window.scrollX < 1) {
        var instructions = document.getElementById('instructions');
        if (instructions) {
          instructions.className += " show";
        }
      }
    }, timer);
  }
}

function detectSlightlyConfusedUser(e, timer) {
  detectConfusedUser(e, 2000);
}

function detectVeryConfusedUser(e, timer) {
  detectConfusedUser(e, 4500);
}

// Modern event binding with passive listeners for better performance
if (window.innerWidth > 450) {
  document.addEventListener("mousemove", detectVeryConfusedUser, {once: true, passive: true});
  document.addEventListener("mousewheel", detectSlightlyConfusedUser, {once: true, passive: true});
  document.addEventListener("DOMMouseScroll", detectSlightlyConfusedUser, {once: true, passive: true});
}

// Throttled scroll handler for better performance
let scrollTimeout;
window.addEventListener('scroll', function(){
  if (scrollTimeout) return; // Skip if already scheduled
  
  scrollTimeout = requestAnimationFrame(() => {
    updateWealthCounter();
    updateInfoboxFlow();
    initializeVisibleBlocks();
    scrollTimeout = null;
  });
});

// Track manual scroll position for horizontal scrolling
let manualScrollPosition = 0;

// Also listen for horizontal scroll specifically with passive listener
window.addEventListener('wheel', function(e) {
  // Check if we're on mobile (vertical scrolling)
  const isMobile = window.innerWidth <= 450;
  
  if (isMobile) {
    // On mobile, track vertical scroll
    manualScrollPosition += e.deltaY;
    updateWealthCounter(); // Always update counter on wheel events
    updateInfoboxFlow();
  } else {
    // On desktop, track horizontal scroll
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      manualScrollPosition += e.deltaX;
    }
    
    updateWealthCounter(); // Always update counter on wheel events
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      updateInfoboxFlow();
    }
  }
}, { passive: true });

// Add touch events for mobile with passive listener
window.addEventListener('touchmove', function(e) {
  updateWealthCounter();
}, { passive: true });

// Add keyboard events for arrow keys
window.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    updateWealthCounter();
  }
}, { passive: true });

if (babies && babyCounter) {
  babies.addEventListener('scroll', function(){
    const isMobile = window.innerWidth <= 450;
    const bgSize = (isMobile) ? 68 : 160;
    babyCounter.innerHTML = thousand.format(Math.floor(babies.scrollTop / bgSize * 5));
  });
}

// Track previous scroll position for direction detection
let previousScrollPosition = 0;

// Mobile wealth bar height calculation function
function calculateMobileWealthBarHeight(value) {
  const isMobile = window.innerWidth <= 450;
  if (!isMobile) return null;
  
  // Use display width as base dimension
  const displayWidth = window.innerWidth;
  const billionValue = 1000000000; // $1 billion as reference
  
  // Calculate height based on wealth ratio to $1 billion
  const proportion = value / billionValue;
  
  // Base height calculation using display width
  // $1 billion gets 60% of display width height
  const billionHeight = displayWidth * 0.6; // 60% of display width for $1 billion
  const height = Math.max(40, proportion * billionHeight); // Minimum 40px
  
  return Math.round(height);
}

// Function to update mobile wealth bar heights
function updateMobileWealthBarHeights() {
  const isMobile = window.innerWidth <= 450;
  if (!isMobile) return;
  
  // Calculate heights based on values - focus on 4 main bars
  const wealthBars = {
    'one-thousand': 1000,
    'median-wage': 72000,
    'million': 1000000,
    'billion': 1000000000
  };
  
  // Set CSS custom properties for mobile heights
  Object.keys(wealthBars).forEach(key => {
    const height = calculateMobileWealthBarHeight(wealthBars[key]);
    if (height) {
      document.documentElement.style.setProperty(
        `--mobile-${key}-height`, 
        height + 'px'
      );
    }
  });
}

function updateWealthCounter() {
  var yaleElement = getYaleElement();
  var yaleCounterElement = getYaleCounter();
  var isMobile = window.innerWidth <= 450;

  if (yaleElement && yaleCounterElement) {
    if (isMobile) {
      // Mobile: Use vertical scroll position with mobile-specific logic
      var yaleRect = yaleElement.getBoundingClientRect();
      var yaleTop = yaleRect.top;
      var viewportHeight = window.innerHeight;
      
      // Show counter when the Yale element is visible in the viewport
      var shouldShow = yaleTop <= viewportHeight && yaleTop >= -yaleElement.offsetHeight;
      var wasVisible = yaleCounterElement.style.display === 'block';
      
      if (shouldShow && !wasVisible) {
        // Show counter
        yaleCounterElement.style.display = 'block';
        console.log('Mobile counter first appeared at:', {
          yaleTop: yaleTop.toFixed(2),
          viewportHeight: viewportHeight,
          scrollTop: window.pageYOffset
        });
      } else if (!shouldShow && wasVisible) {
        // Hide counter when Yale element is not visible
        yaleCounterElement.style.display = 'none';
      }
      
      // Mobile counter positioning and styling
      if (isMobile) {
        yaleCounterElement.style.position = 'fixed';
        yaleCounterElement.style.bottom = '10px';
        yaleCounterElement.style.left = '10px';
        yaleCounterElement.style.top = 'auto';
        yaleCounterElement.style.right = 'auto';
        yaleCounterElement.style.transform = 'none';
        yaleCounterElement.style.zIndex = '1000';
        yaleCounterElement.style.backgroundColor = 'rgba(40, 109, 192, 0.9)';
        yaleCounterElement.style.color = 'white';
        yaleCounterElement.style.padding = '5px';
        yaleCounterElement.style.borderRadius = '6px';
        yaleCounterElement.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        yaleCounterElement.style.fontSize = '14px';
        yaleCounterElement.style.fontWeight = 'bold';
        yaleCounterElement.style.minWidth = 'auto';
        yaleCounterElement.style.maxWidth = '150px';
        yaleCounterElement.style.textAlign = 'center';
      }
      
      // Always update the value when counter is visible
      if (shouldShow) {
        // Calculate progress based on vertical scroll through the Yale section
        var yaleHeight = yaleElement.offsetHeight;
        var scrollTop = window.pageYOffset;
        var yaleOffsetTop = yaleElement.offsetTop;
        var relativeScroll = scrollTop - yaleOffsetTop;
        var progress = Math.max(0, Math.min(1, relativeScroll / yaleHeight));
        
        // Calculate wealth: $0 at Yale start, $40.7B at Yale end
        var wealth = progress * 40700000000;
        yaleCounterElement.innerHTML = money.format(wealth);
        
        // Log when counter value changes significantly
        if (Math.abs(wealth - (previousWealth || 0)) > 1000000) {
          console.log('Mobile counter updated:', money.format(wealth), 'progress:', progress.toFixed(4));
          previousWealth = wealth;
        }
      }
    } else {
      // Desktop: Use horizontal scroll position (original logic)
      var yaleRect = yaleElement.getBoundingClientRect();
      var yaleLeft = yaleRect.left;
      
      // Show counter when the Yale element is at or past the left edge of the viewport
      var shouldShow = yaleLeft <= 0;
      var wasVisible = yaleCounterElement.style.display === 'block';
      
      if (shouldShow && !wasVisible) {
        // Show counter
        yaleCounterElement.style.display = 'block';
        console.log('Counter first appeared at:', {
          yaleLeft: yaleLeft.toFixed(2),
          screenWidth: window.innerWidth,
          scrollLeft: document.body.scrollLeft
        });
      } else if (!shouldShow && wasVisible) {
        // Hide counter when before the Yale wealth bar start
        yaleCounterElement.style.display = 'none';
      }
      
      // Always update the value when counter is visible
      if (shouldShow) {
        // Calculate wealth based on how much of the Yale element has passed the left edge
        // When yaleLeft is 0, we're at the start (should be $0)
        // When yaleLeft is -yaleWidth, we're at the end (should be $40.7B)
        var yaleWidth = yaleElement.offsetWidth;
        var progress = Math.max(0, Math.min(1, -yaleLeft / yaleWidth));
        
        // Calculate wealth: $0 at Yale start, $40.7B at Yale end
        var wealth = progress * 40700000000;
        yaleCounterElement.innerHTML = money.format(wealth);
        
        // Log when counter value changes significantly
        if (Math.abs(wealth - (previousWealth || 0)) > 1000000) {
          console.log('Counter updated:', money.format(wealth), 'progress:', progress.toFixed(4));
          previousWealth = wealth;
        }
      }
    }
  }
}

// Track previous wealth value for logging
let previousWealth = 0;

function toggleZoom() {
  const lineChart = document.getElementById('line-chart');
  if (lineChart) {
    lineChart.classList.toggle('zoom');
  }
}

// ===== YALE ENDOWMENT GROWTH CALCULATOR =====
// Yale's endowment data
var YALE_ENDOWMENT_BASE = 40700000000; // $40.7 billion
var YALE_AVERAGE_ANNUAL_RETURN = 0.08; // 8% average annual return over 5 years

// Growth pixel area elements
var growthPixelArea = document.getElementById('growth-pixel-area');
var growthCounter = document.getElementById('growth-counter');
var growthRate = document.getElementById('growth-rate');

// Track when the page was loaded
var pageLoadTime = null;

function calculateYaleGrowth() {
  if (!growthPixelArea || !growthCounter || !growthRate) {
    return;
  }
  
  // Calculate time since page load in seconds
  const now = Date.now();
  const timeOnPage = (now - pageLoadTime) / 1000; // Time in seconds
  
  // Calculate growth based on actual time on page
  // Yale's endowment grows at 8% annually, so per second: 40.7B * 0.08 / (365.25 * 24 * 60 * 60)
  const growthPerSecond = YALE_ENDOWMENT_BASE * YALE_AVERAGE_ANNUAL_RETURN / (365.25 * 24 * 60 * 60);
  const growthAmount = growthPerSecond * timeOnPage;
  const growthPercentage = (growthAmount / YALE_ENDOWMENT_BASE) * 100;
  
  // Calculate how many pixels to add (1 pixel per $1000)
  // Cap at 1 hour of growth for visual effect
  const oneHourGrowth = YALE_ENDOWMENT_BASE * YALE_AVERAGE_ANNUAL_RETURN / (365.25 * 24);
  const maxPixels = Math.floor(oneHourGrowth / 1000); // 3,700 pixels for 1 hour
  const pixelsToAdd = Math.min(Math.floor(growthAmount / 1000), maxPixels);
  
  // Add pixels to the area
  addGrowthPixels(pixelsToAdd);
  
  // Update the counter
  growthCounter.innerHTML = money.format(growthAmount);
  
  // Update the growth rate
  growthRate.innerHTML = growthPercentage.toFixed(4) + '%';
  

}

// Track total pixels added
var totalPixelsAdded = 0;

// Function to add growth pixels
function addGrowthPixels(pixelsToAdd) {
  if (!growthPixelArea) return;
  
  // Calculate how many new pixels to add
  var newPixelsToAdd = pixelsToAdd - totalPixelsAdded;
  
  if (newPixelsToAdd > 0) {
    // Add new pixels with staggered timing
    for (var i = 0; i < newPixelsToAdd; i++) {
      setTimeout(function() {
        var pixel = document.createElement('div');
        pixel.className = 'growth-pixel';
        // Create a color palette for variety
        var colors = ['#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ff9800'];
        var randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        pixel.style.cssText = 
          'position: absolute;' +
          'width: 2px;' +
          'height: 2px;' +
          'background-color: ' + randomColor + ';' +
          'left: ' + (Math.random() * 100) + '%;' +
          'top: -10px;' +
          'z-index: 1;' +
          'border-radius: 1px;';
        growthPixelArea.appendChild(pixel);
        
        // Trigger the drop animation
        setTimeout(function() {
          pixel.style.top = (Math.random() * 100) + '%';
        }, 50);
      }, i * 100); // Stagger each pixel by 100ms
    }
    
    totalPixelsAdded = pixelsToAdd;
  }
}

// Initialize and update growth calculation
function initGrowthBar() {
  // Set the page load time
  pageLoadTime = Date.now();
  
  // Clear any existing pixels but keep the counter
  if (growthPixelArea) {
    const counter = growthPixelArea.querySelector('.growth-counter');
    growthPixelArea.innerHTML = '';
    if (counter) {
      growthPixelArea.appendChild(counter);
    }
  }
  
  // Reset pixel counter
  totalPixelsAdded = 0;
  
  // Initial calculation
  calculateYaleGrowth();
  
  // Update every second for real-time effect
  setInterval(calculateYaleGrowth, 1000);
}

// Helper function to compute scroll progress
// Cache for scroll progress to reduce calculations
let scrollProgressCache = null;
let lastScrollTime = 0;

function computeScrollProgress() {
  const now = performance.now();
  
  // Return cached result if called within 16ms (60fps)
  if (scrollProgressCache && (now - lastScrollTime) < 16) {
    return scrollProgressCache;
  }
  
  const yaleElement = getYaleElement();
  if (!yaleElement) {
    return null;
  }
  
  const isMobile = window.innerWidth <= 450;
  
  if (isMobile) {
    // Mobile: Use vertical scroll position
    const scrollTop = window.pageYOffset;
    const yaleStart = yaleElement.offsetTop;
    const yaleHeight = yaleElement.offsetHeight;
    
    // Calculate scroll position relative to Yale section start
    const relativeScroll = scrollTop - yaleStart;
    const progress = Math.max(0, Math.min(1, relativeScroll / yaleHeight));
    
    scrollProgressCache = {
      progress,
      currentScroll: relativeScroll,
      yaleHeight,
      isAtStart: progress <= 0.01,
      isAtEnd: progress >= 0.99
    };
  } else {
    // Desktop: Use horizontal scroll position
    const totalScroll = document.body.scrollLeft;
    const yaleStart = yaleElement.offsetLeft;
    const yaleWidth = yaleElement.offsetWidth;
    
    // Calculate scroll position relative to Yale section start (allow negative values for backwards scrolling)
    const relativeScroll = totalScroll - yaleStart;
    const progress = Math.max(0, Math.min(1, relativeScroll / yaleWidth));
    
    scrollProgressCache = {
      progress,
      currentScroll: relativeScroll,
      yaleWidth,
      isAtStart: progress <= 0.01,
      isAtEnd: progress >= 0.99
    };
  }
  
  lastScrollTime = now;
  return scrollProgressCache;
}

// Function to update infobox flow based on scroll position with smooth animations
function updateInfoboxFlow() {
  const scrollData = computeScrollProgress();
  if (!scrollData) return;
  
  const { progress } = scrollData;
  
  // Track scroll direction for backward scrolling support
  if (!window.lastScrollProgress) {
    window.lastScrollProgress = progress;
  }
  const scrollDirection = progress > window.lastScrollProgress ? 'forward' : 'backward';
  window.lastScrollProgress = progress;
  
  // Debug: Log progress and infobox count
  if (progress % 0.1 < 0.01) { // Log every 10% progress
    console.log('Scroll progress:', progress.toFixed(3), 'Direction:', scrollDirection, 'Infoboxes found:', document.querySelectorAll('.infobox').length);
  }
    
  // Get all dynamically created infoboxes
  const infoboxElements = document.querySelectorAll('.infobox');
  
  // Track which infobox should be visible to implement fallback clearing
  let infoboxToShow = null;
  let infoboxToShowId = null;
  
  // First pass: determine which infobox should be visible
  infoboxElements.forEach((element) => {
    const infoboxId = element.getAttribute('data-infobox-id');
    const infoboxTrigger = parseFloat(element.getAttribute('data-trigger'));
    
    if (infoboxId && !isNaN(infoboxTrigger)) {
      const infoboxStart = infoboxTrigger - 0.005;
      const infoboxEnd = infoboxTrigger + 0.035;
      
      // Handle both forward and backward scrolling
      let shouldShow = false;
      
      if (scrollDirection === 'forward') {
        // Forward scrolling: show when entering the trigger range
        shouldShow = progress >= infoboxStart && progress < infoboxEnd;
      } else {
        // Backward scrolling: show when entering the trigger range from the end
        shouldShow = progress <= infoboxEnd && progress > infoboxStart;
      }
      
      if (shouldShow) {
        // If multiple infoboxes should show, prioritize the one closest to current progress
        if (!infoboxToShow || Math.abs(infoboxTrigger - progress) < Math.abs(parseFloat(infoboxToShow.getAttribute('data-trigger')) - progress)) {
          infoboxToShow = element;
          infoboxToShowId = infoboxId;
        }
      }
    }
  });
  
  // Second pass: show/hide infoboxes with fallback clearing
  infoboxElements.forEach((element) => {
    const infoboxId = element.getAttribute('data-infobox-id');
    const infoboxTrigger = parseFloat(element.getAttribute('data-trigger'));
    
    // Debug: Log infobox processing
    if (progress % 0.1 < 0.01) {
      console.log('Processing infobox:', infoboxId, 'trigger:', infoboxTrigger, 'progress:', progress.toFixed(3));
    }
    
    if (infoboxId && !isNaN(infoboxTrigger)) {
      const infoboxStart = infoboxTrigger - 0.005;
      const infoboxEnd = infoboxTrigger + 0.035;
      
      // Handle both forward and backward scrolling
      let shouldShow = false;
      
      if (scrollDirection === 'forward') {
        // Forward scrolling: show when entering the trigger range
        shouldShow = progress >= infoboxStart && progress < infoboxEnd;
      } else {
        // Backward scrolling: show when entering the trigger range from the end
        shouldShow = progress <= infoboxEnd && progress > infoboxStart;
      }
      
      const wasVisible = element.classList.contains('visible');
      
      // FALLBACK: Force clear all other infoboxes when a new one should appear
      if (shouldShow && infoboxId === infoboxToShowId && !wasVisible) {
        // Clear all other visible infoboxes first
        infoboxElements.forEach((otherElement) => {
          if (otherElement !== element && otherElement.classList.contains('visible')) {
            const otherId = otherElement.getAttribute('data-infobox-id');
            const otherBlockValue = otherElement.getAttribute('data-block-value');
            
            // Force hide other infobox
            otherElement.classList.remove('visible');
            otherElement.classList.add('hidden');
            
            // Force hide other visual block
            if (otherBlockValue) {
              hideVisualBlock(otherId);
            }
          }
        });
        
        const isMobile = window.innerWidth <= 450;
        
        if (isMobile) {
          // Mobile: Position infoboxes inline with the content flow
          element.style.setProperty('position', 'relative', 'important');
          element.style.setProperty('z-index', '1000', 'important');
          element.style.setProperty('width', '90vw', 'important');
          element.style.setProperty('max-width', '90vw', 'important');
          element.style.setProperty('background-color', 'rgba(255, 255, 255, 0.95)', 'important');
          element.style.setProperty('border', 'none', 'important');
          element.style.setProperty('backdrop-filter', 'none', 'important');
          element.style.setProperty('left', '5vw', 'important');
          element.style.setProperty('top', 'auto', 'important');
          element.style.setProperty('margin-bottom', '20px', 'important');
        } else {
          // Desktop: Show and position the infobox
          element.style.setProperty('position', 'fixed', 'important');
          element.style.setProperty('z-index', '1000', 'important');
          element.style.setProperty('max-width', '70vw', 'important');
          element.style.setProperty('width', '70vw', 'important');
          element.style.setProperty('background-color', 'transparent', 'important');
          element.style.setProperty('background', 'transparent', 'important');
          element.style.setProperty('border-radius', '0', 'important');
          element.style.setProperty('box-shadow', 'none', 'important');
          element.style.setProperty('border', 'none', 'important');
          element.style.setProperty('backdrop-filter', 'none', 'important');
          
          // Position relative to the viewport - better positioning
          const xPosition = window.innerWidth * 0.15; // 15% from left edge for better readability
          const yPosition = window.innerHeight * 0.2; // 20% from top, responsive to screen height
          
          element.style.setProperty('left', `${xPosition}px`, 'important');
          element.style.setProperty('top', `${yPosition}px`, 'important');
        }
        
        // Show infobox with smooth animation
        element.classList.remove('hidden');
        element.classList.add('visible');
        
        // Create and show visual block if this infobox has block data
        const blockValue = element.getAttribute('data-block-value');
        if (blockValue) {
          const blockData = {
            id: infoboxId,
            blockValue: parseFloat(blockValue),
            blockLabel: element.getAttribute('data-block-label') || 'Block',
            trigger: infoboxTrigger
          };
          createVisualBlock(blockData);
        }
      } else if (!shouldShow && wasVisible) {
        // Hide infobox with smooth animation
        element.classList.remove('visible');
        element.classList.add('hidden');
        
        // Hide visual block if this infobox has block data
        const blockValue = element.getAttribute('data-block-value');
        if (blockValue) {
          hideVisualBlock(infoboxId);
        }
      }
    }
  });
}

// Function to initialize all visual blocks that should be visible based on current scroll position
function initializeVisibleBlocks() {
  const scrollData = computeScrollProgress();
  if (!scrollData) return;
  
  const { progress } = scrollData;
  
  // Get all dynamically created infoboxes with block data
  const infoboxElements = document.querySelectorAll('.infobox[data-block-value]');
  
  infoboxElements.forEach((element) => {
    const infoboxTrigger = parseFloat(element.getAttribute('data-trigger'));
    const blockValue = element.getAttribute('data-block-value');
    
    if (!isNaN(infoboxTrigger) && blockValue) {
      const infoboxStart = infoboxTrigger - 0.005; // Match the buffer from updateInfoboxFlow
      const infoboxEnd = infoboxTrigger + 0.035;
      const shouldBeVisible = progress >= infoboxStart && progress < infoboxEnd;
      
      if (shouldBeVisible) {
        const blockData = {
          id: element.getAttribute('data-infobox-id'),
          blockValue: parseFloat(blockValue),
          blockLabel: element.getAttribute('data-block-label') || 'Block',
          trigger: infoboxTrigger
        };
        createVisualBlock(blockData);
      }
    }
  });
}

// Function to create visual blocks on the Yale wealth bar
function createVisualBlock(infobox) {
  // Remove any existing block for this infobox
  hideVisualBlock(infobox.id);
  
  const yaleElement = getYaleElement();
  if (!infobox.blockValue || !yaleElement) {
    console.log('createVisualBlock: Missing blockValue or yale element', { 
      blockValue: infobox.blockValue, 
      yaleExists: !!yaleElement,
      infoboxId: infobox.id 
    });
    return;
  }
  
  console.log('Creating visual block for infobox', infobox.id, 'with value', infobox.blockValue);
  
  // Calculate area based on value/1000 where 1 square pixel = $1,000
  // This creates a proportional representation where area = value/1000
  const totalArea = infobox.blockValue / 1000; // Total square pixels needed
  const minSize = 6; // Minimum dimension for visibility
  
  // Calculate dimensions for a square block
  // For square blocks: width = height = sqrt(area)
  const blockSize = Math.max(Math.sqrt(totalArea), minSize);
  
  console.log('Block area calculation:', { 
    blockValue: infobox.blockValue, 
    totalArea: totalArea,
    blockSize: blockSize,
    calculation: `sqrt(${infobox.blockValue} / 1000) = sqrt(${totalArea}) = ${blockSize}px`
  });
  
  // Create the visual block
  const block = document.createElement('div');
  block.id = `visual-block-${infobox.id}`;
  block.className = 'yale-visual-block';
  
  // Always offset text from blocks and add arrows for better visibility
  const needsOffset = true; // Always offset for better visibility
  const offsetDistance = 80; // 80px offset for all blocks
  
  // Calculate the center of the infobox's visibility span
  const infoboxStart = infobox.trigger;
  const infoboxEnd = infobox.trigger + 0.03; // 3% range
  const infoboxCenter = infoboxStart + (infoboxEnd - infoboxStart) / 2;
  
  const isMobile = window.innerWidth <= 450;
  
  if (isMobile) {
    // Mobile: Position blocks vertically within the Yale wealth bar
    const topPosition = infoboxCenter * 100;
    
    block.style.cssText = `
      position: absolute;
      left: 50%;
      top: ${topPosition}%;
      transform: translateX(-50%);
      width: ${blockSize}px;
      height: ${blockSize}px;
      background-color: #ff6900;
      z-index: 1001;
      pointer-events: auto;
      transition: all 0.3s ease;
    `;
  } else {
    // Desktop: Position blocks horizontally
    const leftPosition = infoboxCenter * 100;
    
    block.style.cssText = `
      position: absolute;
      left: ${leftPosition}%;
      top: ${20 + offsetDistance}px;
      width: ${blockSize}px;
      height: ${blockSize}px;
      background-color: #ff6900;
      z-index: 1001;
      pointer-events: auto;
      transition: all 0.3s ease;
    `;
  }
  
  // Add label with offset positioning
  const label = document.createElement('div');
  
  if (isMobile) {
    // Mobile: Position label to the right of the block
    const labelTop = '50%';
    const labelLeft = '100%';
    
    label.style.cssText = `
      position: absolute;
      top: ${labelTop};
      left: ${labelLeft};
      transform: translateY(-50%);
      background-color: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 6px 10px;
      font-size: 11px;
      font-weight: 600;
      white-space: nowrap;
      z-index: 1002;
      margin-left: 10px;
    `;
  } else {
    // Desktop: Position label above the block
    const labelTop = -45; // Further up from the block
    const labelLeft = '50%';
    
    label.style.cssText = `
      position: absolute;
      top: ${labelTop}px;
      left: ${labelLeft};
      transform: translateX(-50%);
      background-color: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 6px 10px;
      font-size: 11px;
      font-weight: 600;
      white-space: nowrap;
      z-index: 1002;
    `;
  }
  label.textContent = infobox.blockLabel;
  block.appendChild(label);
  
  // Add arrow for all blocks
  const arrow = document.createElement('div');
  
  if (isMobile) {
    // Mobile: Arrow pointing to the right
    arrow.style.cssText = `
      position: absolute;
      top: 50%;
      left: -10px;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
      border-right: 16px solid rgba(0, 0, 0, 0.9);
      z-index: 1001;
    `;
  } else {
    // Desktop: Arrow pointing up
    arrow.style.cssText = `
      position: absolute;
      top: -35px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 16px solid rgba(0, 0, 0, 0.9);
      z-index: 1001;
    `;
  }
  block.appendChild(arrow);
  
  // Add value display on the block only if block is large enough (minimum 20px)
  if (blockSize >= 20) {
    const valueDisplay = document.createElement('div');
    valueDisplay.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 10px;
      font-weight: 700;
      text-align: center;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
      z-index: 1003;
    `;
    
    // Format the value for display
    const formatValue = (value) => {
      if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `$${(value / 1000).toFixed(0)}K`;
      } else {
        return `$${value.toLocaleString()}`;
      }
    };
    
    valueDisplay.textContent = formatValue(infobox.blockValue);
    block.appendChild(valueDisplay);
  }
  
  // Add to Yale wealth bar
  yaleElement.appendChild(block);
  
  // Trigger smooth animation after a brief delay
  setTimeout(() => {
    block.classList.add('visible');
  }, 50);
  
  console.log('Visual block created and added to Yale element', block.id);
  
  // Add hover effect
  block.addEventListener('mouseenter', () => {
    block.style.transform = 'scale(1.1)';
  });
  
  block.addEventListener('mouseleave', () => {
    block.style.transform = 'scale(1)';
  });
}

// Function to hide visual blocks with smooth animation
function hideVisualBlock(infoboxId) {
  const existingBlock = document.getElementById(`visual-block-${infoboxId}`);
  if (existingBlock) {
    // Add fade out animation
    existingBlock.classList.remove('visible');
    existingBlock.classList.add('hidden');
    
    // Remove element after animation completes
    setTimeout(() => {
      if (existingBlock.parentNode) {
        existingBlock.remove();
      }
    }, 400); // Match CSS transition duration
  }
}

// Start the growth bar when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Initialize Yale elements
  const yaleElement = getYaleElement();
  const yaleCounterElement = getYaleCounter();
  const yaleCounterStartElement = getYaleCounterStart();
  
  console.log('DOMContentLoaded: Yale elements initialized:', {
    yale: !!yaleElement,
    yaleCounter: !!yaleCounterElement,
    yaleCounterStart: !!yaleCounterStartElement
  });
  
  // Initialize counter with proper styling
  if (yaleCounterElement) {
    console.log('Initializing counter...');
    yaleCounterElement.style.display = 'none'; // Hidden by default
    yaleCounterElement.innerHTML = '$0';
  }
  
  initGrowthBar();
  initializeVisibleBlocks(); // Initialize visible blocks on page load
  updateWealthCounter(); // Initialize counter on page load
  
  // Initialize mobile layout if needed
  updateMobileWealthBarHeights();
  
  // Initialize configurator popup
  initializeConfiguratorPopup();
});

// Handle resize events for mobile/desktop switching
window.addEventListener('resize', function() {
  // Reinitialize visible blocks when screen size changes
  setTimeout(() => {
    initializeVisibleBlocks();
    updateWealthCounter();
    updateMobileWealthBarHeights(); // Update mobile heights on resize
  }, 100);
});

// Configurator popup functionality
function initializeConfiguratorPopup() {
  const toggle = document.getElementById('configurator-toggle');
  const panel = document.getElementById('configurator-panel');
  const close = document.getElementById('configurator-close');
  
  if (!toggle || !panel || !close) {
    console.log('Configurator popup elements not found');
    return;
  }
  
  // Toggle panel visibility
  toggle.addEventListener('click', function(e) {
    e.stopPropagation();
    panel.classList.toggle('show');
  });
  
  // Close panel when clicking close button
  close.addEventListener('click', function(e) {
    e.stopPropagation();
    panel.classList.remove('show');
  });
  
  // Close panel when clicking outside
  document.addEventListener('click', function(e) {
    if (!toggle.contains(e.target) && !panel.contains(e.target)) {
      panel.classList.remove('show');
    }
  });
  
  // Close panel on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      panel.classList.remove('show');
    }
  });
  
  console.log('Configurator popup initialized');
}

} catch (error) {
  console.error('=== JAVASCRIPT ERROR ===', error);
  
  // Show user-friendly error message
  var errorDiv = document.createElement('div');
  errorDiv.style.cssText = 
    'position: fixed;' +
    'top: 50%;' +
    'left: 50%;' +
    'transform: translate(-50%, -50%);' +
    'background: rgba(220, 53, 69, 0.9);' +
    'color: white;' +
    'padding: 20px;' +
    'border-radius: 10px;' +
    'text-align: center;' +
    'z-index: 10000;' +
    'max-width: 400px;';
  errorDiv.innerHTML = 
    '<h3>Something went wrong</h3>' +
    '<p>There was an error loading this page. Please try refreshing or using a different browser.</p>' +
    '<button onclick="location.reload()" style="margin-top: 10px; padding: 5px 15px; border: none; background: white; color: #dc3545; border-radius: 5px; cursor: pointer;">Refresh Page</button>';
  document.body.appendChild(errorDiv);
}
