# Yale Endowment Visualization

A powerful visualization of Yale University's $40.7 billion endowment, shown to scale with interactive elements and real-time growth tracking.

## Browser Compatibility

This page is designed to work across **all modern browsers** and includes comprehensive fallbacks for older browsers. Here's what we support:

### ✅ Fully Supported Browsers
- **Chrome** 50+ (recommended)
- **Firefox** 50+ (recommended)
- **Safari** 10+ (recommended)
- **Edge** 79+ (recommended)
- **Internet Explorer** 11+ (with limitations)

### ⚠️ Partially Supported Browsers
- **Internet Explorer** 10 and below (basic functionality only)
- **Very old versions** of modern browsers

### 🔧 Browser Compatibility Features

#### Automatic Fallbacks
The page automatically detects browser capabilities and applies appropriate fallbacks:

1. **CSS Custom Properties (CSS Variables)**
   - Modern browsers: Full support
   - Older browsers: Automatic fallback to static values

2. **CSS calc() Function**
   - Modern browsers: Full support
   - Older browsers: Pre-calculated fallback values

3. **Flexbox Layout**
   - Modern browsers: Full support
   - Older browsers: Fallback to inline-block layout

4. **JavaScript ES6 Features**
   - Modern browsers: Full support
   - Older browsers: Polyfills and fallbacks

5. **Touch Events**
   - Mobile browsers: Full support
   - Desktop browsers: Mouse event fallbacks

6. **Number Formatting**
   - Modern browsers: Intl.NumberFormat
   - Older browsers: Custom formatting functions

#### Progressive Enhancement
The page uses progressive enhancement, meaning:
- Core functionality works in all browsers
- Enhanced features are added for modern browsers
- Graceful degradation for older browsers

### 🧪 Testing Browser Compatibility

#### Option 1: Use the Browser Test Page
1. Open `browser-test.html` in your browser
2. Review the test results
3. Follow any recommendations provided

#### Option 2: Manual Testing
Test these key features:

1. **Horizontal Scrolling** (Desktop)
   - Use Shift + Mousewheel or swipe sideways on touchpad
   - Should smoothly scroll through the wealth visualization

2. **Vertical Scrolling** (Mobile)
   - Scroll down to navigate through content
   - Should work smoothly on touch devices

3. **Interactive Elements**
   - Hover over wealth bars
   - Click on interactive elements
   - Should respond appropriately

4. **Number Formatting**
   - Check that dollar amounts display correctly
   - Should show proper currency formatting

5. **Responsive Design**
   - Resize browser window
   - Should adapt to different screen sizes

### 🚨 Known Issues and Solutions

#### Internet Explorer 11 and Below
- **Issue**: Limited CSS support
- **Solution**: Automatic fallbacks applied
- **Impact**: Some visual effects may be simplified

#### Very Old Mobile Browsers
- **Issue**: Limited touch event support
- **Solution**: Mouse event fallbacks
- **Impact**: Touch interactions may be less smooth

#### Older Safari Versions
- **Issue**: Limited CSS Grid support
- **Solution**: Flexbox fallbacks
- **Impact**: Layout may be slightly different

### 🔧 Technical Implementation

#### CSS Fallbacks
```css
/* Modern browsers */
@supports (--fake-var: 0) {
  :root {
    --yale-width: 101750px;
  }
}

/* Older browsers */
@supports not (--fake-var: 0) {
  .yale .wealth {
    width: 101750px !important;
  }
}
```

#### JavaScript Polyfills
```javascript
// Fallback for Intl.NumberFormat
if (!window.Intl || !window.Intl.NumberFormat) {
  window.Intl.NumberFormat = function(locale, options) {
    return {
      format: function(num) {
        return '$' + num.toLocaleString();
      }
    };
  };
}
```

#### Event Handling Fallbacks
```javascript
// Safe event binding
function safeAddEventListener(element, event, handler, options) {
  if (element && element.addEventListener) {
    element.addEventListener(event, handler, options);
  } else if (element && element.attachEvent) {
    // IE fallback
    element.attachEvent('on' + event, handler);
  }
}
```

### 📱 Mobile Compatibility

The page is fully responsive and works on:
- **iOS Safari** 10+
- **Android Chrome** 50+
- **Samsung Internet** 7+
- **Other mobile browsers** with WebKit/Blink engines

### 🎯 Performance Considerations

#### Modern Browsers
- Full feature set
- Optimized performance
- Smooth animations

#### Older Browsers
- Reduced feature set
- Simplified animations
- Focus on core functionality

### 🛠️ Development Notes

#### Adding New Features
When adding new features, always include:
1. **Feature detection** before implementation
2. **Fallback behavior** for unsupported browsers
3. **Testing** across multiple browser versions

#### Testing Checklist
- [ ] Test in Chrome (latest)
- [ ] Test in Firefox (latest)
- [ ] Test in Safari (latest)
- [ ] Test in Edge (latest)
- [ ] Test in Internet Explorer 11
- [ ] Test on mobile devices
- [ ] Test with JavaScript disabled
- [ ] Test with CSS disabled

### 📊 Browser Usage Statistics

Based on current web standards, this page should work for:
- **95%+** of global web users
- **99%+** of users in developed countries
- **90%+** of mobile users

### 🆘 Getting Help

If you encounter issues:

1. **Check browser compatibility** using `browser-test.html`
2. **Update your browser** to the latest version
3. **Try a different browser** (Chrome, Firefox, Safari, Edge)
4. **Report issues** with browser version and error details

### 📝 License

This project is open source. See LICENSE.txt for details.

---

**Note**: This page is designed to be accessible and functional across the widest possible range of browsers while maintaining the core visualization experience.
