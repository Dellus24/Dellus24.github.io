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
//     description:  `long multi-line text`,     // required — use backticks so apostrophes & quotes inside are fine
//     model:        'assets/models/Foo.glb',    // optional; presence enables 3D View
//     images: [                                 // optional; presence enables Gallery
//         { src: 'assets/images/foo.jpg', label: 'Caption' },
//     ],
//     slides: [                                 // optional; presence enables Slides (presentation viewer)
//         'assets/slides/kebab-id/01.jpg',      // plain paths, shown in order
//         'assets/slides/kebab-id/02.jpg',
//     ],
// }
//
// NOTES
// -----
// • Paths are relative to the site root (index.html at repo root).
// • `category` drives which section of the sidebar the project appears in.
// • To TEMPORARILY hide a project, wrap it in /* ... */ — don't delete.
// • id must be kebab-case with no spaces: '101-gates' not '101 Gates'.
// • description: use backticks (`...`) not quotes so apostrophes don't break it.
//

const PROJECTS = [
    // ── ACADEMIC ─────────────────────────────────────────────────
    {
        id: '101-gates',
        title: '101 Gates',
        year: '2024',
        category: 'academic',
        location: 'Jerusalem, Israel',
        participants: 'Nir Dellus',
        type: 'Studio 10',
        description: `The conservative religious space of the community in Geulim, Jerusalem, is becoming increasingly crowded. An extreme high birth rate, conservative lifestyle, and restrictions are prominent features of the Haredi ultra orthodox community. These characteristics impact the urban environment, transforming it accordingly. Basic daily activities of the family unit inevitably spill out into the street. Playing is among the most prominent activities, with children claiming the sidewalks and asphalt for their games, whether it's with a ball or by climbing. The space changes according to the children's rules at that moment. The project analyzes the religious space today, the 'halacha' definition of space, and in response proposes creating a new religious urban space that meets the needs of a population where children are the majority.

Guided by Ifat Finkelman and Deborah Pinto Fdeda.`,
        model: 'assets/projects/101-gates/models/Connector Detail 3 Ways.glb',
        images: [
            { src: 'assets/projects/101-gates/gallery/01.png', label: 'Details Model' },
        ],
        slides: [
            'assets/projects/101-gates/slides/Presentation 3.png',
            'assets/projects/101-gates/slides/Presentation 4.png',
            'assets/projects/101-gates/slides/Presentation 9.png',
            'assets/projects/101-gates/slides/Presentation 10.png',
            'assets/projects/101-gates/slides/Presentation 11.png',
            'assets/projects/101-gates/slides/Presentation 12.png',
            'assets/projects/101-gates/slides/Presentation 14.png',
            'assets/projects/101-gates/slides/Presentation 18.png',
            'assets/projects/101-gates/slides/Presentation 20.png',
            'assets/projects/101-gates/slides/Presentation 21.png',
            'assets/projects/101-gates/slides/Presentation 22.png',
            'assets/projects/101-gates/slides/Presentation 23.png',
            'assets/projects/101-gates/slides/Presentation 24.png',
            'assets/projects/101-gates/slides/Presentation 25.png',
            'assets/projects/101-gates/slides/Presentation 26.png',
            'assets/projects/101-gates/slides/Presentation 27.png',
            'assets/projects/101-gates/slides/Presentation 28.png',
            'assets/projects/101-gates/slides/Presentation 29.png',
            'assets/projects/101-gates/slides/Presentation 30.png',
            'assets/projects/101-gates/slides/Presentation 31.png',
            'assets/projects/101-gates/slides/Presentation 32.png',
            'assets/projects/101-gates/slides/Presentation 33.png',
            'assets/projects/101-gates/slides/Presentation 34.png',
            'assets/projects/101-gates/slides/Presentation 36.png',
            'assets/projects/101-gates/slides/Presentation 37.png',
            'assets/projects/101-gates/slides/Presentation 40.png',
            'assets/projects/101-gates/slides/Presentation 41.png',
            'assets/projects/101-gates/slides/Presentation 42.png',
            'assets/projects/101-gates/slides/Presentation 43.png',
            'assets/projects/101-gates/slides/Presentation 46.png',
            'assets/projects/101-gates/slides/Presentation 47.png',
            'assets/projects/101-gates/slides/Presentation 48.png',
            'assets/projects/101-gates/slides/Presentation 49.png',
            'assets/projects/101-gates/slides/Presentation 50.png',
            'assets/projects/101-gates/slides/Presentation 51.png',
            'assets/projects/101-gates/slides/Presentation 52.png',
            'assets/projects/101-gates/slides/Presentation 53.png',
            'assets/projects/101-gates/slides/Presentation 54.png',
            'assets/projects/101-gates/slides/Presentation 55.png',
            'assets/projects/101-gates/slides/Presentation 56.png',
            'assets/projects/101-gates/slides/Presentation 57.png',
            'assets/projects/101-gates/slides/Presentation 58.png',
            'assets/projects/101-gates/slides/Presentation 59.png',
            'assets/projects/101-gates/slides/Presentation 60.png',
            'assets/projects/101-gates/slides/Presentation 61.png',
            'assets/projects/101-gates/slides/Presentation 62.png',
            'assets/projects/101-gates/slides/Presentation 63.png',
            'assets/projects/101-gates/slides/Presentation 64.png',
            'assets/projects/101-gates/slides/Presentation 65.png',
        ],
    },
    {
        id: 're-possessing-industrial',
        title: 'Re-Possessing The Industrial',
        year: '2022',
        category: 'academic',
        location: 'Thessaloniki, Greece',
        participants: 'Nir Dellus, Shir Yakov, Eran Asulin, Elad Sphindel',
        type: 'Studio 8',
        description: `In this project, we investigated the history of the famous Allatini flour mills in Thessaloniki, a post-industrial structure that has been neglected and abandoned since the 1990s. The factory was one of the city's biggest economic assets, a complex typology that utilizes the shoreline efficiently. In our suggestion, we do not seek to renovate or fix this place; we only aim to preserve it as it is. We saw the beauty in the decay and proposed transforming the old factory into a park for the people of Thessaloniki.

Guided by Zvi Efrat and Liran Messer.`,
    },
    {
        id: 'get-lost',
        title: 'Get Lost',
        year: '2023',
        category: 'academic',
        location: 'Bornholm, Denmark',
        participants: 'Nir Dellus',
        type: 'Studio 7 — Exchange',
        description: `Exchange semester at Aarhus School of Architecture. In the Forest of Bornholm in Denmark, there is a small black box. Nobody knows what is inside, but since we do not want to judge a book by its cover, it will always remain a mystery. The forest has its own story of animals, rocks, and trees. Inspired by the enigma of the forest's black box, I designed a reading cabin in the woods that is built as a story, translating narratological ideas to a domestic infrastructure. The cabin allows one to focus on reading, listening, and contemplating while covered by nature.

Guided by Helle Blom.`,
    },
    {
        id: 'horizontal-modernism',
        title: 'Horizontal Modernism',
        year: '2022',
        category: 'academic',
        location: 'São Paulo, Brazil',
        participants: 'Nir Dellus, Thai Zehavi',
        type: 'Studio 6',
        description: `Every group had to pick a project from the Brazilian modernism movement. We picked the Ibirapuera park in the heart of São Paulo, planned by Oscar Niemeyer. The park is assembled by five public galleries connected by a marquise. Today, the buildings are rented and act as museums, and the surrounding park has more usage than Niemeyer's complex. Our proposal offers to imitate the marquise and apply it to the other buildings, making a horizontal architecture with no facade. The program proposes giving the buildings a new life within the park.

Guided by Zvi Efrat and Liran Messer.`,
    },

    // ── EMPLOYMENT ───────────────────────────────────────────────
    {
        id: 'for-now-house',
        title: 'For Now House',
        year: '2023',
        category: 'employment',
        location: 'Jerusalem, Israel',
        participants: 'Nir Dellus, Edith Kofsky, Michael Walma van der Molen, Naomi van Essen',
        type: 'Academic Research',
        description: `In response to the acute need for rapid housing solutions for displaced communities, we conducted a study to develop a low-cost and agile building system using wooden panels cut by an affordable and deployable CNC milling machine. We built a vertical CNC platform based on the open source Maslow CNC system — low tech, very affordable, and buildable anywhere by anyone. The building system is efficient in its use of materials, lightweight and easy to assemble, provides all finishes and a readily habitable product, is designed for temporary use, can be dismantled and reused, and is flexible to meet changing needs.

Supported and funded by the Bezalel Research Authority.`,
    },
    {
        id: 'cloud-to-ground',
        title: 'Cloud To Ground',
        year: '2023',
        category: 'employment',
        location: 'Venice, Italy',
        participants: 'Nir Dellus, Edith Kofsky, Oren Eldar',
        type: 'Israeli Pavilion — Venice Biennale',
        description: `Cloud-to-Ground stems from an architectural inquiry proposing a multifaceted discussion about the hardware of the Fourth Industrial Revolution, incorporating the pavilion itself as one of the exhibits. Its closure alludes to the physical nature of modern communication networks and the materiality of the technological cloud. Telephone exchange buildings using copper cables are gradually being abandoned and demolished, while huge data centers using fiber-optic cables are rapidly being built. Attesting to the progression of technology, these physical aspects also reflect the shifting powers — ownership of infrastructure as a means of sovereignty. Their opaque appearance paradoxically points to their importance.

Role: research assistant, prototyping and manufacturing.
Curated by Edith Kofsky and Oren Eldar.`,
    },
    {
        id: 'derman-verbakel',
        title: 'Derman Verbakel Architects',
        year: '2024',
        category: 'employment',
        location: 'Tel Aviv, Israel',
        participants: 'Nir Dellus',
        type: 'R&D',
        description: `At the intersection of digital tools and physical construction, working in the R&D department at Derman Verbakel Architects where computational design meets the pragmatic realities of urban planning. In this role, I developed codes for planners that embed planning regulations directly into software, transforming complex legal frameworks into automated design tools. This work included building user interfaces that make computational processes accessible to non-technical users, deconstructing complex design workflows into intuitive interactions. A key project was a data-driven and code-based smart neighbourhood design for Haifa's Bay — processing dataset inputs and user demands to generate planning building polygons and volumes.`,
    },
];

// ================================================================
// STATIC PAGES — About / CV / Contact
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
               R&D — Computational Design & Urban Planning

2023–2025      Bezalel Architecture Department
               Teaching Assistant

2023           Israeli Pavilion
               The 18th Venice Architecture Biennale
               Research, Prototyping & Manufacturing

2023           For Now House
               Bezalel Research Authority
               Academic Research

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
