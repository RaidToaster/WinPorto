const portfolioData = {
    categories: [
        {
            id: 'certifications',
            name: 'Certifications',
            icon: 'path/to/certification-icon.png', // Placeholder icon
            files: [
                {
                    name: 'Sample Certification 1',
                    path: 'src/assets/portfolio/documents/sample_cert_1.pdf',
                    type: 'pdf',
                    description: 'A sample certification document.'
                },
                {
                    name: 'Sample Certification 2',
                    path: 'src/assets/portfolio/documents/sample_cert_2.pdf',
                    type: 'pdf',
                    description: 'Another sample certification document.'
                }
            ]
        },
        {
            id: 'experience',
            name: 'Experience Documents',
            icon: 'path/to/experience-icon.png', // Placeholder icon
            files: [
                {
                    name: 'Resume',
                    path: 'src/assets/portfolio/documents/resume.pdf',
                    type: 'pdf',
                    description: 'My professional resume.'
                },
                {
                    name: 'Cover Letter Sample',
                    path: 'src/assets/portfolio/documents/cover_letter_sample.docx',
                    type: 'docx',
                    description: 'A sample cover letter.'
                }
            ]
        },
        {
            id: 'projects',
            name: 'Projects Portfolio',
            icon: 'path/to/projects-icon.png', // Placeholder icon
            files: [
                {
                    name: 'Project X Overview',
                    path: 'src/assets/portfolio/documents/project_x_overview.pdf',
                    type: 'pdf',
                    description: 'Overview of Project X.'
                },
                {
                    name: 'Project Y Screenshot',
                    path: 'src/assets/portfolio/images/project_y_screenshot.png',
                    type: 'png',
                    description: 'Screenshot of Project Y.'
                }
            ]
        },
        {
            id: 'images',
            name: 'Images',
            icon: 'path/to/image-icon.png', // Placeholder icon
            files: [
                {
                    name: 'Profile Picture',
                    path: 'src/assets/portfolio/images/profile_pic.jpg',
                    type: 'jpg',
                    description: 'My professional profile picture.'
                },
                {
                    name: 'Diagram 1',
                    path: 'src/assets/portfolio/images/diagram_1.png',
                    type: 'png',
                    description: 'A system architecture diagram.'
                }
            ]
        }
    ]
};

export default portfolioData;