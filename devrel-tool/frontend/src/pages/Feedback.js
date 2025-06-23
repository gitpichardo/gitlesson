import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  GitHub as GitHubIcon,
  Chat as SlackIcon,
  Forum as DiscordIcon,
  ThumbUp,
  ThumbDown,
  ThumbsUpDown,
  Visibility,
  Edit,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';

// Mock data
const mockFeedback = [
  {
    id: 1,
    source: 'github',
    title: 'API documentation needs more examples',
    content: 'The current API docs are good but could use more practical examples...',
    author: 'developer123',
    category: 'documentation',
    priority: 'medium',
    status: 'new',
    sentiment: 'neutral',
    confidence_score: 0.85,
    created_at: '2024-01-15T10:30:00Z',
    tags: ['documentation', 'api', 'examples'],
  },
  {
    id: 2,
    source: 'slack',
    title: 'Feature request: Better error messages',
    content: 'It would be great if error messages were more descriptive...',
    author: 'jane_dev',
    category: 'feature_request',
    priority: 'high',
    status: 'reviewed',
    sentiment: 'positive',
    confidence_score: 0.92,
    created_at: '2024-01-14T15:20:00Z',
    tags: ['error-handling', 'ux'],
  },
];

const sourceIcons = {
  github: <GitHubIcon />,
  slack: <SlackIcon />,
  discord: <DiscordIcon />,
};

const sentimentIcons = {
  positive: <ThumbUp color="success" />,
  negative: <ThumbDown color="error" />,
  neutral: <ThumbsUpDown color="action" />,
};

const priorityColors = {
  low: 'default',
  medium: 'warning',
  high: 'error',
  critical: 'error',
};

const statusColors = {
  new: 'info',
  reviewed: 'warning',
  in_progress: 'primary',
  resolved: 'success',
  closed: 'default',
};

function Feedback() {
  const [feedback, setFeedback] = useState(mockFeedback);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    source: '',
    category: '',
    status: '',
    priority: '',
  });

  const columns = [
    {
      field: 'source',
      headerName: 'Source',
      width: 100,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          {sourceIcons[params.value] || params.value}
        </Tooltip>
      ),
    },
    {
      field: 'title',
      headerName: 'Title',
      width: 300,
      renderCell: (params) => (
        <Typography variant="body2" noWrap>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'author',
      headerName: 'Author',
      width: 150,
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 150,
      renderCell: (params) => (
        <Chip label={params.value} size="small" variant="outlined" />
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
      field: 'sentiment',
      headerName: 'Sentiment',
      width: 100,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          {sentimentIcons[params.value] || params.value}
        </Tooltip>
      ),
    },
    {
      field: 'created_at',
      headerName: 'Created',
      width: 150,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleViewFeedback(params.row)}
          >
            <Visibility />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleEditFeedback(params.row)}
          >
            <Edit />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleViewFeedback = (feedbackItem) => {
    setSelectedFeedback(feedbackItem);
    setViewDialogOpen(true);
  };

  const handleEditFeedback = (feedbackItem) => {
    setSelectedFeedback(feedbackItem);
    setDialogOpen(true);
  };

  const handleAddFeedback = () => {
    setSelectedFeedback(null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedFeedback(null);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedFeedback(null);
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const filteredFeedback = feedback.filter((item) => {
    return (
      (!filters.source || item.source === filters.source) &&
      (!filters.category || item.category === filters.category) &&
      (!filters.status || item.status === filters.status) &&
      (!filters.priority || item.priority === filters.priority)
    );
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Feedback Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddFeedback}
        >
          Add Feedback
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Source</InputLabel>
              <Select
                value={filters.source}
                label="Source"
                onChange={(e) => handleFilterChange('source', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="github">GitHub</MenuItem>
                <MenuItem value="slack">Slack</MenuItem>
                <MenuItem value="discord">Discord</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                label="Category"
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="bug">Bug</MenuItem>
                <MenuItem value="feature_request">Feature Request</MenuItem>
                <MenuItem value="documentation">Documentation</MenuItem>
                <MenuItem value="question">Question</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="reviewed">Reviewed</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
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
        </Grid>
      </Paper>

      {/* Feedback Table */}
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filteredFeedback}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
        />
      </Paper>

      {/* View Feedback Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedFeedback?.title}
        </DialogTitle>
        <DialogContent>
          {selectedFeedback && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Source:</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {sourceIcons[selectedFeedback.source]}
                    <Typography>{selectedFeedback.source}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Author:</Typography>
                  <Typography>{selectedFeedback.author}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Category:</Typography>
                  <Chip label={selectedFeedback.category} size="small" />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Priority:</Typography>
                  <Chip
                    label={selectedFeedback.priority}
                    size="small"
                    color={priorityColors[selectedFeedback.priority]}
                  />
                </Grid>
              </Grid>
              
              <Typography variant="subtitle2" gutterBottom>
                Content:
              </Typography>
              <Typography variant="body1" paragraph>
                {selectedFeedback.content}
              </Typography>
              
              {selectedFeedback.tags && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Tags:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {selectedFeedback.tags.map((tag, index) => (
                      <Chip key={index} label={tag} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Feedback Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedFeedback ? 'Edit Feedback' : 'Add Feedback'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                defaultValue={selectedFeedback?.title || ''}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Source</InputLabel>
                <Select
                  defaultValue={selectedFeedback?.source || ''}
                  label="Source"
                >
                  <MenuItem value="github">GitHub</MenuItem>
                  <MenuItem value="slack">Slack</MenuItem>
                  <MenuItem value="discord">Discord</MenuItem>
                  <MenuItem value="forum">Forum</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Author"
                defaultValue={selectedFeedback?.author || ''}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  defaultValue={selectedFeedback?.category || ''}
                  label="Category"
                >
                  <MenuItem value="bug">Bug</MenuItem>
                  <MenuItem value="feature_request">Feature Request</MenuItem>
                  <MenuItem value="documentation">Documentation</MenuItem>
                  <MenuItem value="question">Question</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  defaultValue={selectedFeedback?.priority || 'medium'}
                  label="Priority"
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Content"
                defaultValue={selectedFeedback?.content || ''}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained">
            {selectedFeedback ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Feedback;