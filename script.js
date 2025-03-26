// Load face-api.js models
async function loadModels() {
    await faceapi.nets.tinyFaceDetector.loadFromUri('models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('models');
    console.log('Models loaded');
}

// Start webcam
async function startVideo() {
    const video = document.getElementById('video');
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        video.srcObject = stream;
    } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Could not access camera. Please enable camera permissions.");
    }
}

// Capture and recognize face
document.getElementById('captureBtn').addEventListener('click', async () => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const resultDiv = document.getElementById('attendanceResult');
    
    // Show loading state
    resultDiv.className = 'alert alert-info';
    resultDiv.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Recognizing face...';
    resultDiv.classList.remove('d-none');
    
    // Capture frame
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Detect faces
    const detections = await faceapi.detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();
    
    if (detections.length === 0) {
        resultDiv.className = 'alert alert-warning';
        resultDiv.innerHTML = '<i class="fas fa-exclamation-triangle me-2"></i> No face detected!';
        return;
    }
    
    // In a real app, you would compare with known face descriptors
    // For demo, we'll simulate recognition
    setTimeout(() => {
        const randomNames = ["Alex Johnson", "Maria Garcia", "James Smith", "Sarah Lee"];
        const randomStatus = ["Present", "Late"];
        const name = randomNames[Math.floor(Math.random() * randomNames.length)];
        const status = randomStatus[Math.floor(Math.random() * randomStatus.length)];
        
        // Update result
        resultDiv.className = `alert alert-${status === 'Present' ? 'success' : 'warning'}`;
        resultDiv.innerHTML = `<i class="fas fa-${status === 'Present' ? 'check-circle' : 'clock'} me-2"></i> 
                              ${name} marked as ${status}!`;
        
        // Add to attendance table
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        const tableRow = `
            <tr>
                <td>${Math.floor(Math.random() * 1000)}</td>
                <td>${name}</td>
                <td>${timeString}</td>
                <td class="attendance-${status.toLowerCase()}">${status}</td>
            </tr>
        `;
        document.getElementById('attendanceTable').insertAdjacentHTML('afterbegin', tableRow);
    }, 1500);
});

// Initialize
window.addEventListener('DOMContentLoaded', async () => {
    await loadModels();
    await startVideo();
    
    // Load sample attendance data
    const sampleData = [
        { id: 101, name: "Alex Johnson", time: "09:00 AM", status: "Present" },
        { id: 102, name: "Maria Garcia", time: "09:15 AM", status: "Late" },
        { id: 103, name: "James Smith", time: "08:55 AM", status: "Present" }
    ];
    
    sampleData.forEach(person => {
        const row = `
            <tr>
                <td>${person.id}</td>
                <td>${person.name}</td>
                <td>${person.time}</td>
                <td class="attendance-${person.status.toLowerCase()}">${person.status}</td>
            </tr>
        `;
        document.getElementById('attendanceTable').innerHTML += row;
    });
});