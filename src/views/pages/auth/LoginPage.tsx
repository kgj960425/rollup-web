import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 회원가입 모달 상태
  const [showRegister, setShowRegister] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  // 비밀번호 찾기 모달 상태
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const { signInWithEmail, signInWithGoogle, signUpWithEmail, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess(false);
    setResetLoading(true);

    try {
      await resetPassword(resetEmail);
      setResetSuccess(true);
    } catch (err) {
      setResetError('비밀번호 재설정 이메일 전송에 실패했습니다. 이메일을 확인해주세요.');
      console.error(err);
    } finally {
      setResetLoading(false);
    }
  };

  const openResetPasswordModal = () => {
    setResetEmail('');
    setResetError('');
    setResetSuccess(false);
    setShowResetPassword(true);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');

    if (registerPassword !== confirmPassword) {
      setRegisterError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (registerPassword.length < 6) {
      setRegisterError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    if (nickname.length < 2) {
      setRegisterError('닉네임은 2자 이상이어야 합니다.');
      return;
    }

    setRegisterLoading(true);

    try {
      await signUpWithEmail(registerEmail, registerPassword, nickname);
      navigate('/');
    } catch (err) {
      setRegisterError('회원가입에 실패했습니다. 다시 시도해주세요.');
      console.error(err);
    } finally {
      setRegisterLoading(false);
    }
  };

  const openRegisterModal = () => {
    setRegisterEmail('');
    setRegisterPassword('');
    setConfirmPassword('');
    setNickname('');
    setRegisterError('');
    setShowRegister(true);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmail(email, password);
      navigate('/rooms');
    } catch (err) {
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      await signInWithGoogle();
      navigate('/rooms');
    } catch (err) {
      setError('Google 로그인에 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>🎲 보드게임 플랫폼</h1>
          <p>로그인하여 다양한 보드게임을 즐겨보세요!</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleEmailLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="divider">
          <span>또는</span>
        </div>

        <button
          type="button"
          className="btn btn-google"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg className="google-icon" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google로 로그인
        </button>

        <div className="auth-links">
          <button type="button" className="link-button" onClick={openResetPasswordModal}>비밀번호 찾기</button>
          <span className="link-divider">|</span>
          <button type="button" className="link-button" onClick={openRegisterModal}>회원가입</button>
        </div>
      </div>

      {/* 회원가입 모달 */}
      {showRegister && (
        <div className="modal-overlay" onClick={() => setShowRegister(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>회원가입</h3>
              <button className="modal-close" onClick={() => setShowRegister(false)}>×</button>
            </div>

            {registerError && <div className="error-message">{registerError}</div>}

            <form onSubmit={handleRegister} className="login-form">
              <div className="form-group">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="닉네임 (2자 이상)"
                  required
                  disabled={registerLoading}
                />
              </div>

              <div className="form-group">
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  placeholder="이메일"
                  required
                  disabled={registerLoading}
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="비밀번호 (6자 이상)"
                  required
                  disabled={registerLoading}
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호 확인"
                  required
                  disabled={registerLoading}
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={registerLoading}>
                {registerLoading ? '가입 중...' : '회원가입'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 비밀번호 찾기 모달 */}
      {showResetPassword && (
        <div className="modal-overlay" onClick={() => setShowResetPassword(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>비밀번호 찾기</h3>
              <button className="modal-close" onClick={() => setShowResetPassword(false)}>×</button>
            </div>

            {resetError && <div className="error-message">{resetError}</div>}
            {resetSuccess && (
              <div className="success-message">
                비밀번호 재설정 이메일을 전송했습니다. 이메일을 확인해주세요.
              </div>
            )}

            {!resetSuccess ? (
              <form onSubmit={handleResetPassword} className="login-form">
                <p className="modal-description">
                  가입한 이메일 주소를 입력하면 비밀번호 재설정 링크를 보내드립니다.
                </p>
                <div className="form-group">
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="이메일"
                    required
                    disabled={resetLoading}
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={resetLoading}>
                  {resetLoading ? '전송 중...' : '이메일 전송'}
                </button>
              </form>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowResetPassword(false)}
              >
                확인
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
