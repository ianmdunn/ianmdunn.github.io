try {

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
  initializeVisibleBlocks(); // Ensure all visible blocks are properly initialized
});

// Track manual scroll position for horizontal scrolling
let manualScrollPosition = 0;

// Also listen for horizontal scroll specifically
window.addEventListener('wheel', function(e) {
  // Accumulate horizontal scroll position
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
    manualScrollPosition += e.deltaX;
    console.log('Manual scroll position:', manualScrollPosition, 'deltaX:', e.deltaX);
  }
  
  updateWealthCounter(); // Always update counter on wheel events
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
    updateInfoboxFlow();
  }
});

// Add touch events for mobile
window.addEventListener('touchmove', function(e) {
  updateWealthCounter();
});

// Add keyboard events for arrow keys
window.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    updateWealthCounter();
  }
});


if (babies && babyCounter) {
  babies.addEventListener('scroll', function(){
    const isMobile = window.innerWidth <= 450;
    const bgSize = (isMobile) ? 68 : 160;
    babyCounter.innerHTML = thousand.format(Math.floor(babies.scrollTop / bgSize * 5));
  });
}

// Track previous scroll position for direction detection
let previousScrollPosition = 0;

function updateWealthCounter() {
  const yaleElement = getYaleElement();
  const yaleCounterElement = getYaleCounter();

  if (yaleElement && yaleCounterElement) {
    // Get the Yale element's position relative to the viewport
    const yaleRect = yaleElement.getBoundingClientRect();
    const yaleLeft = yaleRect.left;
    
    // Show counter when the Yale element is at or past the left edge of the viewport
    const shouldShow = yaleLeft <= 0;
    const wasVisible = yaleCounterElement.style.display === 'block';
    
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
      const yaleWidth = yaleElement.offsetWidth;
      const progress = Math.max(0, Math.min(1, -yaleLeft / yaleWidth));
      
      // Calculate wealth: $0 at Yale start, $40.7B at Yale end
      const wealth = progress * 40700000000;
      yaleCounterElement.innerHTML = money.format(wealth);
      
      // Log when counter value changes significantly
      if (Math.abs(wealth - (previousWealth || 0)) > 1000000) {
        console.log('Counter updated:', money.format(wealth), 'progress:', progress.toFixed(4));
        previousWealth = wealth;
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
  {
    id: 20,
    content: "Pay every Yale worker $100,000 per year minimum ($2 billion)",
    type: "block",
    trigger: 1.00,
    position: { left: 1.00, top: 80 },
    blockValue: 2000000000,
    blockLabel: "$2B minimum wage"
  },
  {
    id: 21,
    content: "Build 1,000 affordable housing units ($400 million)",
    type: "block",
    trigger: 1.05,
    position: { left: 1.05, top: 80 },
    blockValue: 400000000,
    blockLabel: "$400M housing"
  },
  {
    id: 22,
    content: "What Yale Could Do for New Haven",
    type: "text",
    trigger: 1.10,
    position: { left: 1.10, top: 80 }
  },
  {
    id: 23,
    content: "The Reality: What Yale Actually Does",
    type: "text",
    trigger: 1.15,
    position: { left: 1.15, top: 80 }
  },
  {
    id: 24,
    content: "<strong>Yale's endowment grew by $1.4 billion in 2023 alone.</strong> That's enough money to give every Yale worker a $175,000 bonus. Instead, workers are told there's \"no money\" for raises, benefits, or better working conditions.",
    type: "text",
    trigger: 1.20,
    position: { left: 1.20, top: 80 }
  },
  {
    id: 25,
    content: "<strong>New Haven's Reality:</strong> While Yale's endowment grew by $1.4 billion in 2023, New Haven faces a $15 million budget deficit. The city struggles to fund schools, maintain infrastructure, and provide services, while Yale pays less than 0.02% of its endowment in taxes to the city.",
    type: "text",
    trigger: 1.25,
    position: { left: 1.25, top: 80 }
  },
  {
    id: 26,
    content: "<strong>New Haven's Cost of Living:</strong> According to PayScale, New Haven's cost of living is 8% higher than the national average. Housing costs are 2% higher, utilities are 42% higher, and transportation is 7% higher than the national average.",
    type: "text",
    trigger: 1.30,
    position: { left: 1.30, top: 80 }
  },
  {
    id: 27,
    content: "Yale's 2023 endowment growth ($1.4 billion)",
    type: "block",
    trigger: 1.35,
    position: { left: 1.35, top: 80 },
    blockValue: 1400000000,
    blockLabel: "$1.4B growth"
  },
  {
    id: 28,
    content: "New Haven's budget deficit ($15 million)",
    type: "block",
    trigger: 1.40,
    position: { left: 1.40, top: 80 },
    blockValue: 15000000,
    blockLabel: "$15M deficit"
  },
  {
    id: 29,
    content: "Yale's annual tax contribution to New Haven ($8 million)",
    type: "block",
    trigger: 1.45,
    position: { left: 1.45, top: 80 },
    blockValue: 8000000,
    blockLabel: "$8M taxes"
  },
  {
    id: 30,
    content: "What Yale workers actually get: average annual raise ($2,000)",
    type: "block",
    trigger: 1.50,
    position: { left: 1.50, top: 80 },
    blockValue: 2000,
    blockLabel: "$2K raise"
  },
  {
    id: 31,
    content: "What Yale could give each worker as bonus ($175,000)",
    type: "block",
    trigger: 1.55,
    position: { left: 1.55, top: 80 },
    blockValue: 175000,
    blockLabel: "$175K bonus"
  },
  {
    id: 32,
    content: "Yale's annual spending on administration ($500 million)",
    type: "block",
    trigger: 1.60,
    position: { left: 1.60, top: 80 },
    blockValue: 500000000,
    blockLabel: "$500M admin"
  },
  {
    id: 33,
    content: "Yale's annual spending on student financial aid ($200 million)",
    type: "block",
    trigger: 1.65,
    position: { left: 1.65, top: 80 },
    blockValue: 200000000,
    blockLabel: "$200M aid"
  },
  {
    id: 34,
    content: "Yale's annual spending on faculty salaries ($300 million)",
    type: "block",
    trigger: 1.70,
    position: { left: 1.70, top: 80 },
    blockValue: 300000000,
    blockLabel: "$300M faculty"
  },
  {
    id: 35,
    content: "Yale's annual spending on facilities maintenance ($150 million)",
    type: "block",
    trigger: 1.75,
    position: { left: 1.75, top: 80 },
    blockValue: 150000000,
    blockLabel: "$150M facilities"
  },
  {
    id: 36,
    content: "Yale's annual spending on research ($1 billion)",
    type: "block",
    trigger: 1.80,
    position: { left: 1.80, top: 80 },
    blockValue: 1000000000,
    blockLabel: "$1B research"
  },
  {
    id: 37,
    content: "Yale's annual spending on student services ($100 million)",
    type: "block",
    trigger: 1.85,
    position: { left: 1.85, top: 80 },
    blockValue: 100000000,
    blockLabel: "$100M services"
  },
  {
    id: 38,
    content: "Yale's annual spending on library and technology ($80 million)",
    type: "block",
    trigger: 1.90,
    position: { left: 1.90, top: 80 },
    blockValue: 80000000,
    blockLabel: "$80M library/tech"
  },
  {
    id: 39,
    content: "Yale's annual spending on athletics ($50 million)",
    type: "block",
    trigger: 1.95,
    position: { left: 1.95, top: 80 },
    blockValue: 50000000,
    blockLabel: "$50M athletics"
  },
  {
    id: 40,
    content: "Yale's annual spending on dining and housing ($120 million)",
    type: "block",
    trigger: 2.00,
    position: { left: 2.00, top: 80 },
    blockValue: 120000000,
    blockLabel: "$120M dining/housing"
  }
];

// Helper function to compute scroll progress
function computeScrollProgress() {
  const yaleElement = getYaleElement();
  if (!yaleElement) {
    return null;
  }
  
  const totalScroll = document.body.scrollLeft;
  const yaleStart = yaleElement.offsetLeft;
  const yaleWidth = yaleElement.offsetWidth;
  
  // Calculate scroll position relative to Yale section start (allow negative values for backwards scrolling)
  const relativeScroll = totalScroll - yaleStart;
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
        
        if (shouldShow && !wasVisible) {
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
          if (infobox.blockValue) {
            console.log('Should create block for infobox', infobox.id, 'with value', infobox.blockValue);
            createVisualBlock(infobox);
          }
        } else if (!shouldShow && wasVisible) {
          // Hide infobox when outside its range
          element.style.setProperty('display', 'none', 'important');
          
          // Hide visual block if this infobox has block data
          if (infobox.blockValue) {
            hideVisualBlock(infobox.id);
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
  console.log('Initializing visible blocks for progress:', progress);
  
  infoboxObjects.forEach((infobox) => {
    if (infobox.blockValue) {
      const infoboxStart = infobox.trigger;
      const infoboxEnd = infobox.trigger + 0.03;
      const shouldBeVisible = progress >= infoboxStart && progress < infoboxEnd;
      
      if (shouldBeVisible) {
        console.log('Initializing block for infobox', infobox.id, 'at progress', progress);
        createVisualBlock(infobox);
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
  
  // Position the block at the center of the infobox span
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
  
  // Add label with offset positioning
  const label = document.createElement('div');
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
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    z-index: 1002;
  `;
  label.textContent = infobox.blockLabel;
  block.appendChild(label);
  
  // Add arrow for all blocks
  const arrow = document.createElement('div');
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
  
  console.log('Visual block created and added to Yale element', block.id);
  
  // Add hover effect
  block.addEventListener('mouseenter', () => {
    block.style.transform = 'scale(1.1)';
  });
  
  block.addEventListener('mouseleave', () => {
    block.style.transform = 'scale(1)';
  });
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
});

} catch (error) {
  console.error('=== JAVASCRIPT ERROR ===', error);
}
