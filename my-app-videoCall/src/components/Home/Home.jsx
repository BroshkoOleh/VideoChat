import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CallingModal from '../CallingModal/CallingModal';
import { createMeeting } from '../../utils/videoSdkHelpers/API';
import socketService from '../../utils/socket';
import styles from './Home.module.scss';



// Main Home Component
const Home = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState('');
  const [callState, setCallState] = useState('idle');
  const [currentCall, setCurrentCall] = useState(null);
  const [meetingId, setMeetingId] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  // Authentication check
  useEffect(() => {
    const authData = localStorage.getItem('videocall-auth');
    if (!authData) {
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(authData);
      setCurrentUser(userData);
      
      // Connect to WebSocket
      initializeSocket(userData);
    } catch (error) {
      console.error('Auth error:', error);
      navigate('/login');
    }
  }, [navigate]);

  // Initialize WebSocket connection
  const initializeSocket = (userData) => {
    socketService.connect();

    // Set up event listeners
    socketService.on('connect', () => {
      console.log('🔌 WebSocket connected, registering user:', userData);
      setIsSocketConnected(true);
      
      // Register user AFTER connection is established
      socketService.registerUser(userData);
      socketService.getOnlineUsers();
    });

    socketService.on('disconnect', () => {
      setIsSocketConnected(false);
    });

    socketService.on('users-updated', (users) => {
      console.log('👥 Users updated:', users);
      
      // Filter out duplicates by user key, keep only the latest connection
      const uniqueUsers = users.reduce((acc, user) => {
        const existingIndex = acc.findIndex(u => u.key === user.key);
        if (existingIndex >= 0) {
          // Replace with newer connection (assuming later entries are newer)
          acc[existingIndex] = user;
        } else {
          acc.push(user);
        }
        return acc;
      }, []);
      
      console.log('👥 Unique users:', uniqueUsers);
      setOnlineUsers(uniqueUsers);
    });

    socketService.on('incoming-call', (callData) => {
      console.log('📞 Incoming call:', callData);
      setCurrentCall(callData);
      setCallState('receiving');
      setMeetingId(callData.meetingId);
    });

    socketService.on('call-accepted', (data) => {
      console.log('✅ Call accepted:', data);
      setCallState('in-call');
    });

    socketService.on('call-rejected', (data) => {
      console.log('❌ Call rejected:', data);
      setCallState('idle');
      setCurrentCall(null);
      setMeetingId('');
    });

    socketService.on('call-cancelled', (data) => {
      console.log('❌ Call cancelled:', data);
      setCallState('idle');
      setCurrentCall(null);
      setMeetingId('');
    });

    socketService.on('call-ended', (data) => {
      console.log('📞 Call ended:', data);
      setCallState('idle');
      setCurrentCall(null);
      setMeetingId('');
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      socketService.disconnect();
    };
  }, []);

  // Filter available users (exclude current user)
  const availableUsers = onlineUsers.filter(user => user.key !== currentUser?.key);

  // Auto-select first available user
  useEffect(() => {
    if (availableUsers.length > 0 && !selectedUser) {
      setSelectedUser(availableUsers[0].key);
    }
  }, [availableUsers, selectedUser]);

  const handleLogout = () => {
    localStorage.removeItem('videocall-auth');
    socketService.disconnect();
    
    // Dispatch custom event for auth sync
    window.dispatchEvent(new CustomEvent('auth-change'));
    navigate('/login');
  };

  const handleMakeCall = async (type) => {
    if (!selectedUser || !currentUser) return;

    try {
      const newMeetingId = await createMeeting();
      const targetUser = availableUsers.find(u => u.key === selectedUser);
      
      if (!targetUser) {
        alert('Користувач недоступний');
        return;
      }

      setMeetingId(newMeetingId);
      setCallState('calling');
      
      const callData = {
        to: targetUser.key,
        from: currentUser,
        meetingId: newMeetingId,
        type
      };

      setCurrentCall(callData);
      socketService.initiateCall(callData);
      
    } catch (error) {
      console.error('Call error:', error);
      alert('Помилка при створенні дзвінка');
    }
  };

