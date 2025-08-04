try {

  const yale = document.getElementById('yale');
const yaleCounter = document.getElementById('yale-counter');
const yaleCounterStart = document.getElementById('yale-counter-start');

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

function detectConfusedUser(e, timer) {
  if (!additionalInstructionsShown) {
    additionalInstructionsShown = true;

    setTimeout(function(){
      if (window.scrollX < 1) {
        document.getElementById('instructions').classList.add("show");
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

if (window.innerWidth > 450) {
  document.addEventListener("mousemove", detectVeryConfusedUser, {once: true});
  document.addEventListener("mousewheel", detectSlightlyConfusedUser, {once: true});
  document.addEventListener("DOMMouseScroll", detectSlightlyConfusedUser, {once: true});
}

window.addEventListener('scroll', function(){
  updateWealthCounter();
  updateInfoboxFlow();
});

// Also listen for horizontal scroll specifically
window.addEventListener('wheel', function(e) {
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
    updateInfoboxFlow();
  }
});


if (babies && babyCounter) {
  babies.addEventListener('scroll', function(){
    const isMobile = window.innerWidth <= 450;
    const bgSize = (isMobile) ? 68 : 160;
    babyCounter.innerHTML = thousand.format(Math.floor(babies.scrollTop / bgSize * 5));
  });
}

function updateWealthCounter() {
  if (yale && yaleCounter && yaleCounterStart) {
    if (yaleViewable()) {
      if (yaleCounterViewable()) {
        // Calculate position within Yale wealth box
        const yaleStart = yale.offsetLeft;
        const yaleEnd = yaleStart + yale.offsetWidth;
        const currentScroll = window.scrollX;
        
        // Only calculate wealth when inside the Yale wealth box
        if (currentScroll >= yaleStart && currentScroll <= yaleEnd) {
          // Calculate percentage through the Yale wealth box
          const progress = (currentScroll - yaleStart) / yale.offsetWidth;
          // Calculate wealth based on percentage of $40.7 billion
          const wealth = progress * 40700000000;
          yaleCounter.innerHTML = money.format(wealth);
        } else if (currentScroll < yaleStart) {
          // Before reaching Yale wealth box
          yaleCounter.innerHTML = "$0";
        } else {
          // Past Yale wealth box
          yaleCounter.innerHTML = "$40,700,000,000";
        }
      } else {
        yaleCounter.innerHTML = '';
      }
    }
  }
  
  function yaleViewable() {
    return yale && window.scrollX < yale.offsetLeft + yale.offsetWidth + 100;
  }
  
  function yaleCounterViewable() {
    return yaleCounterStart && yaleCounterStart.offsetLeft - window.scrollX < (window.innerWidth);
  }
}
function toggleZoom() {
  const lineChart = document.getElementById('line-chart');
  if (lineChart) {
    lineChart.classList.toggle('zoom');
  }
}

// ===== YALE ENDOWMENT GROWTH CALCULATOR =====
// Yale's endowment data
const YALE_ENDOWMENT_BASE = 40700000000; // $40.7 billion
const YALE_AVERAGE_ANNUAL_RETURN = 0.08; // 8% average annual return over 5 years

// Growth pixel area elements
const growthPixelArea = document.getElementById('growth-pixel-area');
const growthCounter = document.getElementById('growth-counter');
const growthRate = document.getElementById('growth-rate');

// Track when the page was loaded
let pageLoadTime = null;

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
let totalPixelsAdded = 0;

// Function to add growth pixels
function addGrowthPixels(pixelsToAdd) {
  if (!growthPixelArea) return;
  
  // Calculate how many new pixels to add
  const newPixelsToAdd = pixelsToAdd - totalPixelsAdded;
  
  if (newPixelsToAdd > 0) {
    // Add new pixels with staggered timing
    for (let i = 0; i < newPixelsToAdd; i++) {
      setTimeout(() => {
        const pixel = document.createElement('div');
        pixel.className = 'growth-pixel';
        // Create a color palette for variety
        const colors = ['#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ff9800'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        pixel.style.cssText = `
          position: absolute;
          width: 2px;
          height: 2px;
          background-color: ${randomColor};
          left: ${Math.random() * 100}%;
          top: -10px;
          z-index: 1;
          border-radius: 1px;
        `;
        growthPixelArea.appendChild(pixel);
        
        // Trigger the drop animation
        setTimeout(() => {
          pixel.style.top = `${Math.random() * 100}%`;
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

// Infobox objects with content and positioning data
const infoboxObjects = [
  {
    id: 1,
    content: "Yale's endowment is so large, that it is quite literally unimaginable.",
    type: "text",
    trigger: 0.05,
    position: { left: 0.05, top: 80 }
  },
  {
    id: 2,
    content: "We rarely see wealth inequality represented to scale. This may be one of the reasons people consistently struggle to estimate the extent of wealth inequality.",
    type: "text",
    trigger: 0.10,
    position: { left: 0.10, top: 80 }
  },
  {
    id: 3,
    content: "Every inch you scroll represents about $50 million.",
    type: "text",
    trigger: 0.15,
    position: { left: 0.15, top: 80 }
  },
  {
    id: 4,
    content: "OK, we're coming up on the end now.",
    type: "text",
    trigger: 0.20,
    position: { left: 0.20, top: 80 }
  },
  {
    id: 5,
    content: "Lol, just kidding, we're about a third of the way. Keep scrolling though, there's more to see.",
    type: "text",
    trigger: 0.25,
    position: { left: 0.25, top: 80 }
  },
  {
    id: 6,
    content: "Let's put this wealth in perspective by comparing it to some familiar things.",
    type: "text",
    trigger: 0.30,
    position: { left: 0.30, top: 80 }
  },
  {
    id: 7,
    content: "All the money the average American with a BA will ever earn in their entire life, from the day they are born until the day they die (about $1.93 million)",
    type: "block",
    trigger: 0.35,
    position: { left: 0.35, top: 80 },
    blockValue: 1930000,
    blockLabel: "$1.93M lifetime earnings"
  },
  {
    id: 8,
    content: "Annual rent for a 2-bedroom apartment in New Haven ($19,116)",
    type: "block",
    trigger: 0.40,
    position: { left: 0.40, top: 80 },
    blockValue: 19116,
    blockLabel: "$19,116 annual rent"
  },
  {
    id: 9,
    content: "Annual childcare for one child in New Haven ($14,400)",
    type: "block",
    trigger: 0.45,
    position: { left: 0.45, top: 80 },
    blockValue: 14400,
    blockLabel: "$14,400 annual childcare"
  },
  {
    id: 10,
    content: "Annual groceries for a family of four ($9,600)",
    type: "block",
    trigger: 0.50,
    position: { left: 0.50, top: 80 },
    blockValue: 9600,
    blockLabel: "$9,600 annual groceries"
  },
  {
    id: 11,
    content: "Annual transportation (car payment, gas, insurance) ($7,200)",
    type: "block",
    trigger: 0.55,
    position: { left: 0.55, top: 80 },
    blockValue: 7200,
    blockLabel: "$7,200 annual transportation"
  },
  {
    id: 12,
    content: "Annual retirement savings needed ($6,000)",
    type: "block",
    trigger: 0.60,
    position: { left: 0.60, top: 80 },
    blockValue: 6000,
    blockLabel: "$6,000 annual retirement"
  },
  {
    id: 13,
    content: "Annual utilities (electric, gas, water, internet) ($6,883)",
    type: "block",
    trigger: 0.65,
    position: { left: 0.65, top: 80 },
    blockValue: 6883,
    blockLabel: "$6,883 annual utilities"
  },
  {
    id: 14,
    content: "<strong>We Can't Keep Up:</strong> These are just the basic annual expenses that families face. When you add them all up, it's clear why so many workers struggle to make ends meet, even with full-time jobs.",
    type: "text",
    trigger: 0.70,
    position: { left: 0.70, top: 80 }
  },
  {
    id: 15,
    content: "Total annual expenses for a family of four ($62,199)",
    type: "block",
    trigger: 0.75,
    position: { left: 0.75, top: 80 },
    blockValue: 62199,
    blockLabel: "$62,199 total annual expenses"
  },
  {
    id: 16,
    content: "Typical Yale worker annual take-home pay ($72,150)",
    type: "block",
    trigger: 0.80,
    position: { left: 0.80, top: 80 },
    blockValue: 72150,
    blockLabel: "$72,150 annual take-home pay"
  },
  {
    id: 17,
    content: "<strong>The Reality:</strong> Annual expenses ($62,199) vs. take-home pay ($72,150) = $9,951 surplus. But this doesn't account for taxes, healthcare costs, or emergency savings. Many workers still struggle to make ends meet.",
    type: "text",
    trigger: 0.85,
    position: { left: 0.85, top: 80 }
  },
  {
    id: 18,
    content: "What Yale Could Do With Just 1% of Its Endowment",
    type: "text",
    trigger: 0.90,
    position: { left: 0.90, top: 80 }
  },
  {
    id: 19,
    content: "Yale's endowment is $40.7 billion. Just 1% of that is $407 million. Here's what Yale could do with that money instead of hoarding it:",
    type: "text",
    trigger: 0.95,
    position: { left: 0.95, top: 80 }
  },

];

// Helper function to compute scroll progress
function computeScrollProgress() {
  if (!yale) {
    return null;
  }
  
  const totalScroll = document.body.scrollLeft;
  const yaleStart = yale.offsetLeft;
  const yaleWidth = yale.offsetWidth;
  
  // Calculate scroll position relative to Yale section start
  const relativeScroll = Math.max(0, totalScroll - yaleStart);
  const progress = relativeScroll / yaleWidth;
  

  
  return {
    progress,
    currentScroll: relativeScroll,
    yaleWidth,
    isAtStart: progress <= 0.01,
    isAtEnd: progress >= 0.99
  };
}

// Function to update infobox flow based on scroll position
function updateInfoboxFlow() {
  const scrollData = computeScrollProgress();
  if (!scrollData) return;
  
  const { progress } = scrollData;
    
    // Process each infobox object - bidirectional system
    infoboxObjects.forEach((infobox) => {
      const element = document.querySelector(`.infobox-${infobox.id}`);
      if (element) {
        // Create a range for each infobox (start to end)
        const infoboxStart = infobox.trigger;
        const infoboxEnd = infobox.trigger + 0.03; // 3% range for each infobox - tighter, cleaner
        const shouldShow = progress >= infoboxStart && progress < infoboxEnd;
        
        // Check if infobox state should change
        const wasVisible = element.style.display === 'block';
        
        if (shouldShow) {
          // Show and position the infobox
          element.style.setProperty('display', 'block', 'important');
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
          
          // Create and show visual block if this infobox has block data
          // Only create dynamic blocks for later infoboxes (after 20) since early ones have static HTML blocks
          if (infobox.blockValue && infobox.id > 20) {
            createVisualBlock(infobox);
          }
        } else {
          // Hide infobox when outside its range
          element.style.setProperty('display', 'none', 'important');
          
          // Hide visual block if this infobox has block data
          // Only hide dynamic blocks for later infoboxes (after 20) since early ones have static HTML blocks
          if (infobox.blockValue && infobox.id > 20) {
            hideVisualBlock(infobox.id);
          }
        }
      }
    });

}

// Function to create visual blocks on the Yale wealth bar
function createVisualBlock(infobox) {
  // Remove any existing block for this infobox
  hideVisualBlock(infobox.id);
  
  // Get Yale bar height to constrain the block
  const yaleHeight = yale.offsetHeight || 400; // Default to 400px if not available
  const maxBlockSize = yaleHeight * 0.8; // Use 80% of Yale height as max
  
  // Calculate block size based on AREA (square pixels), not linear dimension
  const blockValue = infobox.blockValue;
  const areaInPixels = blockValue / 1000; // $1000 = 1 square pixel
  const blockSize = Math.min(Math.sqrt(areaInPixels), maxBlockSize); // Square root for area-based sizing
  
  // Create the visual block
  const block = document.createElement('div');
  block.id = `visual-block-${infobox.id}`;
  block.className = 'yale-visual-block';
  block.style.cssText = `
    position: absolute;
    left: ${infobox.position.left * 100}%;
    bottom: 0;
    width: ${blockSize}px;
    height: ${blockSize}px;
    background-color: #ff6900;
    border: 2px solid #cf2e2e;
    z-index: 1001;
    pointer-events: none;
  `;
  
  // Add label
  const label = document.createElement('div');
  label.style.cssText = `
    position: absolute;
    top: -30px;
    left: 0;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 4px 8px;
    font-size: 12px;
    white-space: nowrap;
    border-radius: 4px;
  `;
  label.textContent = infobox.blockLabel;
  block.appendChild(label);
  
  // Add to Yale wealth bar
  yale.appendChild(block);
}

// Function to hide visual blocks
function hideVisualBlock(infoboxId) {
  const existingBlock = document.getElementById(`visual-block-${infoboxId}`);
  if (existingBlock) {
    existingBlock.remove();
  }
}

// Start the growth bar when page loads
document.addEventListener('DOMContentLoaded', function() {
  initGrowthBar();
  
  
  
  
});

} catch (error) {
  console.error('=== JAVASCRIPT ERROR ===', error);
}
