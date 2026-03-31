import { IconLogout } from "../ui/Icons";
import { logout } from "../../api/papers";

export default function Header({ user, onLogout }) {
  const handle = () => {
    logout();
    onLogout();
  };

  return (
    <header className="header">
      <div className="header-logo">
        SU-PYQ
        <span>Previous Year Question Papers</span>
      </div>
      <div className="header-right">
        <span className={`badge ${user.role}`}>
          {user.role === "admin" ? "Admin" : "Student"}
        </span>
        <span style={{ fontSize: "0.88rem", color: "var(--ink-mid)" }}>{user.name}</span>
        <button className="icon-btn" onClick={handle}>
          <IconLogout /> Sign out
        </button>
      </div>
    </header>
  );
}