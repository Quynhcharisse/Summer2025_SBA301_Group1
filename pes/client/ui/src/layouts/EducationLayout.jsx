import React from 'react';
import {Dashboard, School, Event, CalendarToday, PlayLesson, Book} from '@mui/icons-material';
import DashboardUI from '../components/ui/DashhboardUI';

function EducationLayout() {
    const navigationItems = [
        {
            segment: 'education/schedules',
            title: 'Schedule Management',
            icon: <CalendarToday sx={{ color: '#666' }} />,
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