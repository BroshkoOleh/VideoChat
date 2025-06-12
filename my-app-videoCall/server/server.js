const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configure Socket.IO with CORS
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Vite dev server
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors());
app.use(express.json());

// Store connected users
const connectedUsers = new Map();
const activeCalls = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User registration
  socket.on('register-user', (userData) => {
    console.log('User registered:', userData);
    
    // Remove any existing connections for this user
    for (const [socketId, user] of connectedUsers.entries()) {
      if (user.key === userData.key && socketId !== socket.id) {
        console.log(`Removing old connection for ${userData.name}: ${socketId}`);
        connectedUsers.delete(socketId);
      }
    }
    
    connectedUsers.set(socket.id, {
      ...userData,
      socketId: socket.id,
      status: 'online'
    });
    
    // Join user to their own room
    socket.join(userData.key);
    
    // Broadcast updated user list to all clients
    io.emit('users-updated', Array.from(connectedUsers.values()));
  });

  // Initiate call
  socket.on('initiate-call', (callData) => {
    console.log('Call initiated:', callData);
    
    const { to, from, targetUser, meetingId, type } = callData;
    
    // Store active call
    activeCalls.set(meetingId, {
      ...callData,
      status: 'calling',
      timestamp: Date.now()
    });
    
    // Send call invitation to target user
    socket.to(to).emit('incoming-call', {
      from,
      targetUser,
      meetingId,
      type,
      timestamp: Date.now()
    });
    
    console.log(`Call from ${from.name} to ${to} with meeting ID: ${meetingId}`);
  });

  // Accept call
  socket.on('accept-call', (callData) => {
    console.log('Call accepted:', callData);
    
    const { meetingId, from } = callData;
    
    // Update call status
    if (activeCalls.has(meetingId)) {
      activeCalls.set(meetingId, {
        ...activeCalls.get(meetingId),
        status: 'accepted'
      });
    }
    
    // Notify caller that call was accepted
    socket.to(from.key).emit('call-accepted', {
      meetingId,
      timestamp: Date.now()
    });
  });

  // Reject call
  socket.on('reject-call', (callData) => {
    console.log('Call rejected:', callData);
    
    const { meetingId, from } = callData;
    
    // Update call status
    if (activeCalls.has(meetingId)) {
      activeCalls.set(meetingId, {
        ...activeCalls.get(meetingId),
        status: 'rejected'
      });
    }
    
    // Notify caller that call was rejected
    socket.to(from.key).emit('call-rejected', {
      meetingId,
      timestamp: Date.now()
    });
  });

  // End call
  socket.on('end-call', (callData) => {
    console.log('📞 Call ended:', callData);
    console.log('🔍 Socket ID:', socket.id);
    
    const { meetingId, to, from } = callData;
    
    // Get call info before deletion
    const call = activeCalls.get(meetingId);
    console.log('🔍 Active call before deletion:', call);
    console.log('🔍 Active calls count before:', activeCalls.size);
    
    // Remove active call
    activeCalls.delete(meetingId);
    console.log('🔍 Active calls count after deletion:', activeCalls.size);
    
    // Notify other participant(s)
    if (to) {
      console.log('📤 Sending call-ended to:', to);
      socket.to(to).emit('call-ended', {
        meetingId,
        from,
        timestamp: Date.now()
      });
    }
    
    // Also notify the caller (from) to ensure both participants get the event
    // This is important for proper media stream cleanup
    if (from && from.key) {
      console.log('📤 Sending call-ended to caller:', from.key);
      socket.to(from.key).emit('call-ended', {
        meetingId,
        from,
        timestamp: Date.now()
      });
    }
    
    // If we have call info, notify all participants in the call
    if (call) {
      console.log('📤 Broadcasting call-ended to all participants');
      // Broadcast to all participants to ensure cleanup
      io.to(call.from.key).emit('call-ended', {
        meetingId,
        from,
        timestamp: Date.now()
      });
      
      if (call.to && call.to !== call.from.key) {
        console.log('📤 Broadcasting call-ended to recipient:', call.to);
        io.to(call.to).emit('call-ended', {
          meetingId,
          from,
          timestamp: Date.now()
        });
      }
    }
    
    console.log('✅ End call processing complete');
  });

  // Cancel call (before it's answered)
  socket.on('cancel-call', (callData) => {
    console.log('Call cancelled:', callData);
    
    const { meetingId, to } = callData;
    
    // Remove active call
    activeCalls.delete(meetingId);
    
    // Notify receiver that call was cancelled
    socket.to(to).emit('call-cancelled', {
      meetingId,
      timestamp: Date.now()
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    const user = connectedUsers.get(socket.id);
    if (user) {
      console.log(`${user.name} disconnected`);
      
      // Remove user from connected users
      connectedUsers.delete(socket.id);
      
      // Cancel any active calls from this user
      for (const [meetingId, call] of activeCalls.entries()) {
        if (call.from.socketId === socket.id) {
          // Notify receiver that caller disconnected
          socket.to(call.to).emit('call-cancelled', {
            meetingId,
            reason: 'caller-disconnected',
            timestamp: Date.now()
          });
          activeCalls.delete(meetingId);
        }
      }
      
      // Broadcast updated user list
      io.emit('users-updated', Array.from(connectedUsers.values()));
    }
  });

  // Get online users
  socket.on('get-online-users', () => {
    socket.emit('users-updated', Array.from(connectedUsers.values()));
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    connectedUsers: connectedUsers.size,
    activeCalls: activeCalls.size,
    timestamp: new Date().toISOString()
  });
});

// Get active calls endpoint
app.get('/calls', (req, res) => {
  res.json({
    activeCalls: Array.from(activeCalls.entries()),
    count: activeCalls.size
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 WebSocket server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📞 Active calls: http://localhost:${PORT}/calls`);
});

// Clean up old calls every 5 minutes
setInterval(() => {
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  
  for (const [meetingId, call] of activeCalls.entries()) {
    if (now - call.timestamp > fiveMinutes) {
      console.log(`Cleaning up old call: ${meetingId}`);
      activeCalls.delete(meetingId);
    }
  }
}, 5 * 60 * 1000); 