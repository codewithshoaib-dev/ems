import { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import api from "../../api/api";
import "./Dashboard.css"; // Import the new CSS file

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await api.get("api/admin/dashboard/stats");
        const summaryData = await api.get(`api/attendance/monthly/${user[0].id}`);
        setStats(dashboardData.data);
        setSummary(summaryData.data);
      } catch (error) {
        console.error("Dashboard loading error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-container">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="skeleton-card" />
        ))}
        <Skeleton className="skeleton-chart" />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-content">
          <h4 className="sidebar-title">Employee Overview</h4>
          <ul className="sidebar-links">
            <li>
              <Link to="/admin/employees" className="sidebar-link">
                Employee List
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Stat Cards */}
        <div className="stat-cards">
          <div className="card">
            <div className="card-content">
              <h3 className="card-title">Present Today</h3>
              <p className="card-value text-green">{stats.present_today}</p>
            </div>
          </div>

          <div className="card">
            <div className="card-content">
              <h3 className="card-title">Total Employees</h3>
              <p className="card-value text-blue">{stats.total_employees}</p>
            </div>
          </div>

          <div className="card">
            <div className="card-content">
              <h3 className="card-title">On Leave</h3>
              <p className="card-value text-yellow">{stats.on_leave_count}</p>
            </div>
          </div>

          <div className="card">
            <div className="card-content">
              <h3 className="card-title">Late Check-ins</h3>
              <p className="card-value text-red">{stats.late_checkins}</p>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts">
          <div className="card">
            <div className="card-content">
              <h3 className="card-title">Live Attendance</h3>
              <AttendanceChart data={stats} />
            </div>
          </div>

          <div className="card">
            <div className="card-content">
              <h3 className="card-title">Monthly Summary</h3>
              <MonthlySummaryChart data={summary} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton Component
function Skeleton({ className }) {
  return <div className={`skeleton ${className}`}></div>;
}

// AttendanceChart Component
function AttendanceChart({ data }) {
  return (
    <div className="chart">
      {/* Placeholder for Attendance Chart */}
      <p>Attendance Chart Placeholder</p>
    </div>
  );
}

// MonthlySummaryChart Component
function MonthlySummaryChart({ data }) {
  return (
    <div className="chart">
      {/* Placeholder for Monthly Summary Chart */}
      <p>Monthly Summary Chart Placeholder</p>
    </div>
  );
}