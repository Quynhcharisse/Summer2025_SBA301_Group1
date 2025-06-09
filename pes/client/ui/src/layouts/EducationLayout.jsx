import React from 'react';
import { Dashboard, School, Event, CalendarToday } from '@mui/icons-material';
import DashboardUI from '../components/ui/DashhboardUI';

function EducationLayout() {
    const navigationItems = [
        {
            segment: 'education/schedules',
            title: 'Schedule Management',
            icon: <CalendarToday sx={{ color: '#666' }} />,
        },
        {
            segment: 'education/activities',
            title: 'Activity Management',
            icon: <Event sx={{ color: '#666' }} />,
        }
    ];

    return (
        <DashboardUI 
            navigate={navigationItems}
            homeUrl="/education"
        />
    );
}

export default EducationLayout;