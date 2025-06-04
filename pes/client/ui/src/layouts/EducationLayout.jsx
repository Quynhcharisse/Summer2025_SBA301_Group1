import React from 'react';
import { Box, Drawer, List, ListItem, ListItemText, Toolbar } from '@mui/material';
import { NavLink, Outlet } from 'react-router-dom';
import ActivityManagement from '../components/educationManager/ActivityManagement';
import ClassList from '../components/educationManager/ClassList';
import Dashboard from '../components/educationManager/Dashboard';
import ScheduleManagement from '../components/educationManager/ScheduleManagement';

const drawerWidth = 240;

function EducationLayout() {
    const navigationItems = [
        { text: 'Dashboard', path: '/education/dashboard' },
        { text: 'Class Management', path: '/education/classes' },
        { text: 'Activity Management', path: '/education/activities' },
        { text: 'Schedule Management', path: '/education/schedules' }
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {navigationItems.map((item) => (
                            <ListItem key={item.text} disablePadding>
                                <NavLink
                                    to={item.path}
                                    style={({ isActive }) => ({
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        width: '100%',
                                        backgroundColor: isActive ? 'rgba(0, 0, 0, 0.08)' : 'transparent'
                                    })}
                                >
                                    <ListItemText 
                                        primary={item.text}
                                        sx={{ 
                                            padding: '8px 16px',
                                            margin: 0
                                        }}
                                    />
                                </NavLink>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: 'background.default',
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` }
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}

export default EducationLayout;