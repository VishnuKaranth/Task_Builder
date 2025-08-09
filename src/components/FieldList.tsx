import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Stack,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
} from '@mui/icons-material'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../store/store'
import { deleteField } from '../store/formBuilderSlice'

const FieldList = () => {
  const dispatch = useDispatch()
  const { currentForm } = useSelector((state: RootState) => state.formBuilder)

  const handleDeleteField = (fieldId: string) => {
    dispatch(deleteField(fieldId))
  }

  const getFieldTypeColor = (type: string) => {
    const colors: { [key: string]: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error' } = {
      text: 'primary',
      number: 'secondary',
      textarea: 'success',
      select: 'warning',
      radio: 'info',
      checkbox: 'error',
      date: 'primary',
    }
    return colors[type] || 'default'
  }

  return (
    <Stack spacing={2}>
      {currentForm.fields.map((field) => (
        <Card key={field.id} variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <DragIcon sx={{ color: 'text.secondary', cursor: 'grab' }} />
                <Box>
                  <Typography variant="h6" component="div">
                    {field.label}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1, alignItems: 'center' }}>
                    <Chip
                      label={field.type}
                      size="small"
                      color={getFieldTypeColor(field.type)}
                      variant="outlined"
                    />
                    {field.required && (
                      <Chip label="Required" size="small" color="error" variant="outlined" />
                    )}
                    {field.isDerived && (
                      <Chip label="Derived" size="small" color="info" variant="outlined" />
                    )}
                  </Box>
                  {field.validationRules.length > 0 && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Validations: {field.validationRules.map(rule => rule.type).join(', ')}
                    </Typography>
                  )}
                  {field.isDerived && field.derivedFrom && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Derived from: {field.derivedFrom.join(', ')}
                    </Typography>
                  )}
                </Box>
              </Box>
              <Box>
                <IconButton size="small" color="primary">
                  <EditIcon />
                </IconButton>
                <IconButton 
                  size="small" 
                  color="error"
                  onClick={() => handleDeleteField(field.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Stack>
  )
}

export default FieldList
