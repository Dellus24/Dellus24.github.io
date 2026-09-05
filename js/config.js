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
        type: 'Studio 9-10',
        description: `The conservative religious space of the community in Geulim, Jerusalem, is becoming increasingly crowded. An extreme high birth rate, conservative lifestyle, and restrictions are prominent features of the Haredi ultra orthodox community. These characteristics impact the urban environment, transforming it accordingly. Basic daily activities of the family unit inevitably spill out into the street. Playing is among the most prominent activities, with children claiming the sidewalks and asphalt for their games, whether it's with a ball or by climbing. The space changes according to the children's rules at that moment. The project analyzes the religious space today, the 'halacha' definition of space, and in response proposes creating a new religious urban space that meets the needs of a population where children are the majority.

Guided by Ifat Finkelman and Deborah Pinto Fdeda.`,
        model: 'assets/projects/101-gates/models/spring.glb',
        images: [{ src: 'assets/projects/101-gates/gallery/01.webp', label: 'Details Model' }],
        slides: seq('assets/projects/101-gates/slides/', 49, 'webp'),
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
        model: 'assets/projects/re-possessing-industrial/models/silo.glb',
        slides: seq('assets/projects/re-possessing-industrial/slides/', 92, 'webp'),
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
            ...seq('assets/projects/get-lost/gallery/', 15, 'webp').map(src => ({ src })),
            ...imgs('assets/projects/get-lost/gallery/', [
                'Arch_For_Change.webp', 'beach_box.webp', 'bridge.webp',
                'communal_library.webp', 'disassemble_story.webp',
                'energy_usage.webp', 'facade_a1.webp',
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
        slides: seq('assets/projects/horizontal-modernism/slides/', 99, 'webp', { 47: 'gif' }),
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
        slides: seq('assets/projects/stor-e-age/slides/', 147, 'webp', { 68: null, 69: null }),
    },

    {
        id: 'pray-and-play',
        title: 'Pray & Play',
        year: '2021',
        category: 'academic',
        location: 'Tel Aviv, Israel',
        participants: 'Nir Dellus',
        type: 'Studio 3',
        description: `The weapons industry is responsible for massive ecological pollution in industrial areas in Israel. A living example of this is the abandoned weapons factory of Ta'as (IMI – Israel Military Industries) at the edge of the Nachalat Yitzhak and Yad Eliyahu neighborhoods in Tel Aviv. The factory was abandoned in the 1990s and was active for only thirty years. During its operation, the polluting side-effects of working with metals were poured into untreated absorption pits, which caused the pollution of about forty dunams in the heart of Tel Aviv. The area of the factory today is highly sought-after due to its location, but because of the pollution, the condition for building is a thorough cleaning of the polluted groundwater, something that requires enormous financial funding.

The planning proposal in the project stemmed from engaging with critical questions for the maximal utilization of a polluted area: what can be done with an abandoned weapons factory? How does one cope with massive soil pollution? If the cleaning of the groundwater succeeds, what programs could be made possible in enormous work spaces? What does one do with spaces that have dimensions precise to the weapons industry? How does one treat the existing structure? Is it preferable to demolish the factory and build a new building? These questions were the first to arise and they are the heart of the planning and the work around it.

One of the starting points for these questions deals with the double morality upon which the weapons industry is founded. On the one hand, the weapon is created from the purpose of defense and security in the state, and without this industry the enterprise of building the country could not have been made possible as we know it today. Opposed to this, the weapons industry produces economic-national-social harm, and worse than that, harm is done that comes at the cost of human life. From this, the aspiration of the planning does not propose an unequivocal solution regarding the moral question, but it certainly contains the existing morality.

Through proposing programs that are contrary to one another, the planning contains the moral duality. In such a way, these two opposing worlds exist in harmony under one roof. The proposed programs are a prayer hall — a religious center, as opposed to a dance club — an entertainment center. The way in which the programs will be able to coexist is by means of the planning of the building, such that it will allow efficient interchange between the programs and efficient use of the space by means of the planning of the interface points between the two programs. Finally, the opposing dual proposal is not obligatory in the planning, but it does emphasize how a building can bear upon itself maximal efficiency that is essential in our times. Today, at this point in time, we cannot morally allow building that will not be utilized properly from an environmental standpoint, or alternatively, one that will not know how to try to adapt itself to the problems of the future.

After dealing with the social side, the environmental problem remained and how to cope with it. The planning proposes to turn the entire area into a green park, and to rehabilitate the soil by means of trees that have the ability to cope with polluted soil: willow and poplar trees; plants such as sunflowers, alfalfa, and corn have the ability to grow in harsh conditions, and at the same time help the soil to recover in a natural way without mechanical or industrial intervention such as aeration of the soil and chemical pest control. This proposal also contributes directly to the community by providing extensive green areas for the benefit of the city, and also considers the environment and what is the most efficient way to deal with these problems.

In summary, the planning proposes an almost complete preservation of the existing building and its conversion into a living community center, while adding floors that support this transition. All of this takes place alongside the rehabilitation of the soil in a manner as ecological and moral as possible.

Guided by Ifat Finkelman and Deborah Pinto Fdeda.`,
        slides: seq('assets/projects/pray-and-play/slides/', 69, 'webp'),
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
            'CNC_machine.webp', 'Cnc_Example.webp', 'Code_Image.webp',
            'Code_modol_1x1.webp', 'Code_modol_2x5.webp', 'Conect_In_The_Air.webp',
            'Connectors-02.webp', 'Cross_Detail.webp', 'Full_Section.webp',
            'Hand_Mockup.webp', 'Section_View.webp',
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
        model: 'assets/projects/cloud-to-ground/models/Pavilion Model.glb',
        images: imgs('assets/projects/cloud-to-ground/gallery/', [
            'cast.webp', 'mold_draft.webp', 'mold_01.webp', 'mold_02.webp', 'mold_03.webp',
            'tile_sample.webp', 'tile_sample_01.webp', 'iso_gardem_F0.webp', 'iso_gardem_F1.webp',
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

Email     ndellus3@gmail.com

Location  Vienna, Austria

Open for research collaborations,
teaching, and design work.`,
    },
    cv: {
        title: 'CV — Nir Dellus',
        body: `NIR DELLUS — CURRICULUM VITAE


CONTACT

Location       Vienna
Email          ndellus3@gmail.com
Date of Birth  24/10/1996


PROFESSIONAL EXPERIENCE

2024–Present   Derman Verbakel Architects
               Research & Design

2023–2025      Bezalel Architecture Department
               Teaching Assistant — Digital Tools, 2nd & 3rd Year

2022–2023      Israeli Pavilion
               Venice Architecture Biennale
               Research & Prototype

2021           Sabio Levy Architects
               Concept Development

2019           Carpentry
               Furniture and Set Design Constructions

2014–2015      Volunteer Year, Tarbut (Culture) Movement


EDUCATION

2019–2024      Bezalel Academy of Arts and Design
               B.Arch.

2023 (Fall)    Exchange Studies
               Aarhus School of Architecture

2011–2013      Ankori High School, Rishon LeZion
               High School Diploma


LANGUAGES

Hebrew         Native
English        Fluent
German         A1 — actively learning


SOFTWARE

CAD/3D         AutoCAD, BricsCAD, Rhino, Grasshopper,
               Blender, Revit, ArchiCAD
Other          Adobe Suite, Microsoft Office`,
    },
};
