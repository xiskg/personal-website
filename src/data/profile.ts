// Conteúdo do site. Estrutura pré-definida pensada para o futuro CMS:
// cada tipo abaixo vira uma collection (projects, process, experience…).

export const profile = {
  name: 'João de Almeida',
  shortName: 'dealmeida',
  role: 'Senior Brand & Visual Designer',
  location: 'Brazil',
  email: 'joaoadriano.psd@gmail.com',
  linkedin: 'https://www.linkedin.com/in/jojoao/',
  languages: ['Portuguese — native', 'English — fluent', 'Spanish — basic'],
};

// Projetos agora vêm do "CMS": content/projects.csv → src/data/projects.ts

export interface ProcessStep {
  num: string;
  name: string;
  title: string;
  description: string;
  skills: string[];
  metric: { value: number; prefix?: string; suffix?: string; label: string };
}

export const processSteps: ProcessStep[] = [
  {
    num: '01',
    name: 'Listen',
    title: 'Research & discovery',
    description:
      'Every brand starts with ears, not pencils. Stakeholder workshops, user research and competitor teardowns — until the real problem is sitting on the table, in plain sight.',
    skills: ['Brand Workshops', 'User Research', 'Competitor Analysis'],
    metric: { value: 15, suffix: '+', label: 'brands researched across the US & LATAM' },
  },
  {
    num: '02',
    name: 'Position',
    title: 'Strategy & architecture',
    description:
      'Strategy before style. I map the brand architecture, define the go-to-market angle and write the narrative that the visuals will have to prove.',
    skills: ['Brand Architecture', 'Go-to-Market', 'Brand Strategy'],
    metric: { value: 40, prefix: '+', suffix: '%', label: 'qualified leads on a flagship campaign' },
  },
  {
    num: '03',
    name: 'Draw',
    title: 'Identity & system',
    description:
      'The fun part — and the most accountable one. Identity systems designed to flex across products, channels and teams without losing their soul.',
    skills: ['Art Direction', 'Advanced Typography', 'Visual Systems', 'Iconography'],
    metric: { value: 25, suffix: '+', label: 'identities shipped end to end' },
  },
  {
    num: '04',
    name: 'Ship',
    title: 'Guidelines & scale',
    description:
      'A brand only works if the whole team can hold the pencil. Guidelines, launch support and mentoring — until the system survives without me in the room.',
    skills: ['Brand Guidelines', 'Launch Support', 'Mentoring'],
    metric: { value: 98, suffix: '%', label: 'client satisfaction rate' },
  },
];

export interface TimelineEntry {
  period: string;
  title: string;
  org: string;
  description: string;
  current?: boolean;
}

export const experience: TimelineEntry[] = [
  {
    period: '2023 — present',
    title: 'Senior Brand Designer',
    org: 'DotBrands',
    description:
      'Leading a 4-designer team through a complete brand architecture overhaul — 8 product lines unified under one scalable visual system. Site redesign drove +22% conversion.',
    current: true,
  },
  {
    period: '2022 — 2023',
    title: 'Brand Designer',
    org: 'Nexus Creative Studio',
    description:
      '15+ full identities for tech and luxury clients across the US and LATAM, averaging +60% social engagement after launch.',
  },
  {
    period: '2021 — 2022',
    title: 'Graphic Designer',
    org: '_mybrief',
    description:
      '550+ static and video assets for 12 tech clients. Rigorous A/B testing lifted average campaign engagement by 50%.',
  },
  {
    period: '2020',
    title: 'Graphic Design for Print & Web',
    org: 'Humber College, Toronto',
    description: 'Graduated top 5% of the class, specialization in Advanced Typography.',
  },
];
