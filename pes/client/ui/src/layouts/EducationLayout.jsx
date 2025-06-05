import React from 'react';
import { Dashboard, School, Event, CalendarToday } from '@mui/icons-material';
import DashboardUI from '../components/ui/DashhboardUI';

function EducationLayout() {
    const navigationItems = [
        {
            segment: 'education/classes',
            title: 'Class Management',
            icon: <School />,
        },
        {
            segment: 'education/schedules',
            title: 'Schedule Management',
            icon: <CalendarToday />,
        },
        {
            segment: 'education/activities',
            title: 'Activity Management',
            icon: <Event />,
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