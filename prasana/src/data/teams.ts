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
            uuid: '3543cbfc-15de-49fd-8ae1-c7b69448c3e5',
           
        },
        tdm: {
            name: 'Selvendrane',
            role: 'Technical Account Manager',
            designation: 'Associate Trainee',
            avatar: '/profiles/selvandrane.png',
            uuid: '',

            
        },
        cxm: {
            name: 'Maheshwaran',
            role: 'Client Experience Manager',
            designation: 'Associate Trainee',
            avatar: '/profiles/mahesh.png',
            uuid: '',

           
        },
        members: [
            {
                name: 'Theepatharan',
                role: 'Associate Trainee',
                avatar: '/profiles/theepa.png',
                uuid: '',

                
            },
            {
                name: 'Fazeela',
                role: 'Associate Trainee',
                avatar: '/profiles/fazzela.png',
                uuid: '',

            },
            {
                name: 'Sivaranjani',
                role: 'Associate Trainee',
                avatar: '/profiles/sivaranjani.png',
                uuid: '',

            }
        ]
    },
    dynamix: {
        name: 'DYNAMIX',
        sdm: {
            name: 'Yuvaraj',
            role: 'Service Delivery Manager',
            designation: 'Associate Trainee',
            avatar: '/profiles/yuvaraj.png',
            uuid: '',

        },
        tdm: {
            name: 'Purushoth',
            role: 'Technical Account Manager',
            designation: 'Associate Trainee',
            avatar: '/profiles/pourushoth.png',
            uuid: '',

        },
        cxm: {
            name: 'Kiyshore K',
            role: 'Client Experience Manager',
            designation: 'Associate Trainee',
            avatar: '/profiles/kiyshor.png',
            uuid: '',

        },
        members: [
            {
                name: 'Praveen Dommeti',
                role: 'Associate Trainee',
                avatar: '/profiles/praveen.png',
                uuid: '',

            }
        ]
    },
    nexus: {
        name: 'NEXUS',
        sdm: {
            name: 'Eashwara Prasadh',
            role: 'Service Delivery Manager',
            avatar: '/profiles/eashwara_prasadh.jpg',
            uuid: '',

        },
        tdm: {
            name: 'Yusuf Fayas',
            role: 'Technical Account Manager',
            designation: 'Associate Trainee',
            avatar: '/profiles/yusuf.png',
            uuid: '',

        },
        cxm: {
            name: 'Darshan K',
            role: 'Client Experience Manager',
            designation: 'Associate Trainee',
            avatar: '/profiles/darshan.png',
            uuid: '',

        },
        members: [
            {
                name: 'Gaushik',
                role: 'Associate Trainee',
                avatar: '/profiles/gaushik.png',
                uuid: '',

            },
            {
                name: 'Sakthivel',
                role: 'Associate Trainee',
                avatar: '/profiles/sakthivel.png',
                uuid: '',

            }
        ]
    },
    titan: {
        name: 'TITAN',
        sdm: {
            name: 'Aamina Begam T',
            role: 'Service Delivery Manager',
            designation: 'Associate Trainee',
            avatar: '/profiles/aamina.png',
            uuid: '41d8e0c5-077f-4227-a4cb-6098ffc44671',
        },
        tdm: {
            name: 'Gowtham Kollati',
            role: 'Technical Account Manager',
            designation: 'Associate Trainee',
            avatar: '/profiles/kollati.png',
            uuid: '',
        },
        cxm: {
            name: 'Prasanna',
            role: 'Client Experience Manager',
            designation: 'Associate Trainee',
            avatar: '/profiles/prasana.png',
            uuid: '',
        },
        members: [
            {
                name: 'Yamini',
                role: 'Associate Trainee',
                avatar: '/profiles/yamini.png',
                uuid: '',
            },
            {
                name: 'Shri Mathi',
                role: 'Associate Trainee',
                avatar: '/profiles/shri.png',
                uuid: '',
            },
           
        ]
    }
}; 