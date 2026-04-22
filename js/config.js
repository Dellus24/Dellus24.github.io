// ================================================================
// SITE CONFIG — edit this file to update projects and content
// ================================================================
//
// HOW TO ADD A PROJECT
// --------------------
// Copy the template below and paste it as a new entry in the PROJECTS
// array. Order in the array = order of appearance in the sidebar
// (grouped by category). To reorder, just move the entry.
//
// TEMPLATE:
// {
//     id:           'kebab-case-unique-slug',   // required; must be unique
//     title:        'Human Readable Title',     // required
//     year:         '2024',                     // required; string, used for grouping
//     category:     'academic',                 // required; 'academic' | 'employment'
//     location:     'City, Country',            // required
//     participants: 'Name, Other Name',         // required
//     type:         'free-text short label',    // required; e.g. 'Research Thesis'
//     description:  'long multi-line text',     // required
//     model:        'assets/models/Foo.glb',    // optional; presence enables 3D View
//     images: [                                 // optional; presence enables Gallery
//         { src: 'assets/images/foo.jpg', label: 'Caption' },
//     ],
// }
//
// NOTES
// -----
// • Paths are relative to the site root (index.html at repo root).
// • `category` drives which section of the sidebar the project appears in.
// • External image URLs (e.g. unsplash.com/...) work too.
// • To TEMPORARILY hide a project, wrap it in /* ... */ — don't delete.
//

const PROJECTS = [
    {
        id: '101 Gates',
        title: '101 Gates',
        year: '2024',
        category: 'academic',
        location: 'Jerusalem, Israel',
        participants: 'Nir Dellus',
        type: 'Studio 10',
        description: '101 GATES Design & Research The conservative religious space of the community in Geulim, Jerusalem, is becoming increasingly crowded. An extreme high birth rate, conservative lifestyle, and restrictions are prominent features of the Haredi ultra orthodox community. These characteristics impact the urban environment, transforming it accordingly. Basic daily activities of the family unit inevitably spill out into the street. Playing is among the most prominent activities, with children claiming the sidewalks and asphalt for their games, whether it's with a ball or by climbing. The space changes according to the children's rules at that moment. The project analyzes the religious space today, the 'halacha' definition of space, and in response proposes creating a new religious urban space that meets the needs of a population where children are the majority. 08/24 Guided By Ilit Ainkelman Deborah Pinto Fdeda',
        model: 'assets/models/Building test.glb',
        images: [
            { src: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200', label: 'Exterior View' },
            { src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200', label: 'Interior Study' },
            { src: 'https://images.unsplash.com/photo-1618221469555-7f3ad97540d6?w=1200', label: 'Detail 01' },
        ],
    },
    {
        id: 'mir-archive',
        title: 'MIR Archive',
        year: '2024',
        category: 'academic',
        location: 'Oslo, Norway',
        participants: 'MIR Studio, Nir Dellus',
        type: 'Digital Archive',
        description: 'A comprehensive digital archive of architectural visualizations exploring the intersection of photorealism and architectural imagination. Research into archival methods for digital image production in contemporary practice.',
        images: [
            { src: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200', label: 'Archive 01' },
            { src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200', label: 'Archive 02' },
            { src: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?w=1200', label: 'Archive 03' },
        ],
    },
    {
        id: '30-questions',
        title: '30 Questions and Answers',
        year: '2023',
        category: 'academic',
        location: 'Jerusalem, Israel',
        participants: 'Nir Dellus',
        type: 'Research Thesis',
        description: 'A research thesis structured as 30 questions and answers, interrogating the relationship between architectural theory and contemporary digital practice. Each question opens a field of inquiry; each answer proposes a disciplinary position.',
        images: [
            { src: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1200', label: 'Document 01' },
            { src: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200', label: 'Document 02' },
        ],
    },
    {
        id: 'threshold-conditions',
        title: 'Threshold Conditions',
        year: '2023',
        category: 'academic',
        location: 'Aarhus, Denmark',
        participants: 'Nir Dellus',
        type: 'Design Study',
        description: 'A design study conducted during exchange at Aarhus School of Architecture, investigating threshold conditions in Nordic domestic architecture and the spatial negotiation between interior and exterior.',
        images: [
            { src: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=1200', label: 'Study 01' },
            { src: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200', label: 'Study 02' },
            { src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200', label: 'Study 03' },
        ],
    },
    {
        id: 'spatial-code',
        title: 'Spatial Code',
        year: '2024',
        category: 'employment',
        location: 'Tel Aviv, Israel',
        participants: 'Derman Verbakel Architects, Nir Dellus',
        type: 'Research & Design',
        description: 'Research and design work developed at Derman Verbakel Architects, investigating computational approaches to spatial design and the translation between code and built form.',
        images: [
            { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200', label: 'Research 01' },
            { src: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200', label: 'Research 02' },
        ],
    },
    {
        id: 'office-tower-haifa',
        title: 'Office Tower Haifa',
        year: '2022',
        category: 'employment',
        location: 'Haifa, Israel',
        participants: 'Israeli Pavilion, Venice Biennale · Nir Dellus',
        type: 'Research & Prototype',
        description: 'Research and prototype work for the Israeli Pavilion at the Venice Architecture Biennale 2022, exploring tensions between speculative architectural proposals and the realities of contemporary construction culture.',
        images: [
            { src: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200', label: 'Prototype 01' },
            { src: 'https://images.unsplash.com/photo-1553603227-2358aabe821e?w=1200', label: 'Prototype 02' },
            { src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200', label: 'Prototype 03' },
        ],
    },
];

// ================================================================
// STATIC PAGES — About / CV / Contact
// ----------------------------------------------------------------
// Keys ('about', 'cv', 'contact') are referenced from the sidebar
// by data-static="<key>". Add a new key here + add a matching row
// in the sidebar (index.html, inside buildMenuWindow) to expose it.
// `body` supports plain text; newlines and indentation are preserved
// (rendered inside <pre>).
// ================================================================

const STATIC = {
    about: {
        title: 'About',
        body: `NIR DELLUS
B.Arch — Bezalel Academy of Arts and Design

Architect, researcher, and educator working across digital
design, architectural theory, and computational methods.

Currently at Derman Verbakel Architects in research and
design, and Teaching Assistant at Bezalel Architecture.

Research interests span the relationship between digital
tools and architectural thinking, archival methods, and
the politics of built form.`,
    },
    contact: {
        title: 'Contact',
        body: `NIR DELLUS

Email     nir.d@deve-arc.com

Location  Jerusalem & Tel Aviv, Israel

Open for research collaborations,
teaching, and design work.`,
    },
    cv: {
        title: 'CV — Nir Dellus',
        body: `NIR DELLUS — CURRICULUM VITAE


EXPERIENCE

2024–Present   Derman Verbakel Architects
               Research & Design

2023–2025      Bezalel Architecture Department
               Teaching Assistant

2022–2023      Israeli Pavilion
               Venice Architecture Biennale
               Research & Prototype

2021           Sabio Levy Architects
               Concept Development

2019           Carpentry
               Furniture and Set Design Constructions

2015–2018      Obligatory Service

2014–2015      Volunteer Year, Tarbut Movement


EDUCATION

2019–2024      Bezalel Academy of Arts and Design
               Jerusalem — B.Arch.

2023 (Fall)    Exchange Studies
               Aarhus School of Architecture

2011–2013      Ankori High School, Rishon LeZion
               High School Diploma


LANGUAGES

Hebrew         Native
English        Fluent`,
    },
};
