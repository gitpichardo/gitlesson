import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

// Mock data
const mockKPIData = [
  { month: 'Jan', activationTime: 14.5, prVelocity: 18.5, docsSatisfaction: 78 },
  { month: 'Feb', activationTime: 13.2, prVelocity: 17.8, docsSatisfaction: 82 },
  { month: 'Mar', activationTime: 12.8, prVelocity: 16.2, docsSatisfaction: 85 },
  { month: 'Apr', activationTime: 11.5, prVelocity: 15.9, docsSatisfaction: 87 },
  { month: 'May', activationTime: 10.8, prVelocity: 14.5, docsSatisfaction: 89 },
  { month: 'Jun', activationTime: 10.2, prVelocity: 13.8, docsSatisfaction: 91 },
];

const mockFeedbackTrends = [
  { week: 'W1', positive: 65, neutral: 25, negative: 10 },
  { week: 'W2', positive: 70, neutral: 20, negative: 10 },
  { week: 'W3', positive: 68, neutral: 22, negative: 10 },
  { week: 'W4', positive: 75, neutral: 18, negative: 7 },
];

const mockContentMetrics = [
  { type: 'Blog Posts', published: 12, views: 15420, engagement: 8.5 },
  { type: 'Tutorials', published: 8, views: 22100, engagement: 12.3 },
  { type: 'Documentation', published: 25, views: 45600, engagement: 6.2 },
  { type: 'Templates', published: 15, views: 8900, engagement: 15.8 },
];

const mockCommunityGrowth = [
  { month: 'Jan', newMembers: 45, totalMembers: 1245 },
  { month: 'Feb', newMembers: 62, totalMembers: 1307 },
  { month: 'Mar', newMembers: 78, totalMembers: 1385 },
  { month: 'Apr', newMembers: 91, totalMembers: 1476 },
  { month: 'May', newMembers: 105, totalMembers: 1581 },
  { month: 'Jun', newMembers: 118, totalMembers: 1699 },
];

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function Analytics() {
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('6months');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Analytics & KPIs
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={handleTimeRangeChange}
          >
            <MenuItem value="1month">1 Month</MenuItem>
            <MenuItem value="3months">3 Months</MenuItem>
            <MenuItem value="6months">6 Months</MenuItem>
            <MenuItem value="1year">1 Year</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Key Metrics Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Avg Activation Time
              </Typography>
              <Typography variant="h4" component="div">
                10.2
              </Typography>
              <Typography variant="body2" color="success.main">
                ↓ 2.3 days from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                PR Review Time
              </Typography>
              <Typography variant="h4" component="div">
                13.8h
              </Typography>
              <Typography variant="body2" color="success.main">
                ↓ 1.2h from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Docs Satisfaction
              </Typography>
              <Typography variant="h4" component="div">
                91%
              </Typography>
              <Typography variant="body2" color="success.main">
                ↑ 2% from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Community Growth
              </Typography>
              <Typography variant="h4" component="div">
                +118
              </Typography>
              <Typography variant="body2" color="success.main">
                New members this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Detailed Analytics Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="DevRel KPIs" />
            <Tab label="Feedback Analysis" />
            <Tab label="Content Performance" />
            <Tab label="Community Growth" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Key DevRel Metrics Trends
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={mockKPIData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="activationTime"
                    stroke="#8884d8"
                    strokeWidth={2}
                    name="Activation Time (days)"
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="prVelocity"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    name="PR Review Time (hours)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="docsSatisfaction"
                    stroke="#ffc658"
                    strokeWidth={2}
                    name="Docs Satisfaction (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Feedback Sentiment Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={mockFeedbackTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="positive"
                    stackId="1"
                    stroke="#4caf50"
                    fill="#4caf50"
                  />
                  <Area
                    type="monotone"
                    dataKey="neutral"
                    stackId="1"
                    stroke="#ff9800"
                    fill="#ff9800"
                  />
                  <Area
                    type="monotone"
                    dataKey="negative"
                    stackId="1"
                    stroke="#f44336"
                    fill="#f44336"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Current Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Positive', value: 75, fill: '#4caf50' },
                      { name: 'Neutral', value: 18, fill: '#ff9800' },
                      { name: 'Negative', value: 7, fill: '#f44336' },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Content Performance Metrics
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={mockContentMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="published" fill="#8884d8" name="Published" />
              <Bar yAxisId="right" dataKey="views" fill="#82ca9d" name="Views" />
            </BarChart>
          </ResponsiveContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h6" gutterBottom>
            Community Growth Over Time
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={mockCommunityGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="newMembers" fill="#8884d8" name="New Members" />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="totalMembers"
                stroke="#82ca9d"
                strokeWidth={2}
                name="Total Members"
              />
            </LineChart>
          </ResponsiveContainer>
        </TabPanel>
      </Paper>
    </Box>
  );
}

export default Analytics;