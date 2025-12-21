export const sampleProfile = {
    name: 'Alex Johnson',
    title: 'Senior Frontend Engineer',
    contact: {
        email: 'alex.johnson@example.com',
        phone: '+1 (555) 123-4567',
        location: 'Remote — US/EU',
        website: 'https://alex.dev',
    },
    summary:
        'Engineer focused on performant, accessible web apps. Enjoys design systems, DX improvements, and mentoring teams to ship reliable UI.',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Testing Library', 'Node.js', 'System Design'],
    experience: [
        {
            company: 'TechNova',
            role: 'Senior Frontend Engineer',
            duration: '2022 — Present',
            location: 'Remote',
            achievements: [
                'Led migration to a design system, reducing build time for new pages by 35%.',
                'Improved Core Web Vitals (LCP +22%, CLS -40%) through bundle trimming and image optimizations.',
                'Partnered with QA to add visual regression tests for critical flows.',
            ],
        },
        {
            company: 'BrightApps',
            role: 'Frontend Developer',
            duration: '2019 — 2022',
            location: 'Hybrid',
            achievements: [
                'Rebuilt marketing surfaces in Next.js, lifting conversion by 14%.',
                'Introduced component linting and story-driven development to reduce UI regressions.',
            ],
        },
    ],
    education: [
        {
            school: 'State University',
            degree: 'B.S. in Computer Science',
            graduationYear: 2019,
        },
    ],
};

export default sampleProfile;
