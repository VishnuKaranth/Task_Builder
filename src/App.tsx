import { Routes, Route } from 'react-router-dom'
import { Container, AppBar, Toolbar, Typography, Box } from '@mui/material'
import Navigation from './components/Navigation'
import FormBuilder from './pages/FormBuilder'
import FormPreview from './pages/FormPreview'
import MyForms from './pages/MyForms'

function App() {
  return (
    <Box sx={{ felxGrow: 1}}>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Form Builder - Upilance.ai
          </Typography>
          <Navigation />
        </Toolbar>
      </AppBar>

      <Container maxWidth='lg' sx={{ mt: 4, mb: 4}}>
        <Routes>
          <Route path='/' element={<FormBuilder />} />
          <Route path='/create' element={<FormBuilder />} />
          <Route path='/preview' element={<FormPreview />} />
          <Route path='/preview/:formId' element={<FormPreview />} />
          <Route path='/myforms' element={<MyForms />} />
          
        </Routes>
      </Container>
    </Box>
  )
}

export default App