import { useState } from 'react'
import {
    Box,
    Paper,
    Typography,
    Button,
    Dialog,
    Grid,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Fab,
    Alert,
} from '@mui/material'
import { Add as AddIcon, Save as SaveIcon } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store/store'
import { clearCurrentForm, saveForm } from '../store/formBuilderSlice'
import FieldList from '../components/FieldList'
import AddFieldDialog from '../components/AddFieldDialog'

const FormBuilder = () => {
    const dispatch = useDispatch()
    const { currentForm } = useSelector((state: RootState) => state.formBuilder)
    const [addFieldOpen, setAddFieldOpen] = useState(false)
    const [saveDailogOpen, setSaveDialogOpen] = useState(false)
    const [formName, setFormName] = useState('')
    const [saveSuccess, setSaveSuccess] = useState(false)

    const handleSaveForm = () => {
        if (formName.trim() && currentForm.fields.length > 0) {
            dispatch(saveForm(formName.trim()))
            setFormName('')
            setSaveDialogOpen(false)
            setSaveSuccess(true)
            setTimeout(() => setSaveSuccess(false), 3000)
        }
    }

    const handleNewForm = () => {
        dispatch(clearCurrentForm())
        setSaveSuccess(false)
    }
    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3}}>
                <Typography variant='h4' component='h1'>
                    Form Builder - Uppliance.ai
                </Typography>
                <Box sx = {{ display: 'flex', gap: 2}}>
                    <Button variant='outlined' onClick={handleNewForm} disabled={currentForm.fields.length === 0}>
                        Clear Form
                    </Button>
                    <Button variant='contained' startIcon={<SaveIcon />} onClick={() => setSaveDialogOpen(true)} disabled={currentForm.fields.length === 0}>
                    Save Form
                    </Button>
                </Box>
            </Box>
            {saveSuccess && (
                <Alert severity='success' sx={{ mb: 2}}>
                    Form saved successfully!!!
                </Alert>
            )}
            <Grid container spacing={3}>
                {/* Getting an error in second grid, need fixing */}
                {/* Status: Fixed */}
                <Grid size={{ xs: 12}}>
                    <Paper sx={{ p: 3, minHeight: 400}}>
                        {currentForm.fields.length === 0 ? (
                            <Box sx = {{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, color: 'text.secondary'}}>
                                <Typography variant = 'h6' gutterBottom>
                                    No fields added yet
                                </Typography>
                                <Typography variant='body2' sx={{ mb: 2 }}>
                                    Click the + to add yout first field
                                </Typography>
                            </Box>
                        ) : (
                            <>
                            <Typography variant='h6' gutterBottom>
                                Form Fields ({currentForm.fields.length})
                            </Typography>
                            <FieldList />
                            </>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            <Fab 
            color='primary' 
            aria-label='add field' 
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            onClick={() => setAddFieldOpen(true)}>
                <AddIcon />
            </Fab>

            <AddFieldDialog 
                open = {addFieldOpen}
                onClose = {() => setAddFieldOpen(false)}
            />

            <Dialog open = {saveDailogOpen} onClose={() => setSaveDialogOpen(false)} maxWidth='sm' fullWidth>
                <DialogTitle>Save Form</DialogTitle>
                <DialogContent>
                    <TextField autoFocus 
                        margin='dense'
                        label='Form Name'
                        type='text'
                        fullWidth
                        variant='outlined'
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        sx = {{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveForm} variant='contained' disabled={!formName.trim() || currentForm.fields.length === 0}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )

}

export default FormBuilder