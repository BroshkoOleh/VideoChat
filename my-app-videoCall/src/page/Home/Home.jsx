import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CallingModal from '../../components/CallingModal/CallingModal'
import { authToken, createMeeting } from '../../utils/videoSdkHelpers/API'
import styles from './Home.module.scss'

const users = {
  user1: {
    id: 'user-001',
    name: 'Alice Johnson',
    avatar: '👩‍💼',
    status: 'online'
  },
  user2: {
    id: 'user-002', 
    name: 'Bob Smith',
    avatar: '👨‍💻',
    status: 'online'
  },
  user3: {
    id: 'user-003',
    name: 'Charlie Brown', 
    avatar: '👨‍🎨',
    status: 'online'
  }
};

function Home() {
  const [isCallingModalOpen, setIsCallingModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [selectedUserToCall, setSelectedUserToCall] = useState('user1')
  const [meetingId, setMeetingId] = useState(null)
  const [callState, setCallState] = useState('idle') // 'idle', 'calling', 'receiving', 'in-call'
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('currentUser')
    if (!userData) {
      navigate('/login')
      return
    }
    const user = JSON.parse(userData)
    setCurrentUser(user)
    
    // Set the first available user (not current) as selected for calling
    const availableUsers = Object.entries(users).filter(([key]) => key !== user.key)
    if (availableUsers.length > 0) {
      setSelectedUserToCall(availableUsers[0][0])
    }
  }, [navigate])

  const handleAudioCall = async () => {
    try {
      // Create a new meeting
      const newMeetingId = await createMeeting({ token: authToken })
      setMeetingId(newMeetingId)
      setCallState('calling')
      setIsCallingModalOpen(true)
      
      // Here you would typically send a call invitation to the selected user
      // For now, we'll simulate this by logging
      console.log(`Calling ${users[selectedUserToCall].name} with meeting ID: ${newMeetingId}`)
      
    } catch (error) {
      console.error('Error creating meeting:', error)
    }
  }

  const onMeetingLeave = () => {
    setIsCallingModalOpen(false)
    setMeetingId(null)
    setCallState('idle')
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    
    // Send custom event for auth state update
    window.dispatchEvent(new CustomEvent('auth-change'))
    
    // Use window.location for guaranteed redirect
    window.location.href = '/login'
  }

  if (!currentUser) {
    return <div>Завантаження...</div>
  }

  // Filter users excluding the current user
  const availableUsersToCall = Object.entries(users).filter(([key]) => key !== currentUser.key)

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.currentUserInfo}>
            <h3>
              {currentUser.avatar} {currentUser.name}
            </h3>
            <p>Status: {currentUser.status}</p>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Вийти
          </button>
        </div>

        <div className={styles.userSelector}>
          <label htmlFor="user-to-call">Call to</label>
          <select 
            id="user-to-call"
            value={selectedUserToCall} 
            onChange={(e) => setSelectedUserToCall(e.target.value)}
          >
            {availableUsersToCall.map(([key, user]) => (
              <option key={key} value={key}>
                {user.avatar} {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.callButtons}>
          <button 
            onClick={handleAudioCall}
            disabled={callState !== 'idle'}
          >
            Audio Call
          </button>
          <button disabled={callState !== 'idle'}>Video Call</button>
        </div>
      </div> 

      <CallingModal 
        isOpen={isCallingModalOpen}
        onMeetingLeave={onMeetingLeave}
        userName={users[selectedUserToCall].name}
        isAudioCall={true}
        meetingId={meetingId}
        callState={callState}
        currentUser={currentUser}
      />
    </>
  )
}

export default Home 