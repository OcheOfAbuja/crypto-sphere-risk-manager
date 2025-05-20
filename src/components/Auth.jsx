import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';

function Auth() {
  const { login } = useAuth();

  return (
    <div className="auth-container">
      <h1>Crypto Sphere Risk Manager</h1>
      <GoogleLogin
        onSuccess={credentialResponse => {
          login(credentialResponse.credential);
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />
      <div className="activation-code">
        <input type="text" placeholder="Enter Activation Code" />
        <button>Verify</button>
      </div>
    </div>
  );
}

export default Auth;