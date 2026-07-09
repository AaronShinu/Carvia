import { NavLink, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import './DashboardLayout.css'

export default function DashboardLayout() {
    const { user, logout } = useAuth()

    const handleLogout = async () => {
        await logout()
    } 

    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="sidebar-logo">Carvia</div>

                <nav className="sidebar-nav">
                    <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
                        Dashboard
                    </NavLink>
                    <NavLink to="/calendar" end className={({ isActive }) => (isActive ? "active" : "")}>
                        Calendar
                    </NavLink>
                    <NavLink to="/applications" end className={({ isActive }) => (isActive ? "active" : "")}>
                        Applications
                    </NavLink>
                    <NavLink to="/documents" end className={({ isActive }) => (isActive ? "active" : "")}>
                        Documents
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <div className="sidebar-user">
                        {user?.firstname || user?.email} 
                    </div>
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </aside>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    )
}