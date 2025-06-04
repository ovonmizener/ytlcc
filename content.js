console.log('Content script loaded');

// Create caption container
const captionContainer = document.createElement('div');
captionContainer.id = 'live-caption-container';
captionContainer.style.cssText = `
    position: fixed;
    bottom: 60px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
    font-size: 18px;
    max-width: 80%;
    text-align: center;
    z-index: 9999;
    display: none;
`;
document.body.appendChild(captionContainer);
console.log('Caption container created and added to page');

let audioContext = null;
let sourceNode = null;
let analyser = null;
let isCapturing = false;

// Function to process audio stream
async function processAudioStream(stream) {
    try {
        console.log('Processing audio stream');
        
        // Create audio context
        audioContext = new AudioContext();
        
        // Create source from stream
        sourceNode = audioContext.createMediaStreamSource(stream);
        
        // Create and configure analyzer
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.3;
        
        // Connect nodes
        sourceNode.connect(analyser);
        analyser.connect(audioContext.destination);
        
        // Start processing
        isCapturing = true;
        processAudio();
        
        console.log('Audio processing started');
        return true;
    } catch (error) {
        console.error('Error processing audio stream:', error);
        return false;
    }
}

// Function to process audio
function processAudio() {
    if (!isCapturing || !analyser) return;

    try {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);

        // Calculate audio level
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            const amplitude = Math.abs(dataArray[i] - 128);
            sum += amplitude;
        }
        const audioLevel = sum / bufferLength / 128;

        // Update caption based on audio level
        if (audioLevel > 0.01) {
            updateCaption(`Audio Level: ${(audioLevel * 100).toFixed(1)}%`);
            console.log('Audio detected:', audioLevel);
        } else {
            updateCaption('Waiting for audio...');
        }

        // Schedule next processing
        requestAnimationFrame(processAudio);
    } catch (error) {
        console.error('Error processing audio:', error);
        stopAudioCapture();
    }
}

// Function to stop audio capture
function stopAudioCapture() {
    console.log('Stopping audio capture');
    isCapturing = false;
    
    if (sourceNode) {
        sourceNode.disconnect();
        sourceNode = null;
    }
    
    if (analyser) {
        analyser.disconnect();
        analyser = null;
    }
    
    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }
    
    clearCaption();
    console.log('Audio capture stopped');
}

// Function to update caption
function updateCaption(text) {
    console.log('Updating caption:', text);
    captionContainer.textContent = text;
    captionContainer.style.display = 'block';
}

// Function to clear caption
function clearCaption() {
    console.log('Clearing caption');
    captionContainer.style.display = 'none';
    captionContainer.textContent = '';
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Content script received message:', request);
    
    if (request.action === "captureStarted") {
        console.log('Capture started:', request);
        if (request.success) {
            updateCaption('Audio capture started...');
        } else {
            updateCaption(`Error: ${request.error || 'Failed to start capture'}`);
        }
    } else if (request.action === "captureStopped") {
        console.log('Capture stopped');
        stopAudioCapture();
    }
});

// Check if we're on a YouTube page and if it's a live stream
function isYouTubeLiveStream() {
    const isLive = window.location.hostname === 'www.youtube.com' && 
                  document.querySelector('.ytp-live-badge') !== null;
    console.log('Is YouTube live stream:', isLive);
    return isLive;
}

// Initialize when the page is fully loaded
window.addEventListener('load', () => {
    console.log('Page loaded, checking if YouTube live stream');
    if (isYouTubeLiveStream()) {
        console.log('YouTube live stream detected, requesting status');
        // Request current status from background script
        chrome.runtime.sendMessage({ action: "getStatus" }, (response) => {
            console.log('Received status response:', response);
            if (response && response.status === "active") {
                console.log('Captions are active');
                updateCaption('Waiting for audio capture...');
            }
        });
    }
}); 