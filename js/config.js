// ================================================================
// SITE CONFIG — edit this file to update projects and content
// ================================================================
//
// HELPERS
// -------
// seq(folder, count, ext, overrides)
//   Generates a sequential image list: 01.jpg, 02.jpg, ...
//   ext defaults to 'jpg'. overrides = { 5: 'png', 12: null } where null skips that number.
//
// imgs(folder, files)
//   Shorthand for named gallery arrays — wraps filenames into { src } objects.
//
// HOW TO ADD A PROJECT
// --------------------
// Copy the template below and paste it as a new entry in the PROJECTS array.
//
// TEMPLATE:
// {
//     id:           'kebab-case-unique-slug',
//     title:        'Human Readable Title',
//     year:         '2024',
//     category:     'academic',                 // 'academic' | 'employment'
//     location:     'City, Country',
//     participants: 'Name, Other Name',
//     type:         'free-text short label',
//     description:  `long multi-line text`,
//     model:        'assets/projects/id/models/file.glb',   // optional
//     images:       imgs('assets/projects/id/gallery/', ['01.jpg', '02.jpg']),
//     slides:       seq('assets/projects/id/slides/', 49),
// }

function seq(folder, n, ext = 'jpg', ov = {}) {
    const r = [];
    for (let i = 1; i <= n; i++) {
        const e = Object.prototype.hasOwnProperty.call(ov, i) ? ov[i] : ext;
        if (e) r.push(`${folder}${String(i).padStart(2, '0')}.${e}`);
    }
    return r;
}

function imgs(folder, files) {
    return files.map(f => Array.isArray(f) ? { src: folder + f[0], label: f[1] } : { src: folder + f });
}

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
        model: 'assets/projects/101-gates/models/spring.glb',
        images: [{ src: 'assets/projects/101-gates/gallery/01.png', label: 'Details Model' }],
        slides: seq('assets/projects/101-gates/slides/', 49, 'png'),
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
        slides: seq('assets/projects/re-possessing-industrial/slides/', 92),
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
        images: [
            ...seq('assets/projects/get-lost/gallery/', 15).map(src => ({ src })),
            ...imgs('assets/projects/get-lost/gallery/', [
                'Arch_For_Change.png', 'beach_box.jpg', 'bridge.jpg',
                'communal_library.jpg', 'disassemble_story.jpg',
                'energy_usage.jpg', 'facade_a1.jpg',
            ]),
        ],
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
        slides: seq('assets/projects/horizontal-modernism/slides/', 99, 'jpg', { 47: 'gif', 88: 'png' }),
    },
    {
        id: 'pray-and-play',
        title: 'Pray & Play',
        year: '2024',
        category: 'academic',
        location: 'Tel Aviv, Israel',
        participants: 'Nir Dellus',
        type: 'Studio 10',
        description: `The weapons industry is responsible for massive ecological pollution in industrial areas in Israel. A living example of this is the abandoned weapons factory of Ta'as (IMI – Israel Military Industries) at the edge of the Nachalat Yitzhak and Yad Eliyahu neighborhoods in Tel Aviv. The factory was abandoned in the 1990s and was active for only thirty years. During its operation, the polluting side-effects of working with metals were poured into untreated absorption pits, which caused the pollution of about forty dunams in the heart of Tel Aviv. The area of the factory today is highly sought-after due to its location, but because of the pollution, the condition for building is a thorough cleaning of the polluted groundwater, something that requires enormous financial funding.

The planning proposal stemmed from engaging with critical questions for the maximal utilization of a polluted area: what can be done with an abandoned weapons factory? How does one cope with massive soil pollution? Through proposing programs that are contrary to one another — a prayer hall and a dance club — the planning contains the moral duality of the weapons industry. The aspiration of the planning does not propose an unequivocal solution regarding the moral question, but it certainly contains the existing morality.

Guided by Ifat Finkelman and Deborah Pinto Fdeda.`,
        slides: seq('assets/projects/pray-and-play/slides/', 69),
    },
    {
        id: 'stor-e-age',
        title: 'Stor(e)age',
        year: '2023',
        category: 'academic',
        location: 'Jerusalem, Israel',
        participants: 'Nir Dellus',
        type: 'Studio 9',
        description: `Description to be added.`,
        slides: seq('assets/projects/stor-e-age/slides/', 147, 'jpeg', {
            5:'png', 6:'png', 7:'png', 8:'png', 9:'png', 10:'png',
            12:'png', 19:'png', 21:'png', 22:'png', 23:'png', 24:'png', 25:'png', 26:'png', 27:'png',
            52:'png', 53:'png', 54:'png', 55:'png', 57:'png', 59:'png', 61:'png', 63:'png', 65:'png', 67:'png', 70:'png',
            84:'jpg', 85:'jpg', 86:'jpg', 87:'jpg', 94:'png',
            109:'jpg', 110:'jpg', 111:'jpg', 113:'jpg', 114:'jpg',
            68: null, 69: null,
        }),
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
        images: imgs('assets/projects/for-now-house/gallery/', [
            'CNC_machine.png', 'Cnc_Example.png', 'Code_Image.png',
            'Code_modol_1x1.png', 'Code_modol_2x5.png', 'Conect_In_The_Air.png',
            'Connectors-02.png', 'Cross_Detail.png', 'Full_Section.png',
            'Hand_Mockup.png', 'Section_View.jpg',
        ]),
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
        images: imgs('assets/projects/cloud-to-ground/gallery/', [
            'cast.jpg', 'mold_draft.jpg', 'mold_01.jpg', 'mold_02.jpg', 'mold_03.jpg',
            'tile_sample.jpg', 'tile_sample_01.jpg', 'iso_gardem_F0.jpg', 'iso_gardem_F1.jpg',
        ]),
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
