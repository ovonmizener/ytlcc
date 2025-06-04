# Live Caption Translation Chrome Extension

A Chrome extension that provides real-time caption translation for YouTube live streams. This MVP version simulates the translation process for testing purposes.

## Features

- Real-time caption overlay for YouTube live streams
- Simulated Japanese translations with [Translated] tag
- Simple popup interface for controlling captions
- Clean, unobtrusive caption display

## Installation

1. Clone this repository or download the source code
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

## Usage

1. Navigate to any YouTube live stream
2. Click the extension icon in your Chrome toolbar
3. Click "Start Captions" to begin the simulated translation
4. The captions will appear at the bottom of the video
5. Click "Stop Captions" to disable the translation

## Project Structure

- `manifest.json`: Extension configuration and permissions
- `background.js`: Background service worker for caption simulation
- `content.js`: Content script for injecting and managing the caption overlay
- `popup.html` & `popup.js`: Extension popup interface
- `styles.css`: Styling for the caption overlay

## Future Enhancements

- Integration with real speech-to-text APIs
- Support for multiple languages
- Customizable caption styles and positions
- Error handling and recovery mechanisms
- User preferences for language selection

## Development

This is an MVP version that simulates the translation process. The next steps will involve:

1. Integrating actual speech-to-text services
2. Adding real translation capabilities
3. Implementing user configuration options
4. Adding error handling and recovery mechanisms

## Contributing

Feel free to submit issues and enhancement requests! 
