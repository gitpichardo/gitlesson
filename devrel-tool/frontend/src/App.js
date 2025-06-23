import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Feedback from './pages/Feedback';
import Issues from './pages/Issues';
import Content from './pages/Content';
import Community from './pages/Community';
import Analytics from './pages/Analytics';
import Releases from './pages/Releases';
import Integrations from './pages/Integrations';

function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar onMenuClick={handleSidebarToggle} />
      <Sidebar open={sidebarOpen} onToggle={handleSidebarToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: sidebarOpen ? '240px' : '60px',
          transition: 'margin-left 0.3s',
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/issues" element={<Issues />} />
          <Route path="/content" element={<Content />} />
          <Route path="/community" element={<Community />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/releases" element={<Releases />} />
          <Route path="/integrations" element={<Integrations />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;