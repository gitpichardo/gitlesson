import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Feedback as FeedbackIcon,
  BugReport as IssuesIcon,
  Article as ContentIcon,
  People as CommunityIcon,
  Analytics as AnalyticsIcon,
  Rocket as ReleasesIcon,
  Integration as IntegrationsIcon,
} from '@mui/icons-material';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Feedback', icon: <FeedbackIcon />, path: '/feedback' },
  { text: 'Issues', icon: <IssuesIcon />, path: '/issues' },
  { text: 'Content', icon: <ContentIcon />, path: '/content' },
  { text: 'Community', icon: <CommunityIcon />, path: '/community' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
  { text: 'Releases', icon: <ReleasesIcon />, path: '/releases' },
  { text: 'Integrations', icon: <IntegrationsIcon />, path: '/integrations' },
];

function Sidebar({ open, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const drawerWidth = open ? 240 : 60;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          transition: 'width 0.3s',
          overflowX: 'hidden',
        },
      }}
    >
      {/* Toolbar spacing */}
      <div style={{ height: 64 }} />
      
      <Divider />
      
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <Tooltip title={!open ? item.text : ''} placement="right">
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;