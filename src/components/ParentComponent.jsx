// In the parent component
import React, { useState } from 'react';
import LoginPage from './LoginPage';

function ParentComponent() {
  const [loginError, setLoginError] = useState('');

  return (
    <div>
      {/* ... other components ... */}
      <LoginPage setError={setLoginError} /> {/* Pass setError as a prop */}
      {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
    </div>
  );
}

export default ParentComponent;