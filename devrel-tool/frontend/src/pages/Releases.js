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
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Rocket as RocketIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Announcement as AnnouncementIcon,
} from '@mui/icons-material';

// Mock data
const mockReleases = [
  {
    id: 1,
    version: 'v2.1.0',
    title: 'Enhanced API Performance',
    description: 'Major performance improvements and new features',
    status: 'released',
    release_date: '2024-01-15T10:00:00Z',
    repository: 'openhands/core',
    communication_plan: [
      { channel: 'github', status: 'completed' },
      { channel: 'blog', status: 'completed' },
      { channel: 'slack', status: 'completed' },
    ],
  },
  {
    id: 2,
    version: 'v2.2.0',
    title: 'New Integration Features',
    description: 'Added support for multiple new integrations',
    status: 'in_progress',
    release_date: '2024-01-30T10:00:00Z',
    repository: 'openhands/core',
    communication_plan: [
      { channel: 'github', status: 'planned' },
      { channel: 'blog', status: 'planned' },
      { channel: 'slack', status: 'planned' },
    ],
  },
  {
    id: 3,
    version: 'v2.3.0',
    title: 'UI/UX Improvements',
    description: 'Complete redesign of the user interface',
    status: 'planned',
    release_date: '2024-02-15T10:00:00Z',
    repository: 'openhands/frontend',
    communication_plan: [],
  },
];

const statusColors = {
  planned: 'default',
  in_progress: 'warning',
  released: 'success',
};

const statusIcons = {
  planned: <ScheduleIcon />,
  in_progress: <RocketIcon />,
  released: <CheckCircleIcon />,
};

function Releases() {
  const [releases] = useState(mockReleases);

  const getUpcomingReleases = () => {
    return releases.filter(r => r.status !== 'released').length;
  };

  const getReleasedThisMonth = () => {
    const thisMonth = new Date().getMonth();
    return releases.filter(r => {
      const releaseMonth = new Date(r.release_date).getMonth();
      return r.status === 'released' && releaseMonth === thisMonth;
    }).length;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Release Management
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Plan Release
        </Button>
      </Box>

      {/* Release Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              {releases.length}
            </Typography>
            <Typography variant="body2">Total Releases</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main">
              {getUpcomingReleases()}
            </Typography>
            <Typography variant="body2">Upcoming</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main">
              {getReleasedThisMonth()}
            </Typography>
            <Typography variant="body2">Released This Month</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="info.main">
              {releases.filter(r => r.status === 'in_progress').length}
            </Typography>
            <Typography variant="body2">In Progress</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Release Timeline */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Release Timeline
            </Typography>
            <Timeline>
              {releases.map((release, index) => (
                <TimelineItem key={release.id}>
                  <TimelineSeparator>
                    <TimelineDot color={statusColors[release.status]}>
                      {statusIcons[release.status]}
                    </TimelineDot>
                    {index < releases.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Card sx={{ mb: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Box>
                            <Typography variant="h6" component="div">
                              {release.version} - {release.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {release.repository}
                            </Typography>
                          </Box>
                          <Chip
                            label={release.status}
                            color={statusColors[release.status]}
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" paragraph>
                          {release.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Release Date: {new Date(release.release_date).toLocaleDateString()}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <IconButton size="small">
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small">
                          <AnnouncementIcon />
                        </IconButton>
                      </CardActions>
                    </Card>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Paper>
        </Grid>

        {/* Communication Status */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Communication Status
            </Typography>
            {releases.map((release) => (
              <Card key={release.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    {release.version}
                  </Typography>
                  {release.communication_plan.length > 0 ? (
                    release.communication_plan.map((comm, index) => (
                      <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">
                          {comm.channel}
                        </Typography>
                        <Chip
                          label={comm.status}
                          size="small"
                          color={comm.status === 'completed' ? 'success' : 'default'}
                        />
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No communication plan yet
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Releases;