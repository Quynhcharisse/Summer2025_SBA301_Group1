import React from 'react';
import {Dashboard, School, PlayLesson, Book} from '@mui/icons-material';
import DashboardUI from '../components/ui/DashhboardUI';

function EducationLayout() {
    const navigationItems = [
        {
            segment: 'education/classes',
            title: 'Class Management',
            icon: <School sx={{ color: '#666' }} />,
        },
        {
            segment: 'education/syllabus',
            title: 'Syllabus Management',
            icon: <Book sx={{ color: '#666' }} />,
        },
        {
            segment: 'education/lessons',
            title: 'Lessons Management',
            icon: <PlayLesson sx={{ color: '#666' }} />,
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