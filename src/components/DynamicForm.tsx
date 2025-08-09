import React, { useEffect, useCallback, useRef } from 'react'
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  FormGroup,
  Box,
  Typography,
} from '@mui/material'
import type { FormField, ValidationRule } from '../store/formBuilderSlice'

interface DynamicFormProps {
  fields: FormField[]
  formData: { [key: string]: any }
  setFormData: (data: { [key: string]: any }) => void
  errors: { [key: string]: string }
  setErrors: (errors: { [key: string]: string }) => void
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  formData,
  setFormData,
  errors,
  setErrors,
}) => {
  const validateField = (field: FormField, value: any): string | null => {
    for (const rule of field.validationRules) {
      if (!validateRule(rule, value, field.label)) {
        return rule.message
      }
    }
    return null
  }

  const validateRule = (rule: ValidationRule, value: any, fieldLabel: string): boolean => {
    switch (rule.type) {
      case 'required':
        return value !== undefined && value !== null && value !== ''
      case 'notEmpty':
        return value !== undefined && value !== null && String(value).trim() !== ''
      case 'minLength':
        return !value || String(value).length >= (rule.value as number)
      case 'maxLength':
        return !value || String(value).length <= (rule.value as number)
      case 'email':
        return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))
      case 'password':
        return !value || (String(value).length >= 8 && /\d/.test(String(value)))
      default:
        return true
    }
  }

  const handleFieldChange = (fieldId: string, value: any) => {
    const newFormData = { ...formData, [fieldId]: value }
    setFormData(newFormData)

    // Clear error for this field
    const newErrors = { ...errors }
    delete newErrors[fieldId]
    setErrors(newErrors)

    // Validate field
    const field = fields.find(f => f.id === fieldId)
    if (field) {
      const error = validateField(field, value)
      if (error) {
        setErrors({ ...newErrors, [fieldId]: error })
      }
    }
  }
  const previousDerivedValues = useRef<{ [key: string]: any }>({})

  // Calculate derived fields
  useEffect(() => {
    const derivedFields = fields.filter(f => f.isDerived)
    if (derivedFields.length === 0) return

    const newDerivedValues: { [key: string]: any } = {}
    let hasChanges = false

    derivedFields.forEach(field => {
      if (field.derivedFrom && field.derivedFormula) {
        try {
          // Simple derivation example for age from birthdate
          if (field.derivedFormula.includes('birthdate') && field.derivedFrom.length > 0) {
            const birthdateFieldId = field.derivedFrom[0]
            const birthdate = formData[birthdateFieldId]
            if (birthdate) {
              const age = new Date().getFullYear() - new Date(birthdate).getFullYear()
              newDerivedValues[field.id] = age
              
              // Check if value actually changed
              if (previousDerivedValues.current[field.id] !== age) {
                hasChanges = true
              }
            }
          }
          // Add more derivation logic here as needed
        } catch (error) {
          console.error('Error calculating derived field:', error)
        }
      }
    })

    setFormData(formData)
  }, [fields, formData, setFormData])

  const renderField = (field: FormField) => {
    const value = formData[field.id] || field.defaultValue || ''
    const error = errors[field.id]
    const isRequired = field.required

    switch (field.type) {
      case 'text':
        return (
          <TextField
            key={field.id}
            label={field.label}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            fullWidth
            required={isRequired}
            error={!!error}
            helperText={error}
            disabled={field.isDerived}
            margin="normal"
          />
        )

      case 'number':
        return (
          <TextField
            key={field.id}
            label={field.label}
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            fullWidth
            required={isRequired}
            error={!!error}
            helperText={error}
            disabled={field.isDerived}
            margin="normal"
          />
        )

      case 'textarea':
        return (
          <TextField
            key={field.id}
            label={field.label}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            fullWidth
            multiline
            rows={4}
            required={isRequired}
            error={!!error}
            helperText={error}
            disabled={field.isDerived}
            margin="normal"
          />
        )

      case 'date':
        return (
          <TextField
            key={field.id}
            label={field.label}
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            fullWidth
            required={isRequired}
            error={!!error}
            helperText={error}
            disabled={field.isDerived}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        )

      case 'select':
        return (
          <FormControl 
            key={field.id} 
            fullWidth 
            margin="normal" 
            required={isRequired}
            error={!!error}
            disabled={field.isDerived}
          >
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value}
              label={field.label}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
            >
              {field.options?.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
            {error && (
              <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                {error}
              </Typography>
            )}
          </FormControl>
        )

      case 'radio':
        return (
          <Box key={field.id} sx={{ mt: 2, mb: 2 }}>
            <Typography variant="body1" component="legend" gutterBottom>
              {field.label} {isRequired && '*'}
            </Typography>
            <RadioGroup
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
            >
              {field.options?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio disabled={field.isDerived} />}
                  label={option}
                />
              ))}
            </RadioGroup>
            {error && (
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            )}
          </Box>
        )

      case 'checkbox':
        return (
          <Box key={field.id} sx={{ mt: 2, mb: 2 }}>
            <Typography variant="body1" component="legend" gutterBottom>
              {field.label} {isRequired && '*'}
            </Typography>
            <FormGroup>
              {field.options?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={(value || []).includes(option)}
                      onChange={(e) => {
                        const currentValues = value || []
                        const newValues = e.target.checked
                          ? [...currentValues, option]
                          : currentValues.filter((v: string) => v !== option)
                        handleFieldChange(field.id, newValues)
                      }}
                      disabled={field.isDerived}
                    />
                  }
                  label={option}
                />
              ))}
            </FormGroup>
            {error && (
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            )}
          </Box>
        )

      default:
        return null
    }
  }

  return (
    <Box>
      {fields.map(field => renderField(field))}
    </Box>
  )
}

export default DynamicForm
