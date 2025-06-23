import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  VideoCall as VideoCallIcon,
  Code as CodeIcon,
  Help as HelpIcon,
  Star as StarIcon,
} from '@mui/icons-material';

// Mock data
const mockMembers = [
  {
    id: 1,
    username: 'developer123',
    engagement_level: 'power_user',
    contributions: ['5 PRs', '12 Issues', '8 Discussions'],
    last_activity: '2024-01-15T10:30:00Z',
    joined_at: '2023-06-15T10:30:00Z',
  },
  {
    id: 2,
    username: 'jane_coder',
    engagement_level: 'contributor',
    contributions: ['15 PRs', '3 Issues', '25 Discussions'],
    last_activity: '2024-01-14T15:20:00Z',
    joined_at: '2023-03-10T10:30:00Z',
  },
];

const mockSessions = [
  {
    id: 1,
    member_id: 1,
    type: 'pair_programming',
    status: 'scheduled',
    description: 'Help with API integration',
    scheduled_at: '2024-01-16T14:00:00Z',
  },
  {
    id: 2,
    member_id: 2,
    type: 'debugging',
    status: 'completed',
    description: 'Debug performance issue',
    scheduled_at: '2024-01-15T10:00:00Z',
  },
];

const engagementColors = {
  newcomer: 'default',
  regular: 'primary',
  power_user: 'warning',
  contributor: 'success',
};

const sessionTypeIcons = {
  pair_programming: <CodeIcon />,
  debugging: <HelpIcon />,
  consultation: <VideoCallIcon />,
};

function Community() {
  const [members] = useState(mockMembers);
  const [sessions] = useState(mockSessions);

  const getHealthScore = () => {
    const total = members.length;
    const powerUsers = members.filter(m => m.engagement_level === 'power_user').length;
    const contributors = members.filter(m => m.engagement_level === 'contributor').length;
    
    return Math.round(((powerUsers + contributors) / total) * 100);
  };

  const healthScore = getHealthScore();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Community Management
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Add Member
        </Button>
      </Box>

      {/* Community Health Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Community Health Score
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h3" color="primary" sx={{ mr: 2 }}>
                {healthScore}%
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={healthScore}
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography variant="h6" color="text.secondary">
                  {members.length}
                </Typography>
                <Typography variant="body2">Total Members</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="h6" color="warning.main">
                  {members.filter(m => m.engagement_level === 'power_user').length}
                </Typography>
                <Typography variant="body2">Power Users</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="h6" color="success.main">
                  {members.filter(m => m.engagement_level === 'contributor').length}
                </Typography>
                <Typography variant="body2">Contributors</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="h6" color="primary">
                  {sessions.filter(s => s.status === 'completed').length}
                </Typography>
                <Typography variant="body2">Sessions Completed</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Sessions
            </Typography>
            <Typography variant="h4" color="primary" gutterBottom>
              {sessions.filter(s => s.status === 'scheduled').length}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<ScheduleIcon />}
              fullWidth
              sx={{ mt: 2 }}
            >
              Schedule Session
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Community Members */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Community Members
            </Typography>
            <List>
              {members.map((member) => (
                <ListItem key={member.id} divider>
                  <ListItemAvatar>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1">
                          {member.username}
                        </Typography>
                        <Chip
                          label={member.engagement_level}
                          size="small"
                          color={engagementColors[member.engagement_level]}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {member.contributions.join(' • ')}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Last active: {new Date(member.last_activity).toLocaleDateString()}
                        </Typography>
                      </Box>
                    }
                  />
                  <IconButton size="small">
                    <VideoCallIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Support Sessions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Support Sessions
            </Typography>
            <List>
              {sessions.map((session) => (
                <ListItem key={session.id} divider>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {sessionTypeIcons[session.type]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1">
                          {session.type.replace('_', ' ')}
                        </Typography>
                        <Chip
                          label={session.status}
                          size="small"
                          color={session.status === 'completed' ? 'success' : 'warning'}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {session.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(session.scheduled_at).toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Community;