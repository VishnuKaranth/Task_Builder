import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
} from '@mui/material'
import type { RootState } from '../store/store'
import DynamicForm from '../components/DynamicForm'

const FormPreview = () => {
  const { formId } = useParams()
  const { currentForm, savedForms } = useSelector((state: RootState) => state.formBuilder)
  const [formToPreview, setFormToPreview] = useState(currentForm)
  const [formData, setFormData] = useState<{ [key: string]: any }>({})
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (formId) {
      const savedForm = savedForms.find(form => form.id === formId)
      if (savedForm) {
        setFormToPreview({ name: savedForm.name, fields: savedForm.fields })
      }
    } else {
      setFormToPreview(currentForm)
    }
  }, [formId, savedForms, currentForm])

  const handleSubmit = () => {
    console.log('Form Data:', formData)
    alert('Form submitted! Check console for data.')
  }

  if (!formToPreview.fields || formToPreview.fields.length === 0) {
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Form Preview
        </Typography>
        <Alert severity="info">
          No form to preview. Please create a form first or select a saved form.
        </Alert>
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1">
            Form Preview
          </Typography>
          {formToPreview.name && (
            <Typography variant="h6" color="text.secondary">
              {formToPreview.name}
            </Typography>
          )}
        </Box>
      </Box>

      <Paper sx={{ p: 4 }}>
        <DynamicForm
          fields={formToPreview.fields}
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
        />
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            size="large"
            onClick={handleSubmit}
          >
            Submit Form
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}

export default FormPreview
