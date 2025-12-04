import { useState } from "react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

const Navbar = () => {
    const { user, signOut } = useAuth();
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };

    // TODO: 실제 화폐 데이터는 Firestore에서 가져오기
    const userMoney = 10000;

    return (
        <header className="navbar-header">
            <div className="navbar-logo">로비</div>

            <nav className="navbar-left">
                <NavLink to="/notice">공지</NavLink>
                <NavLink to="/stats">통계</NavLink>
                <NavLink to="/shop">아이템샵</NavLink>
                <NavLink to="/help">도움말</NavLink>
            </nav>

            <div className="navbar-right">
                <span className="user-money">${userMoney.toLocaleString()}</span>
                <span className="user-name">{user?.displayName || '익명'}</span>
                <button className="btn-text" onClick={() => setShowPasswordModal(true)}>비밀번호 변경</button>
                <button className="btn-logout" onClick={handleSignOut}>로그아웃</button>
            </div>

            {/* 비밀번호 변경 모달 - TODO: 구현 필요 */}
            {showPasswordModal && (
                <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>비밀번호 변경</h3>
                            <button className="modal-close" onClick={() => setShowPasswordModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p>비밀번호 변경 기능은 준비 중입니다.</p>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;