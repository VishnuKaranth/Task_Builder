import { Button, Box } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'

const Navigation = () => {
    const navigate = useNavigate()
    const location = useLocation()
    
    const routes = [
        { path: '/create', label: 'Create Form' },
        { path: '/preview', label: 'Preview Form' },
        { path: '/myforms', label: 'My Forms' },
    ]

    return (
        <Box sx={{ display: 'flex', gap: 2}}>
            {routes.map((route) => (
                <Button
                    key = {route.path}
                    color = "inherit"
                    onClick={() => navigate(route.path)}
                    variant={location.pathname === route.path ? 'outlined' : 'text' }
                    sx={{
                        borderColor: location.pathname === route.path ? 'white' : 'transparent', color: 'white'
                    }}
                >
                    {route.label}
                </Button>
            ))}
        </Box>
  )
}

export default Navigation