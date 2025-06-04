# Live Caption Translation

A Chrome extension that provides real-time caption translation for live streams. Currently in development, this extension aims to capture audio from live streams, transcribe it, and provide translations in the user's preferred language.

## Current Status

The extension is currently in the development phase, working on implementing audio capture functionality. The current implementation includes:

- Basic extension structure with popup interface
- Audio capture setup using Chrome's tabCapture API
- Caption display system
- Integration with LibreTranslate for translations

## Features (Planned)

- Real-time audio capture from live streams
- Speech-to-text transcription
- Translation to multiple languages
- Customizable caption display
- Support for various live streaming platforms (starting with YouTube)
- Language selection interface
- Caption styling options

## Technical Challenges

The project is currently working on overcoming several technical challenges:

1. Audio Capture
   - Implementing reliable tab audio capture
   - Processing audio streams in real-time

2. Speech Recognition
   - Converting captured audio to text
   - Handling multiple languages and accents

3. Translation
   - Real-time translation of transcribed text
   - Maintaining translation quality and speed

## Development

### Prerequisites

- Chrome browser
- Basic understanding of Chrome extension development

### Installation

1. Clone the repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extension directory

### Project Structure

```
├── manifest.json      # Extension configuration
├── popup.html        # Extension popup interface
├── popup.js          # Popup functionality
├── background.js     # Background service worker
├── content.js        # Content script for page interaction
├── styles.css        # Styling for captions and popup
└── icons/           # Extension icons
```

## Future Goals

- Support for multiple streaming platforms
- Enhanced translation quality
- Customizable caption styles
- Offline translation capabilities
- Performance optimizations
- User settings persistence
- Multiple language support for both transcription and translation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- LibreTranslate for translation services
- Chrome Extension documentation
- Web Speech API documentation 