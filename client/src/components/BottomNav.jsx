import { NavLink } from "react-router-dom";

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" end className={({ isActive }) => `bottom-nav__link${isActive ? " active" : ""}`}>
        <span className="bottom-nav__icon" aria-hidden="true">
          📷
        </span>
        Log
      </NavLink>
      <NavLink to="/history" className={({ isActive }) => `bottom-nav__link${isActive ? " active" : ""}`}>
        <span className="bottom-nav__icon" aria-hidden="true">
          📊
        </span>
        History
      </NavLink>
    </nav>
  );
}
