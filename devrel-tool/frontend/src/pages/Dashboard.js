import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  BugReport,
  Article,
  People,
  Feedback as FeedbackIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Mock data - in production, this would come from the API
const mockStats = {
  open_issues: 42,
  pending_feedback: 15,
  content_in_progress: 8,
  community_health_score: 85,
};

const mockActivity = [
  {
    type: 'feedback',
    message: 'New feedback from GitHub issue #123',
    timestamp: '2024-01-15T10:30:00Z',
  },
  {
    type: 'issue',
    message: 'High priority issue assigned to team',
    timestamp: '2024-01-15T09:15:00Z',
  },
  {
    type: 'content',
    message: "Blog post published: 'Getting Started with OpenHands'",
    timestamp: '2024-01-15T08:00:00Z',
  },
];

const mockTrendData = [
  { name: 'Jan', feedback: 65, issues: 28, content: 12 },
  { name: 'Feb', feedback: 59, issues: 32, content: 15 },
  { name: 'Mar', feedback: 80, issues: 25, content: 18 },
  { name: 'Apr', feedback: 81, issues: 30, content: 22 },
  { name: 'May', feedback: 56, issues: 20, content: 25 },
  { name: 'Jun', feedback: 55, issues: 18, content: 28 },
];

const mockSentimentData = [
  { name: 'Positive', value: 60, color: '#4caf50' },
  { name: 'Neutral', value: 25, color: '#ff9800' },
  { name: 'Negative', value: 15, color: '#f44336' },
];

function StatCard({ title, value, icon, color, subtitle }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              backgroundColor: color,
              borderRadius: 1,
              p: 1,
              mr: 2,
              color: 'white',
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ mb: 1 }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const [stats, setStats] = useState(mockStats);
  const [activity, setActivity] = useState(mockActivity);

  useEffect(() => {
    // In production, fetch real data from API
    // fetchDashboardData();
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'feedback':
        return <FeedbackIcon color="primary" />;
      case 'issue':
        return <BugReport color="error" />;
      case 'content':
        return <Article color="success" />;
      default:
        return <TrendingUp />;
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Open Issues"
            value={stats.open_issues}
            icon={<BugReport />}
            color="#f44336"
            subtitle="Requires attention"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Feedback"
            value={stats.pending_feedback}
            icon={<FeedbackIcon />}
            color="#ff9800"
            subtitle="Awaiting review"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Content in Progress"
            value={stats.content_in_progress}
            icon={<Article />}
            color="#2196f3"
            subtitle="Being created"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Community Health"
            value={`${stats.community_health_score}%`}
            icon={<People />}
            color="#4caf50"
            subtitle="Overall score"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Trends Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Activity Trends
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="feedback"
                  stroke="#ff9800"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="issues"
                  stroke="#f44336"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="content"
                  stroke="#4caf50"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Sentiment Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Feedback Sentiment
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockSentimentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {mockSentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {activity.map((item, index) => (
                <ListItem key={index} divider={index < activity.length - 1}>
                  <ListItemIcon>{getActivityIcon(item.type)}</ListItemIcon>
                  <ListItemText
                    primary={item.message}
                    secondary={formatTimestamp(item.timestamp)}
                  />
                  <Chip
                    label={item.type}
                    size="small"
                    variant="outlined"
                    sx={{ ml: 1 }}
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

export default Dashboard;