import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Switch,
  FormControlLabel,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  Chat as SlackIcon,
  Forum as DiscordIcon,
  Psychology as OpenAIIcon,
  Sync as SyncIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

// Mock data
const mockIntegrations = {
  github: {
    enabled: true,
    status: 'connected',
    features: ['issues', 'pull_requests', 'discussions', 'releases'],
    lastSync: '2024-01-15T10:30:00Z',
    config: {
      repositories: ['openhands/core', 'openhands/docs'],
      webhookUrl: 'https://api.devrel.com/webhooks/github',
    },
  },
  slack: {
    enabled: true,
    status: 'connected',
    features: ['channels', 'direct_messages', 'notifications'],
    lastSync: '2024-01-15T09:45:00Z',
    config: {
      channels: ['#general', '#devrel', '#support'],
      botToken: 'xoxb-***',
    },
  },
  discord: {
    enabled: false,
    status: 'not_configured',
    features: ['servers', 'channels', 'moderation'],
    lastSync: null,
    config: {},
  },
  openai: {
    enabled: true,
    status: 'connected',
    features: ['feedback_analysis', 'content_generation', 'sentiment_analysis'],
    lastSync: '2024-01-15T11:00:00Z',
    config: {
      model: 'gpt-4',
      maxTokens: 2000,
    },
  },
};

const integrationIcons = {
  github: <GitHubIcon />,
  slack: <SlackIcon />,
  discord: <DiscordIcon />,
  openai: <OpenAIIcon />,
};

const statusColors = {
  connected: 'success',
  not_configured: 'error',
  error: 'error',
  syncing: 'warning',
};

const statusIcons = {
  connected: <CheckCircleIcon color="success" />,
  not_configured: <ErrorIcon color="error" />,
  error: <ErrorIcon color="error" />,
  syncing: <WarningIcon color="warning" />,
};

function Integrations() {
  const [integrations, setIntegrations] = useState(mockIntegrations);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);

  const handleToggleIntegration = (platform) => {
    setIntegrations(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        enabled: !prev[platform].enabled,
      },
    }));
  };

  const handleConfigureIntegration = (platform) => {
    setSelectedIntegration(platform);
    setConfigDialogOpen(true);
  };

  const handleSyncIntegration = (platform) => {
    setIntegrations(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        status: 'syncing',
      },
    }));

    // Simulate sync completion
    setTimeout(() => {
      setIntegrations(prev => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          status: 'connected',
          lastSync: new Date().toISOString(),
        },
      }));
    }, 2000);
  };

  const handleCloseConfigDialog = () => {
    setConfigDialogOpen(false);
    setSelectedIntegration(null);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Integrations
      </Typography>

      <Typography variant="body1" color="text.secondary" paragraph>
        Connect and configure external platforms to streamline your DevRel workflows.
      </Typography>

      {/* Integration Cards */}
      <Grid container spacing={3}>
        {Object.entries(integrations).map(([platform, config]) => (
          <Grid item xs={12} md={6} key={platform}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ mr: 2, color: 'primary.main' }}>
                    {integrationIcons[platform]}
                  </Box>
                  <Typography variant="h6" sx={{ flexGrow: 1, textTransform: 'capitalize' }}>
                    {platform}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {statusIcons[config.status]}
                    <Chip
                      label={config.status.replace('_', ' ')}
                      color={statusColors[config.status]}
                      size="small"
                    />
                  </Box>
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      checked={config.enabled}
                      onChange={() => handleToggleIntegration(platform)}
                    />
                  }
                  label="Enabled"
                  sx={{ mb: 2 }}
                />

                <Typography variant="subtitle2" gutterBottom>
                  Features:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {config.features.map((feature) => (
                    <Chip
                      key={feature}
                      label={feature.replace('_', ' ')}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>

                {config.lastSync && (
                  <Typography variant="caption" color="text.secondary">
                    Last sync: {new Date(config.lastSync).toLocaleString()}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<SettingsIcon />}
                  onClick={() => handleConfigureIntegration(platform)}
                >
                  Configure
                </Button>
                <Button
                  size="small"
                  startIcon={<SyncIcon />}
                  onClick={() => handleSyncIntegration(platform)}
                  disabled={!config.enabled || config.status === 'syncing'}
                >
                  Sync
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Sync Status */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Sync Activity
        </Typography>
        <List>
          {Object.entries(integrations)
            .filter(([, config]) => config.lastSync)
            .sort(([, a], [, b]) => new Date(b.lastSync) - new Date(a.lastSync))
            .map(([platform, config]) => (
              <ListItem key={platform}>
                <ListItemIcon>
                  {integrationIcons[platform]}
                </ListItemIcon>
                <ListItemText
                  primary={`${platform.charAt(0).toUpperCase() + platform.slice(1)} sync completed`}
                  secondary={`${new Date(config.lastSync).toLocaleString()}`}
                />
                <Chip
                  label={config.status}
                  color={statusColors[config.status]}
                  size="small"
                />
              </ListItem>
            ))}
        </List>
      </Paper>

      {/* Configuration Dialog */}
      <Dialog
        open={configDialogOpen}
        onClose={handleCloseConfigDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Configure {selectedIntegration?.charAt(0).toUpperCase() + selectedIntegration?.slice(1)} Integration
        </DialogTitle>
        <DialogContent>
          {selectedIntegration === 'github' && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="GitHub Token"
                type="password"
                margin="normal"
                helperText="Personal access token with repo and webhook permissions"
              />
              <TextField
                fullWidth
                label="Repositories"
                margin="normal"
                placeholder="owner/repo1, owner/repo2"
                helperText="Comma-separated list of repositories to monitor"
              />
              <TextField
                fullWidth
                label="Webhook URL"
                margin="normal"
                defaultValue="https://api.devrel.com/webhooks/github"
              />
            </Box>
          )}
          {selectedIntegration === 'slack' && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Bot Token"
                type="password"
                margin="normal"
                helperText="Slack bot token (xoxb-...)"
              />
              <TextField
                fullWidth
                label="Channels"
                margin="normal"
                placeholder="#general, #devrel, #support"
                helperText="Comma-separated list of channels to monitor"
              />
              <TextField
                fullWidth
                label="Signing Secret"
                type="password"
                margin="normal"
                helperText="Slack app signing secret for webhook verification"
              />
            </Box>
          )}
          {selectedIntegration === 'discord' && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Bot Token"
                type="password"
                margin="normal"
                helperText="Discord bot token"
              />
              <TextField
                fullWidth
                label="Guild ID"
                margin="normal"
                helperText="Discord server (guild) ID to monitor"
              />
            </Box>
          )}
          {selectedIntegration === 'openai' && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="API Key"
                type="password"
                margin="normal"
                helperText="OpenAI API key"
              />
              <TextField
                fullWidth
                label="Model"
                margin="normal"
                defaultValue="gpt-4"
                helperText="OpenAI model to use for analysis"
              />
              <TextField
                fullWidth
                label="Max Tokens"
                type="number"
                margin="normal"
                defaultValue={2000}
                helperText="Maximum tokens per request"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfigDialog}>Cancel</Button>
          <Button variant="contained">Save Configuration</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Integrations;