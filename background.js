// Service worker must be at the root level
console.log('Background script loaded');

let currentTab = null;
let mediaStream = null;
let isCapturing = false;

// Function to start tab capture
async function startTabCapture(tabId) {
    try {
        console.log('Starting tab capture for tab:', tabId);
        
        // Request tab capture
        const stream = await new Promise((resolve, reject) => {
            chrome.tabCapture.capture({
                audio: true,
                video: false
            }, (stream) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(stream);
                }
            });
        });

        if (!stream) {
            throw new Error('Failed to capture tab audio');
        }

        console.log('Tab capture successful');
        mediaStream = stream;
        isCapturing = true;

        // Send success message to content script
        chrome.tabs.sendMessage(tabId, { 
            action: "captureStarted",
            success: true 
        });

        return true;
    } catch (error) {
        console.error('Error starting tab capture:', error);
        chrome.tabs.sendMessage(tabId, { 
            action: "captureStarted",
            success: false,
            error: error.message 
        });
        return false;
    }
}

// Function to stop tab capture
function stopTabCapture(tabId) {
    console.log('Stopping tab capture');
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
    }
    isCapturing = false;
    
    // Notify content script
    chrome.tabs.sendMessage(tabId, { 
        action: "captureStopped",
        success: true 
    });
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Background received message:', request);
    
    if (request.action === "startCaptioning") {
        chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
            if (tabs[0]) {
                currentTab = tabs[0].id;
                const success = await startTabCapture(currentTab);
                sendResponse({ success });
            } else {
                sendResponse({ success: false, error: "No active tab found" });
            }
        });
        return true; // Keep the message channel open for async response
    }
    
    if (request.action === "stopCaptioning") {
        if (currentTab) {
            stopTabCapture(currentTab);
            sendResponse({ success: true });
        } else {
            sendResponse({ success: false, error: "No active capture" });
        }
    }
    
    if (request.action === "getStatus") {
        sendResponse({ 
            status: isCapturing ? "active" : "inactive",
            tabId: currentTab
        });
    }
}); 