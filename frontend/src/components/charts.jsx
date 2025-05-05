// components/charts.js
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#4ade80', '#facc15', '#f87171', '#60a5fa'];

// AttendanceChart expects data with: id, username, status, check_in_time, check_out_time
export function AttendanceChart( {data} ) {
  const statusCounts = {
    "Present": data.present_days,
    "Total Employees": data.total_employees,
    "Incomplete": data.on_leave_count,
    "Leave": data.late_checkins
  };
  
  const pieData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
          label
        >
          {pieData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

// MonthlySummaryChart expects data with: id, username, total_hours, present_days, leave_days, incomplete_days
export function MonthlySummaryChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="username" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="present_days" fill="#4ade80" name="Present Days" />
        <Bar dataKey="leave_days" fill="#facc15" name="Leave Days" />
        <Bar dataKey="incomplete_days" fill="#f87171" name="Incomplete Days" />
      </BarChart>
    </ResponsiveContainer>
  );
}
