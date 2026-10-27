import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import ProjectIntro from './components/ProjectIntro.jsx';
import StatCards from './components/StatCards.jsx';
import Heatmap from './components/Heatmap.jsx';
import TopIssues from './components/TopIssues.jsx';
import PollSection from './components/PollSection.jsx';
import Footer from './components/Footer.jsx';
import './App.css';
import './components/components.css';

// To add a new section later: create a component file,
// import it above and place it inside <main> below.
function App() {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="app-body">
        <Header />

        <main className="main-content">
          <ProjectIntro />
          <StatCards />

          <div className="two-column">
            <Heatmap />
            <TopIssues />
          </div>

          <PollSection />
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
