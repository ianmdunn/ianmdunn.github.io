# Yale Endowment Configurator Instructions

## Overview
The configurator allows you to create custom infoboxes and visual elements for the Yale endowment visualization. The system now saves configurations to JSON files that can be loaded by the main page.

## How to Use

### Quick Testing
1. Open `configurator.html` in your browser
2. Create infoboxes using the form on the left
3. Position them by dragging in the preview area
4. Click "Test in Main Page" to see your changes immediately
5. The configuration is saved to localStorage and opens `index.html` in a new tab

### Permanent Configuration
1. Create your infoboxes in the configurator
2. Click "Save Configuration" to download a JSON file
3. Place the downloaded file in the `Config Files` folder
4. Rename it to `active-config.json`
5. Refresh `index.html` to see your changes

## Configuration File Format
The system uses JSON files with this structure:
```json
{
  "version": "1.0",
  "timestamp": "2025-08-04T21:44:20.100Z",
  "yaleWealthBar": {
    "endowmentValue": 40.7,
    "scaleFactor": 1
  },
  "infoboxes": [
    {
      "id": 1754340072453,
      "title": "Infobox title (supports HTML)",
      "content": "Optional content",
      "type": "text|block|media",
      "timelinePosition": 5,
      "position": {
        "x": 2035020,
        "y": 160
      },
      "class": "infobox-1",
      "visualBlockProps": {
        "color": "#ff6900",
        "width": 20,
        "height": 40,
        "padding": 20,
        "borderRadius": 0
      },
      "mediaProps": {
        "type": "image|video|iframe",
        "url": "media-url",
        "width": 200,
        "height": 150
      }
    }
  ]
}
```

## Infobox Types
- **Text**: Simple text infoboxes
- **Block**: Text with a visual block above (supports dollar value calculations)
- **Media**: Text with images, videos, or embedded content

## Features
- HTML support in titles and content
- Visual blocks with automatic width calculation based on dollar values
- Media embedding (images, videos, iframes)
- Timeline positioning (0-100%)
- Drag and drop positioning
- Export/import configurations
- Real-time preview

## File Structure
- `configurator.html` - The configurator interface
- `index.html` - The main visualization page
- `Config Files/` - Directory for configuration files
- `active-config.json` - The active configuration file (rename your downloaded file to this)

## Troubleshooting
- If changes don't appear, check the browser console for errors
- Make sure the JSON file is properly formatted
- Verify the file path is correct (`Config Files/active-config.json`)
- Clear browser cache if needed 