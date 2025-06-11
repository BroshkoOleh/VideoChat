import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.callbacks = new Map();
  }

  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io('http://localhost:3001', {
      transports: ['websocket'],
      upgrade: false,
      timeout: 5000,
      retryDelayOnCloseOrCreate: [1000, 2000, 5000, 10000]
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to WebSocket server:', this.socket.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Disconnected from WebSocket server:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.warn('⚠️ WebSocket connection error (це нормально в dev режимі):', error.message);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Register user on server
  registerUser(userData) {
    if (this.socket?.connected) {
      console.log('📝 Registering user on server:', userData);
      this.socket.emit('register-user', userData);
    } else {
      console.warn('❌ Cannot register user - socket not connected');
    }
  }

  // Initiate a call
  initiateCall(callData) {
    if (this.socket?.connected) {
      this.socket.emit('initiate-call', callData);
    }
  }

  // Accept a call
  acceptCall(callData) {
    if (this.socket?.connected) {
      this.socket.emit('accept-call', callData);
    }
  }

  // Reject a call
  rejectCall(callData) {
    if (this.socket?.connected) {
      this.socket.emit('reject-call', callData);
    }
  }

  // End a call
  endCall(callData) {
    if (this.socket?.connected) {
      this.socket.emit('end-call', callData);
    }
  }

  // Cancel a call
  cancelCall(callData) {
    if (this.socket?.connected) {
      this.socket.emit('cancel-call', callData);
    }
  }

  // Get online users
  getOnlineUsers() {
    if (this.socket?.connected) {
      this.socket.emit('get-online-users');
    }
  }

  // Listen for events
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
    // Store callback for reconnection
    this.callbacks.set(event, callback);
  }

  // Remove event listener
  off(event) {
    if (this.socket) {
      this.socket.off(event);
    }
    this.callbacks.delete(event);
  }

  // Check if connected
  isConnected() {
    return this.socket?.connected || false;
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService; 