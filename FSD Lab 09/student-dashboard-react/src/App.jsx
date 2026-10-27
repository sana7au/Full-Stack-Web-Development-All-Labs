// App.jsx - Main Dashboard Component that combines all subcomponents
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import StudentTable from './components/StudentTable';
import RecentActivity from './components/RecentActivity';
import './App.css';

function App() {
  return (
    <div className="dashboard-layout">
      {/* 1. Left Navigation Sidebar */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <div className="main-wrapper">
        {/* Top Header */}
        <Header />

        {/* Dashboard Main Workspace */}
        <main className="dashboard-content">
          {/* Key Metric Summary Cards */}
          <SummaryCards />

          {/* Main Content Grid: Table and Recent Activity */}
          <div className="content-grid">
            <StudentTable />
            <RecentActivity />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
