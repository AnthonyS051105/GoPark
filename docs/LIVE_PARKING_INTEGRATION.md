# Live Parking Backend Integration

## Overview

This document outlines the implementation plan for integrating real-time parking data and live footage with the Live Parking feature in the mobile app.

## Backend Requirements

### 1. Flask Server Setup

```python
# app.py
from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import cv2
import base64
import threading
import time

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Store connected clients
clients = {}
```

### 2. Camera Stream Handler

```python
class CameraStreamer:
    def __init__(self, camera_id=0):
        self.cap = cv2.VideoCapture(camera_id)
        self.is_streaming = False

    def start_stream(self):
        self.is_streaming = True
        thread = threading.Thread(target=self._stream_loop)
        thread.daemon = True
        thread.start()

    def _stream_loop(self):
        while self.is_streaming:
            ret, frame = self.cap.read()
            if ret:
                # Encode frame to base64
                _, buffer = cv2.imencode('.jpg', frame)
                frame_data = base64.b64encode(buffer).decode('utf-8')

                # Emit to all connected clients
                socketio.emit('video_frame', {
                    'data': frame_data,
                    'timestamp': time.time()
                })

            time.sleep(1/30)  # 30 FPS
```

### 3. Parking Data Manager

```python
class ParkingDataManager:
    def __init__(self):
        self.parking_data = {
            'pakuwon-basement': {
                'levels': [
                    {
                        'id': 'upper-basement',
                        'name': 'Upper Basement',
                        'spots': {'total': 150, 'occupied': 45, 'available': 105}
                    },
                    # ... other levels
                ]
            }
        }

    def update_parking_data(self, location_id, level_id, new_data):
        # Update parking spot data
        # This could be connected to sensors or manual updates
        self.parking_data[location_id]['levels'][level_id]['spots'] = new_data

        # Emit updated data to clients
        socketio.emit('parking_update', {
            'location_id': location_id,
            'level_id': level_id,
            'data': new_data,
            'timestamp': time.time()
        })
```

### 4. Socket.IO Event Handlers

```python
@socketio.on('connect')
def handle_connect():
    print(f'Client connected: {request.sid}')
    clients[request.sid] = {
        'connected_at': time.time(),
        'subscriptions': []
    }

@socketio.on('disconnect')
def handle_disconnect():
    print(f'Client disconnected: {request.sid}')
    if request.sid in clients:
        del clients[request.sid]

@socketio.on('subscribe_to_parking')
def handle_parking_subscription(data):
    location_id = data.get('location_id')
    clients[request.sid]['subscriptions'].append(location_id)

    # Send current parking data
    current_data = parking_manager.get_parking_data(location_id)
    emit('parking_data', current_data)

@socketio.on('subscribe_to_camera')
def handle_camera_subscription(data):
    camera_id = data.get('camera_id', 'pakuwon-basement')
    # Start camera stream if not already started
    if camera_id not in active_cameras:
        active_cameras[camera_id] = CameraStreamer()
        active_cameras[camera_id].start_stream()
```

## Mobile App Integration

### 1. Socket.IO Client Setup

```typescript
// services/SocketService.tsx
import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;

  connect(serverUrl: string) {
    this.socket = io(serverUrl);

    this.socket.on("connect", () => {
      console.log("Connected to server");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return this.socket;
  }

  subscribeToParking(locationId: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.emit("subscribe_to_parking", { location_id: locationId });
      this.socket.on("parking_update", callback);
    }
  }

  subscribeToCamera(cameraId: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.emit("subscribe_to_camera", { camera_id: cameraId });
      this.socket.on("video_frame", callback);
    }
  }
}

export default new SocketService();
```

### 2. Update LiveFootage Component

```typescript
// In LiveFootage.tsx
import SocketService from "../../services/SocketService";

useEffect(() => {
  // Connect to socket server
  const socket = SocketService.connect("ws://your-server-url:5000");

  // Subscribe to camera feed
  SocketService.subscribeToCamera(parkingLocation, (frameData) => {
    // Update video frame
    setVideoFrame(frameData.data);
    setConnectionStatus("connected");
  });

  return () => {
    socket?.disconnect();
  };
}, [parkingLocation]);
```

### 3. Update Live Parking Page

```typescript
// In live-parking.tsx
import SocketService from "../services/SocketService";

useEffect(() => {
  // Subscribe to parking data updates
  SocketService.subscribeToParking("pakuwon-basement", (data) => {
    // Update parking levels data
    setParkingLevels((prevLevels) =>
      prevLevels.map((level) =>
        level.id === data.level_id ? { ...level, spots: data.data } : level
      )
    );
  });
}, []);
```

## Installation & Dependencies

### Backend Dependencies

```bash
pip install flask flask-socketio opencv-python python-socketio
```

### Mobile App Dependencies

```bash
npm install socket.io-client
```

## Environment Configuration

### Backend (.env)

```
CAMERA_DEVICE_ID=0
SOCKET_PORT=5000
DEBUG=true
```

### Mobile App

Update your config to include the backend URL:

```typescript
// config/api.ts
export const API_CONFIG = {
  BASE_URL: "http://your-server-ip:5000",
  SOCKET_URL: "ws://your-server-ip:5000",
};
```

## Testing

1. Start the Flask server with Socket.IO support
2. Connect a camera to the server machine
3. Open the mobile app and navigate to Live Parking
4. Verify real-time updates for both parking data and video stream

## Security Considerations

1. Implement authentication for socket connections
2. Rate limiting for API calls
3. HTTPS/WSS for production
4. Input validation for all socket events
5. Camera access permissions

## Performance Optimization

1. Compress video frames before transmission
2. Implement adaptive quality based on connection speed
3. Cache parking data to reduce server load
4. Use Redis for real-time data storage
