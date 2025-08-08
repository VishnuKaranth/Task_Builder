import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'password' | 'notEmpty'
  value?: number | string
  message: string
}

export interface FormField {
  id: string
  type: 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date'
  label: string
  required: boolean
  defaultValue?: string | number | boolean | string[]
  validationRules: ValidationRule[]
  options?: string[] // for select, radio, checkbox
  isDerived?: boolean
  derivedFrom?: string[] // parent field IDs
  derivedFormula?: string // formula for computation
}

export interface FormSchema {
  id: string
  name: string
  fields: FormField[]
  createdAt: string
}

interface FormBuilderState {
  currentForm: {
    name: string
    fields: FormField[]
  }
  savedForms: FormSchema[]
}

const initialState: FormBuilderState = {
  currentForm: {
    name: '',
    fields: [],
  },
  savedForms: JSON.parse(localStorage.getItem('savedForms') || '[]'),
}

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    addField: (state, action: PayloadAction<Omit<FormField, 'id'>>) => {
      const newField: FormField = {
        ...action.payload,
        id: uuidv4(),
      }
      state.currentForm.fields.push(newField)
    },
    
    updateField: (state, action: PayloadAction<FormField>) => {
      const index = state.currentForm.fields.findIndex(field => field.id === action.payload.id)
      if (index !== -1) {
        state.currentForm.fields[index] = action.payload
      }
    },
    
    deleteField: (state, action: PayloadAction<string>) => {
      state.currentForm.fields = state.currentForm.fields.filter(field => field.id !== action.payload)
    },
    
    reorderFields: (state, action: PayloadAction<{ sourceIndex: number; destinationIndex: number }>) => {
      const { sourceIndex, destinationIndex } = action.payload
      const [removed] = state.currentForm.fields.splice(sourceIndex, 1)
      state.currentForm.fields.splice(destinationIndex, 0, removed)
    },
    
    saveForm: (state, action: PayloadAction<string>) => {
      const formSchema: FormSchema = {
        id: uuidv4(),
        name: action.payload,
        fields: [...state.currentForm.fields],
        createdAt: new Date().toISOString(),
      }
      
      state.savedForms.push(formSchema)
      localStorage.setItem('savedForms', JSON.stringify(state.savedForms))
      
      // Reset current form
      state.currentForm = { name: '', fields: [] }
    },
    
    loadForm: (state, action: PayloadAction<string>) => {
      const form = state.savedForms.find(f => f.id === action.payload)
      if (form) {
        state.currentForm = {
          name: form.name,
          fields: [...form.fields],
        }
      }
    },
    
    clearCurrentForm: (state) => {
      state.currentForm = { name: '', fields: [] }
    },
  },
})

export const {
  addField,
  updateField,
  deleteField,
  reorderFields,
  saveForm,
  loadForm,
  clearCurrentForm,
} = formBuilderSlice.actions

export default formBuilderSlice.reducer
