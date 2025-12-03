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
          maxWidth: '380px',
          padding: '30px',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          color: '#fff',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}