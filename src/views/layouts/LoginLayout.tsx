import { Outlet } from 'react-router-dom';
import loginBg from '../../assets/loginLayout.png';

export default function LoginLayout() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${loginBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <main
        style={{
          width: '100%',
          maxWidth: '500px',
          padding: '40px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderRadius: '16px',
          boxShadow: '0 0 20px rgba(0,0,0,0.6)',
          color: '#fff',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}