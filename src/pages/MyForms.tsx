import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  Alert,
} from '@mui/material'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { RootState } from '../store/store'

const MyForms = () => {
  const navigate = useNavigate()
  const { savedForms } = useSelector((state: RootState) => state.formBuilder)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (savedForms.length === 0) {
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          My Forms
        </Typography>
        <Alert severity="info">
          You haven't saved any forms yet. Create your first form to get started!
        </Alert>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate('/create')}
        >
          Create New Form
        </Button>
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          My Forms ({savedForms.length})
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/create')}
        >
          Create New Form
        </Button>
      </Box>

      <Grid container spacing={3}>
        {savedForms.map((form) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={form.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {form.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Created: {formatDate(form.createdAt)}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip
                    label={`${form.fields.length} fields`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  {form.fields.some(f => f.required) && (
                    <Chip
                      label="Has required fields"
                      size="small"
                      color="warning"
                      variant="outlined"
                    />
                  )}
                  {form.fields.some(f => f.isDerived) && (
                    <Chip
                      label="Has derived fields"
                      size="small"
                      color="info"
                      variant="outlined"
                    />
                  )}
                </Box>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Field types: {[...new Set(form.fields.map(f => f.type))].join(', ')}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => navigate(`/preview/${form.id}`)}
                  fullWidth
                >
                  Preview Form
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default MyForms
