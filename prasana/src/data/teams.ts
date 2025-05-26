import { Teams } from '../types/team';

// Helper function to get local profile image path - REMOVED
// const getProfileImage = (name: string) => {
//     // Convert name to lowercase and replace spaces with underscores
//     const imageName = name.toLowerCase().replace(/\s+/g, '_');
//     return `/profiles/${imageName}.jpg`;  // Assuming images are in JPG format
// };

export const teams: Teams = {
    athena: {
        name: 'ATHENA',
        sdm: {
            name: 'Sri Ram',
            role: 'Service Delivery Manager',
            designation: 'Associate Trainee',
            avatar: '/profiles/sri_ram.png',
            badges: [
                {
                    name: 'IT Support Professional',
                    description: 'Skilled in troubleshooting hardware, software, and network issues; proficient in tools like ServiceNow, Active Directory, Outlook, and printer support.',
                    image: '/badges/it-support.png',
                    awardedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
                    expiryDays: 90
                },
                {
                    name: 'Web Development Professional',
                    description: 'Certified in developing responsive and interactive websites using HTML, CSS, JavaScript, and modern libraries or frameworks like React and Bootstrap.',
                    image: '/badges/web-dev.png',
                    awardedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                    expiryDays: 90
                }
            ]
        },
        tdm: {
            name: 'Selvendrane',
            role: 'Technical Account Manager',
            designation: 'Associate Trainee',
            avatar: '/profiles/selvandrane.png',
            badges: [
                {
                    name: 'Office 365 Professional',
                    description: 'Certified in Microsoft Office 365 suite including Outlook, Word, Excel, PowerPoint, OneDrive, and Teams with expertise in productivity and collaboration tools.',
                    image: '/badges/office365.png',
                    awardedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
                    expiryDays: 90
                }
            ]
        },
        cxm: {
            name: 'Maheshwaran',
            role: 'Client Experience Manager',
            designation: 'Associate Trainee',
            avatar: '/profiles/mahesh.png',
            badges: [
                {
                    name: 'Full Stack Development',
                    description: 'Certified in both front-end and back-end technologies, capable of building complete web applications using tools like React, Node.js, Java, and databases.',
                    image: '/badges/fullstack.png',
                    awardedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                    expiryDays: 90
                }
            ]
        },
        members: [
            {
                name: 'Theepatharan',
                role: 'Associate Trainee',
                avatar: '/profiles/theepa.png',
                badges: [
                    {
                        name: 'Client Acquisition',
                        description: 'Recognized for expertise in identifying leads, nurturing client relationships, converting prospects, and driving business growth through strategic outreach.',
                        image: '/badges/client-acquisition.png',
                        awardedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                        expiryDays: 90
                    }
                ]
            },
            {
                name: 'Fazeela',
                role: 'Associate Trainee',
                avatar: '/profiles/fazzela.png',
                badges: [
                    {
                        name: 'Digital Marketing Professional',
                        description: 'Certified in SEO, SEM, social media marketing, email campaigns, and content strategy to boost brand visibility and lead generation.',
                        image: '/badges/digital-marketing.png',
                        awardedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                        expiryDays: 90
                    }
                ]
            },
            {
                name: 'Sivaranjani',
                role: 'Associate Trainee',
                avatar: '/profiles/sivaranjani.png',
                badges: [
                    {
                        name: 'Data Analysis Professional',
                        description: 'Certified in analyzing data using Excel, PowerBI, or R, with skills in data visualization, statistical analysis, and deriving actionable insights.',
                        image: '/badges/data-analysis.png',
                        awardedDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
                        expiryDays: 90
                    }
                ]
            }
        ]
    },
    dynamix: {
        name: 'DYNAMIX',
        sdm: {
            name: 'Yuvaraj',
            role: 'Service Delivery Manager',
            designation: 'Associate Trainee',
            avatar: '/profiles/yuvaraj.png' // Updated path
        },
        tdm: {
            name: 'Purushoth',
            role: 'Technical Account Manager',
            designation: 'Associate Trainee',
            avatar: '/profiles/pourushoth.png' // Updated path
        },
        cxm: {
            name: 'Kiyshore K',
            role: 'Client Experience Manager',
            designation: 'Associate Trainee',
            avatar: '/profiles/kiyshor.png' // Updated path
        },
        members: [
            {
                name: 'Praveen Dommeti',
                role: 'Associate Trainee',
                avatar: '/profiles/praveen.png' // Updated path
            }
        ]
    },
    nexus: {
        name: 'NEXUS',
        sdm: {
            name: 'Eashwara Prasadh',
            role: 'Service Delivery Manager',
            avatar: '/profiles/eashwara_prasadh.jpg' // Updated path
        },
        tdm: {
            name: 'Yusuf Fayas',
            role: 'Technical Account Manager',
            designation: 'Associate Trainee',
            avatar: '/profiles/yusuf.png' // Updated path
        },
        cxm: {
            name: 'Darshan K',
            role: 'Client Experience Manager',
            designation: 'Associate Trainee',
            avatar: '/profiles/darshan.png' // Updated path
        },
        members: [
            {
                name: 'Gaushik',
                role: 'Associate Trainee',
                avatar: '/profiles/gaushik.png' // Updated path
            },
            {
                name: 'Sakthivel',
                role: 'Associate Trainee',
                avatar: '/profiles/sakthivel.png' // Updated path
            }
        ]
    },
    titan: {
        name: 'TITAN',
        sdm: {
            name: 'Aamina Begam T',
            role: 'Service Delivery Manager',
            designation: 'Associate Trainee',
            avatar: '/profiles/aamina.png' // Updated path
        },
        tdm: {
            name: 'Gowtham Kollati',
            role: 'Technical Account Manager',
            designation: 'Associate Trainee',
            avatar: '/profiles/kollati.png' // Updated path
        },
        cxm: {
            name: 'Prasanna',
            role: 'Client Experience Manager',
            designation: 'Associate Trainee',
            avatar: '/profiles/prasana.png' // Updated path
        },
        members: [
            {
                name: 'Yamini',
                role: 'Associate Trainee',
                avatar: '/profiles/yamini.png' // Updated path
            },
            {
                name: 'Shri Mathi',
                role: 'Associate Trainee',
                avatar: '/profiles/shri.png' // Updated path
            },
            {
                name: 'Jai Rasiga',
                role: 'Associate Trainee',
                avatar: '/profiles/rasigaa.png' // Updated path
            }
        ]
    }
}; 