// handleAcceptCall видалено - тепер обробляється всередині MeetingView компонента

  const handleRejectCall = () => {
    if (!currentCall) return;

    socketService.rejectCall({
      meetingId: currentCall.meetingId,
      from: currentCall.from
    });

    setCallState('idle');
    setCurrentCall(null);
    setMeetingId('');
  };

  const handleCancelCall = () => {
    if (!currentCall) return;

    socketService.cancelCall({
      meetingId: currentCall.meetingId,
      to: currentCall.to
    });

    setCallState('idle');
    setCurrentCall(null);
    setMeetingId('');
  };

  const handleEndCall = () => {
    if (!currentCall) return;

    socketService.endCall({
      meetingId: currentCall.meetingId,
      to: currentCall.to,
      from: currentUser
    });

    setCallState('idle');
    setCurrentCall(null);
    setMeetingId('');
  };

  if (!currentUser) {
    return <div className={styles.loading}>Завантаження...</div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            <img src={currentUser.avatar} alt={currentUser.name} />
            <span className={styles.statusIndicator}></span>
          </div>
          <div className={styles.userDetails}>
            <h2>{currentUser.name}</h2>
            <p className={styles.status}>
              {isSocketConnected ? '🟢 Онлайн' : '🔴 Офлайн'}
            </p>
          </div>
        </div>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Вийти
        </button>
      </header>

      <main className={styles.main}>
        {callState === 'idle' && (
          <div className={styles.callSection}>
            <h3>Користувачі онлайн ({onlineUsers.length})</h3>
            
            {availableUsers.length > 0 ? (
              <>
                <div className={styles.userSelector}>
                  <label htmlFor="user-select">Дзвонити до:</label>
                  <select 
                    id="user-select"
                    value={selectedUser} 
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className={styles.selectUser}
                  >
                                         {availableUsers.map(user => (
                       <option key={user.socketId} value={user.key}>
                         {user.name} ({user.status})
                       </option>
                     ))}
                  </select>
                </div>

                <div className={styles.callButtons}>
                  <button 
                    onClick={() => handleMakeCall('audio')}
                    className={`${styles.callBtn} ${styles.audioCall}`}
                  >
                    📞 Аудіо дзвінок
                  </button>
                  <button 
                    onClick={() => handleMakeCall('video')}
                    className={`${styles.callBtn} ${styles.videoCall}`}
                  >
                    📹 Відео дзвінок
                  </button>
                </div>
              </>
            ) : (
              <p className={styles.noUsers}>Немає доступних користувачів</p>
            )}

            <div className={styles.onlineUsers}>
              <h4>Онлайн користувачі:</h4>
              <ul>
                               {onlineUsers.map(user => (
                 <li key={user.socketId || user.key} className={styles.onlineUser}>
                   <span className={styles.userIndicator}>🟢</span>
                   {user.name}
                   {user.key === currentUser.key && ' (ви)'}
                 </li>
               ))}
              </ul>
            </div>
          </div>
        )}



        {/* Calling Modal */}
        <CallingModal
          isOpen={callState !== 'idle'}
          onMeetingLeave={callState === 'calling' ? handleCancelCall : callState === 'receiving' ? handleRejectCall : handleEndCall}
          userName={callState === 'calling' ? availableUsers.find(u => u.key === selectedUser)?.name : currentCall?.from?.name || 'Невідомий'}
          isAudioCall={currentCall?.type === 'audio'}
          meetingId={meetingId}
          callState={callState}
          currentUser={currentUser}
          onAcceptCall={() => {
            if (currentCall) {
              socketService.acceptCall({
                meetingId: currentCall.meetingId,
                from: currentCall.from
              });
              setCallState('in-call');
            }
          }}
        />
      </main>
    </div>
  );
};

export default Home; 