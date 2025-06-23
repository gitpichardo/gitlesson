import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  GitHub as GitHubIcon,
  Sync as SyncIcon,
  Visibility,
  Edit,
  Assignment,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';

// Mock data
const mockIssues = [
  {
    id: 1,
    source: 'github',
    source_id: 'openhands/core#123',
    title: 'Memory leak in background processing',
    status: 'open',
    priority: 'high',
    labels: ['bug', 'performance'],
    assignee: 'john_dev',
    repository: 'openhands/core',
    created_at: '2024-01-15T10:30:00Z',
    url: 'https://github.com/openhands/core/issues/123',
  },
  {
    id: 2,
    source: 'github',
    source_id: 'openhands/docs#45',
    title: 'Update installation guide',
    status: 'in_progress',
    priority: 'medium',
    labels: ['documentation'],
    assignee: 'jane_writer',
    repository: 'openhands/docs',
    created_at: '2024-01-14T15:20:00Z',
    url: 'https://github.com/openhands/docs/issues/45',
  },
];

const priorityColors = {
  low: 'default',
  medium: 'warning',
  high: 'error',
  critical: 'error',
};

const statusColors = {
  open: 'error',
  in_progress: 'warning',
  resolved: 'success',
  closed: 'default',
};

function Issues() {
  const [issues, setIssues] = useState(mockIssues);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    repository: '',
    assignee: '',
  });

  const columns = [
    {
      field: 'source_id',
      headerName: 'ID',
      width: 150,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'title',
      headerName: 'Title',
      width: 300,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <Typography variant="body2" noWrap>
            {params.value}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={statusColors[params.value]}
        />
      ),
    },
    {
      field: 'priority',
      headerName: 'Priority',
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={priorityColors[params.value]}
        />
      ),
    },
    {
      field: 'assignee',
      headerName: 'Assignee',
      width: 150,
    },
    {
      field: 'repository',
      headerName: 'Repository',
      width: 150,
    },
    {
      field: 'labels',
      headerName: 'Labels',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {params.value?.map((label, index) => (
            <Chip
              key={index}
              label={label}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.7rem', height: 20 }}
            />
          ))}
        </Box>
      ),
    },
    {
      field: 'created_at',
      headerName: 'Created',
      width: 120,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton size="small" onClick={() => window.open(params.row.url)}>
            <Visibility />
          </IconButton>
          <IconButton size="small">
            <Edit />
          </IconButton>
          <IconButton size="small">
            <Assignment />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleSync = () => {
    // Trigger sync with external sources
    console.log('Syncing issues...');
  };

  const filteredIssues = issues.filter((item) => {
    return (
      (!filters.status || item.status === filters.status) &&
      (!filters.priority || item.priority === filters.priority) &&
      (!filters.repository || item.repository === filters.repository) &&
      (!filters.assignee || item.assignee === filters.assignee)
    );
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Issue Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<SyncIcon />}
            onClick={handleSync}
          >
            Sync Issues
          </Button>
          <Button variant="contained" startIcon={<AddIcon />}>
            Add Issue
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="error">
              {issues.filter(i => i.status === 'open').length}
            </Typography>
            <Typography variant="body2">Open Issues</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main">
              {issues.filter(i => i.status === 'in_progress').length}
            </Typography>
            <Typography variant="body2">In Progress</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="error">
              {issues.filter(i => i.priority === 'high' || i.priority === 'critical').length}
            </Typography>
            <Typography variant="body2">High Priority</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main">
              {issues.filter(i => i.status === 'resolved').length}
            </Typography>
            <Typography variant="body2">Resolved</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Priority</InputLabel>
              <Select
                value={filters.priority}
                label="Priority"
                onChange={(e) => handleFilterChange('priority', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Repository</InputLabel>
              <Select
                value={filters.repository}
                label="Repository"
                onChange={(e) => handleFilterChange('repository', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="openhands/core">openhands/core</MenuItem>
                <MenuItem value="openhands/docs">openhands/docs</MenuItem>
                <MenuItem value="openhands/examples">openhands/examples</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Assignee</InputLabel>
              <Select
                value={filters.assignee}
                label="Assignee"
                onChange={(e) => handleFilterChange('assignee', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="john_dev">john_dev</MenuItem>
                <MenuItem value="jane_writer">jane_writer</MenuItem>
                <MenuItem value="">Unassigned</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Issues Table */}
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filteredIssues}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
        />
      </Paper>
    </Box>
  );
}

export default Issues;