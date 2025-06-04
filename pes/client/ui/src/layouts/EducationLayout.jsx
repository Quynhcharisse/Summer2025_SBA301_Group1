import React from 'react';
import { Dashboard, School, Event, CalendarToday } from '@mui/icons-material';
import DashboardUI from '../components/ui/DashhboardUI';

function EducationLayout() {
    const navigationItems = [
        {
            segment: 'classes',
            title: 'Class Management',
            icon: <School />,
        },
        {
            segment: 'activities',
            title: 'Activity Management',
            icon: <Event />,
        },
        {
            segment: 'schedules',
            title: 'Schedule Management',
            icon: <CalendarToday />,
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