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
            segment: 'education/syllabus',
            title: 'Syllabus Management',
            icon: <Book />,
        },
        {
            segment: 'education/lessons',
            title: 'Lessons Management',
            icon: <PlayLesson />,
        }
        {
            segment: 'education/activities',
            title: 'Activity Management',
            icon: <Event />,
        },
        {
            segment: 'education/schedules',
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