import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Chip,
  Autocomplete,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import type { ValidationRule, FormField } from '../store/formBuilderSlice'
import { addField } from '../store/formBuilderSlice'
import type { RootState } from '../store/store'

interface AddFieldDialogProps {
  open: boolean
  onClose: () => void
}

const fieldTypes = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'select', label: 'Select' },
  { value: 'radio', label: 'Radio' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'date', label: 'Date' },
]

const validationTypes = [
  { value: 'required', label: 'Required', hasValue: false },
  { value: 'minLength', label: 'Minimum Length', hasValue: true },
  { value: 'maxLength', label: 'Maximum Length', hasValue: true },
  { value: 'email', label: 'Email Format', hasValue: false },
  { value: 'password', label: 'Password Rules', hasValue: false },
  { value: 'notEmpty', label: 'Not Empty', hasValue: false },
]

const AddFieldDialog: React.FC<AddFieldDialogProps> = ({ open, onClose }) => {
  const dispatch = useDispatch()
  const { currentForm } = useSelector((state: RootState) => state.formBuilder)
  
  const [fieldData, setFieldData] = useState<Partial<FormField>>({
    type: 'text',
    label: '',
    required: false,
    defaultValue: '',
    validationRules: [],
    options: [],
    isDerived: false,
    derivedFrom: [],
    derivedFormula: '',
  })

  const [newOption, setNewOption] = useState('')
  const [selectedValidation, setSelectedValidation] = useState('')
  const [validationValue, setValidationValue] = useState('')

  const handleClose = () => {
    setFieldData({
      type: 'text',
      label: '',
      required: false,
      defaultValue: '',
      validationRules: [],
      options: [],
      isDerived: false,
      derivedFrom: [],
      derivedFormula: '',
    })
    setNewOption('')
    setSelectedValidation('')
    setValidationValue('')
    onClose()
  }

  const handleAddField = () => {
    if (fieldData.label && fieldData.type) {
      dispatch(addField(fieldData as Omit<FormField, 'id'>))
      handleClose()
    }
  }

  const addOption = () => {
    if (newOption.trim()) {
      setFieldData({
        ...fieldData,
        options: [...(fieldData.options || []), newOption.trim()]
      })
      setNewOption('')
    }
  }

  const removeOption = (indexToRemove: number) => {
    setFieldData({
      ...fieldData,
      options: fieldData.options?.filter((_, index) => index !== indexToRemove)
    })
  }

  const addValidationRule = () => {
    if (selectedValidation) {
      const validationType = validationTypes.find(v => v.value === selectedValidation)
      const newRule: ValidationRule = {
        type: selectedValidation as ValidationRule['type'],
        value: validationType?.hasValue ? validationValue : undefined,
        message: `${validationType?.label} validation failed`,
      }
      
      setFieldData({
        ...fieldData,
        validationRules: [...(fieldData.validationRules || []), newRule]
      })
      setSelectedValidation('')
      setValidationValue('')
    }
  }

  const removeValidationRule = (indexToRemove: number) => {
    setFieldData({
      ...fieldData,
      validationRules: fieldData.validationRules?.filter((_, index) => index !== indexToRemove)
    })
  }

  const needsOptions = ['select', 'radio', 'checkbox'].includes(fieldData.type || '')

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Field</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {/* Basic Field Configuration */}
          <TextField
            label="Field Label"
            value={fieldData.label || ''}
            onChange={(e) => setFieldData({ ...fieldData, label: e.target.value })}
            fullWidth
            required
          />

          <FormControl fullWidth>
            <InputLabel>Field Type</InputLabel>
            <Select
              value={fieldData.type || 'text'}
              label="Field Type"
              onChange={(e) => setFieldData({ ...fieldData, type: e.target.value as FormField['type'] })}
            >
              {fieldTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={fieldData.required || false}
                onChange={(e) => setFieldData({ ...fieldData, required: e.target.checked })}
              />
            }
            label="Required Field"
          />

          <TextField
            label="Default Value"
            value={fieldData.defaultValue || ''}
            onChange={(e) => setFieldData({ ...fieldData, defaultValue: e.target.value })}
            fullWidth
          />

          {/* Options for Select, Radio, Checkbox */}
          {needsOptions && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Options ({fieldData.options?.length || 0})</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      label="Add Option"
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      size="small"
                      onKeyPress={(e) => e.key === 'Enter' && addOption()}
                    />
                    <Button onClick={addOption} variant="outlined" size="small">
                      Add
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {fieldData.options?.map((option, index) => (
                      <Chip
                        key={index}
                        label={option}
                        onDelete={() => removeOption(index)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Validation Rules */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Validation Rules ({fieldData.validationRules?.length || 0})</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Validation Type</InputLabel>
                    <Select
                      value={selectedValidation}
                      label="Validation Type"
                      onChange={(e) => setSelectedValidation(e.target.value)}
                    >
                      {validationTypes.map((validation) => (
                        <MenuItem key={validation.value} value={validation.value}>
                          {validation.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  {validationTypes.find(v => v.value === selectedValidation)?.hasValue && (
                    <TextField
                      label="Value"
                      value={validationValue}
                      onChange={(e) => setValidationValue(e.target.value)}
                      size="small"
                      type="number"
                    />
                  )}
                  
                  <Button 
                    onClick={addValidationRule} 
                    variant="outlined" 
                    size="small"
                    disabled={!selectedValidation}
                  >
                    Add
                  </Button>
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {fieldData.validationRules?.map((rule, index) => (
                    <Chip
                      key={index}
                      label={`${rule.type}${rule.value ? `: ${rule.value}` : ''}`}
                      onDelete={() => removeValidationRule(index)}
                      color="secondary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Derived Fields */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Derived Field Configuration</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={fieldData.isDerived || false}
                      onChange={(e) => setFieldData({ ...fieldData, isDerived: e.target.checked })}
                    />
                  }
                  label="This is a derived field"
                />
                
                {fieldData.isDerived && (
                  <>
                    <Autocomplete
                      multiple
                      options={currentForm.fields.map(f => ({ id: f.id, label: f.label }))}
                      getOptionLabel={(option) => option.label}
                      value={fieldData.derivedFrom?.map(id => 
                        currentForm.fields.find(f => f.id === id)
                      ).filter(Boolean).map(f => ({ id: f!.id, label: f!.label })) || []}
                      onChange={(_, newValue) => {
                        setFieldData({
                          ...fieldData,
                          derivedFrom: newValue.map(v => v.id)
                        })
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Parent Fields"
                          placeholder="Select fields this field depends on"
                        />
                      )}
                    />
                    
                    <TextField
                      label="Derivation Formula"
                      value={fieldData.derivedFormula || ''}
                      onChange={(e) => setFieldData({ ...fieldData, derivedFormula: e.target.value })}
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="e.g., for age from birthdate: new Date().getFullYear() - new Date(birthdate).getFullYear()"
                    />
                  </>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleAddField} 
          variant="contained"
          disabled={!fieldData.label || !fieldData.type}
        >
          Add Field
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddFieldDialog
