import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.scss';

const users = [
  { key: 'alice', name: 'Alice Johnson', avatar: '/alice.jpg' },
  { key: 'bob', name: 'Bob Smith', avatar: '/bob.jpg' },
  { key: 'charlie', name: 'Charlie Brown', avatar: '/charlie.jpg' }
];

const Login = () => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState('alice');
  const [isLoading, setIsLoading] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    const authData = localStorage.getItem('videocall-auth');
    if (authData) {
      navigate('/home');
    }
  }, [navigate]);

  const handleLogin = () => {
    if (!selectedUser) return;

    setIsLoading(true);
    
    const userData = users.find(user => user.key === selectedUser);
    
    // Simulate login delay
    setTimeout(() => {
      localStorage.setItem('videocall-auth', JSON.stringify(userData));
      
      // Dispatch custom event for auth sync
      window.dispatchEvent(new CustomEvent('auth-change'));
      
      setIsLoading(false);
      navigate('/home');
    }, 500);
  };

  const selectedUserData = users.find(user => user.key === selectedUser);

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>Video Call App</h1>
        <p className={styles.subtitle}>Оберіть користувача для входу</p>
        
        <div className={styles.userSelection}>
          <div className={styles.userPreview}>
            {selectedUserData && (
              <>
                <div className={styles.avatar}>
                  <img src={selectedUserData.avatar} alt={selectedUserData.name} />
                </div>
                <h3>{selectedUserData.name}</h3>
              </>
            )}
          </div>

          <div className={styles.selectWrapper}>
            <select 
              value={selectedUser} 
              onChange={(e) => setSelectedUser(e.target.value)}
              className={styles.userSelect}
              disabled={isLoading}
            >
              {users.map(user => (
                <option key={user.key} value={user.key}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <button 
            onClick={handleLogin}
            className={styles.loginButton}
            disabled={isLoading || !selectedUser}
          >
            {isLoading ? 'Вхід...' : 'Увійти'}
          </button>
        </div>

        <div className={styles.info}>
          <p>💡 Відкрийте декілька вкладок з різними користувачами для тестування дзвінків</p>
        </div>
      </div>
    </div>
  );
};

export default Login; 