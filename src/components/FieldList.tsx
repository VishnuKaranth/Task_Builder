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
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import type { DropResult } from 'react-beautiful-dnd'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../store/store'
import { deleteField, reorderFields } from '../store/formBuilderSlice'

const FieldList = () => {
  const dispatch = useDispatch()
  const { currentForm } = useSelector((state: RootState) => state.formBuilder)

  const handleDeleteField = (fieldId: string) => {
    dispatch(deleteField(fieldId))
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const sourceIndex = result.source.index
    const destinationIndex = result.destination.index

    if (sourceIndex !== destinationIndex) {
      dispatch(reorderFields({ sourceIndex, destinationIndex }))
    }
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
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="fields-list">
        {(provided, snapshot) => (
          <Box
            {...provided.droppableProps}
            ref={provided.innerRef}
            sx={{
              backgroundColor: snapshot.isDraggingOver ? 'action.hover' : 'transparent',
              borderRadius: 1,
              padding: snapshot.isDraggingOver ? 1 : 0,
              transition: 'all 0.2s ease',
            }}
          >
            <Stack spacing={2}>
              {currentForm.fields.map((field, index) => (
                <Draggable key={field.id} draggableId={field.id} index={index}>
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      variant="outlined"
                      sx={{
                        transform: snapshot.isDragging ? 'rotate(5deg)' : 'rotate(0deg)',
                        boxShadow: snapshot.isDragging ? 4 : 1,
                        opacity: snapshot.isDragging ? 0.9 : 1,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          boxShadow: 2,
                        },
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box
                              {...provided.dragHandleProps}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'grab',
                                '&:active': {
                                  cursor: 'grabbing',
                                },
                                '&:hover': {
                                  color: 'primary.main',
                                },
                                transition: 'color 0.2s ease',
                              }}
                            >
                              <DragIcon />
                            </Box>
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
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Stack>
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default FieldList
