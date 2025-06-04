document.addEventListener('DOMContentLoaded', () => {
  console.log('Popup loaded');
  const startButton = document.getElementById('startButton');
  const statusDisplay = document.getElementById('status');
  const loadingDiv = document.querySelector('.loading');

  // Check initial status
  chrome.runtime.sendMessage({ action: "getStatus" }, (response) => {
    console.log('Initial status response:', response);
    if (response && response.status === "active") {
      startButton.textContent = "Stop Captions";
      statusDisplay.textContent = "Captions are active";
      statusDisplay.style.color = "#4CAF50";
    }
  });

  startButton.addEventListener('click', async () => {
    console.log('Button clicked');
    const isActive = startButton.textContent === "Stop Captions";

    try {
      if (!isActive) {
        console.log('Starting captions');
        startButton.disabled = true;
        loadingDiv.style.display = 'block';
        statusDisplay.textContent = "Initializing audio capture...";
        statusDisplay.style.color = "#FFA500";

        const response = await new Promise((resolve) => {
          chrome.runtime.sendMessage({ action: "startCaptioning" }, resolve);
        });

        console.log('Start response:', response);
        if (response && response.success) {
          startButton.textContent = "Stop Captions";
          statusDisplay.textContent = "Captions are active";
          statusDisplay.style.color = "#4CAF50";
        } else {
          throw new Error('Failed to start captioning');
        }
      } else {
        console.log('Stopping captions');
        const response = await new Promise((resolve) => {
          chrome.runtime.sendMessage({ action: "stopCaptioning" }, resolve);
        });
        console.log('Stop response:', response);
        startButton.textContent = "Start Captions";
        statusDisplay.textContent = "Captions are inactive";
        statusDisplay.style.color = "#666";
      }
    } catch (error) {
      console.error('Error:', error);
      statusDisplay.textContent = "Error: " + error.message;
      statusDisplay.style.color = "#f44336";
      startButton.textContent = "Start Captions";
    } finally {
      startButton.disabled = false;
      loadingDiv.style.display = 'none';
    }
  });
}); 