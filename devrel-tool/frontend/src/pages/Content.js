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
  Card,
  CardContent,
  CardActions,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Article as ArticleIcon,
  VideoLibrary as VideoIcon,
  Code as CodeIcon,
  School as TutorialIcon,
  Visibility,
  Edit,
  Publish,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';

// Mock data
const mockContent = [
  {
    id: 1,
    title: 'Getting Started with OpenHands',
    type: 'blog_post',
    status: 'published',
    author: 'jane_writer',
    target_audience: 'beginner',
    estimated_reading_time: 8,
    created_at: '2024-01-15T10:30:00Z',
    published_at: '2024-01-16T09:00:00Z',
    tags: ['getting-started', 'tutorial'],
  },
  {
    id: 2,
    title: 'Advanced API Integration Patterns',
    type: 'tutorial',
    status: 'review',
    author: 'john_dev',
    target_audience: 'advanced',
    estimated_reading_time: 15,
    created_at: '2024-01-14T15:20:00Z',
    tags: ['api', 'integration', 'advanced'],
  },
  {
    id: 3,
    title: 'React Component Template',
    type: 'template',
    status: 'published',
    author: 'dev_team',
    target_audience: 'all',
    created_at: '2024-01-13T11:00:00Z',
    published_at: '2024-01-13T14:00:00Z',
    tags: ['react', 'template', 'component'],
  },
];

const typeIcons = {
  blog_post: <ArticleIcon />,
  tutorial: <TutorialIcon />,
  documentation: <ArticleIcon />,
  webinar: <VideoIcon />,
  talk: <VideoIcon />,
  template: <CodeIcon />,
};

const statusColors = {
  draft: 'default',
  review: 'warning',
  published: 'success',
  archived: 'default',
};

const audienceColors = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'error',
  all: 'primary',
};

function Content() {
  const [content, setContent] = useState(mockContent);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    author: '',
    target_audience: '',
  });

  const columns = [
    {
      field: 'type',
      headerName: 'Type',
      width: 80,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          {typeIcons[params.value] || <ArticleIcon />}
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
      field: 'author',
      headerName: 'Author',
      width: 150,
    },
    {
      field: 'target_audience',
      headerName: 'Audience',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={audienceColors[params.value]}
        />
      ),
    },
    {
      field: 'estimated_reading_time',
      headerName: 'Read Time',
      width: 100,
      renderCell: (params) => (
        params.value ? `${params.value} min` : '-'
      ),
    },
    {
      field: 'created_at',
      headerName: 'Created',
      width: 120,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'published_at',
      headerName: 'Published',
      width: 120,
      renderCell: (params) => (
        params.value ? new Date(params.value).toLocaleDateString() : '-'
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <IconButton size="small">
            <Visibility />
          </IconButton>
          <IconButton size="small">
            <Edit />
          </IconButton>
          {params.row.status !== 'published' && (
            <IconButton size="small">
              <Publish />
            </IconButton>
          )}
        </Box>
      ),
    },
  ];

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const filteredContent = content.filter((item) => {
    return (
      (!filters.type || item.type === filters.type) &&
      (!filters.status || item.status === filters.status) &&
      (!filters.author || item.author === filters.author) &&
      (!filters.target_audience || item.target_audience === filters.target_audience)
    );
  });

  const getContentStats = () => {
    const total = content.length;
    const published = content.filter(c => c.status === 'published').length;
    const draft = content.filter(c => c.status === 'draft').length;
    const review = content.filter(c => c.status === 'review').length;
    
    return { total, published, draft, review };
  };

  const stats = getContentStats();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Content Management
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Create Content
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="primary">
              {stats.total}
            </Typography>
            <Typography variant="body2">Total Content</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main">
              {stats.published}
            </Typography>
            <Typography variant="body2">Published</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main">
              {stats.review}
            </Typography>
            <Typography variant="body2">In Review</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="text.secondary">
              {stats.draft}
            </Typography>
            <Typography variant="body2">Drafts</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Content Pipeline Progress */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Content Pipeline
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" gutterBottom>
              Publication Rate
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(stats.published / stats.total) * 100}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption" color="text.secondary">
              {Math.round((stats.published / stats.total) * 100)}% published
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" gutterBottom>
              Review Queue
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(stats.review / stats.total) * 100}
              color="warning"
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption" color="text.secondary">
              {stats.review} items in review
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" gutterBottom>
              Draft Progress
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(stats.draft / stats.total) * 100}
              color="info"
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption" color="text.secondary">
              {stats.draft} drafts in progress
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select
                value={filters.type}
                label="Type"
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="blog_post">Blog Post</MenuItem>
                <MenuItem value="tutorial">Tutorial</MenuItem>
                <MenuItem value="documentation">Documentation</MenuItem>
                <MenuItem value="webinar">Webinar</MenuItem>
                <MenuItem value="talk">Talk</MenuItem>
                <MenuItem value="template">Template</MenuItem>
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
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="review">Review</MenuItem>
                <MenuItem value="published">Published</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Author</InputLabel>
              <Select
                value={filters.author}
                label="Author"
                onChange={(e) => handleFilterChange('author', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="jane_writer">jane_writer</MenuItem>
                <MenuItem value="john_dev">john_dev</MenuItem>
                <MenuItem value="dev_team">dev_team</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Audience</InputLabel>
              <Select
                value={filters.target_audience}
                label="Audience"
                onChange={(e) => handleFilterChange('target_audience', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
                <MenuItem value="all">All Levels</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Content Table */}
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filteredContent}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
        />
      </Paper>
    </Box>
  );
}

export default Content;