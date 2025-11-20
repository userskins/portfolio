
import poster1 from '@assets/generated_images/acid_graphics_poster_1.png';
import poster2 from '@assets/generated_images/acid_graphics_poster_2.png';
import poster3 from '@assets/generated_images/acid_graphics_poster_3.png';
import userRef from '@assets/image_1763675755958.png';

export interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  year: string;
  size: 'small' | 'medium' | 'large';
}

export const projects: Project[] = [
  {
    id: '01',
    title: 'NEON GENESIS',
    category: 'Art Direction',
    image: poster1,
    year: '2024',
    size: 'large',
  },
  {
    id: '02',
    title: 'RED SHIFT',
    category: 'Typography',
    image: poster2,
    year: '2023',
    size: 'medium',
  },
  {
    id: '03',
    title: 'CHROME LIQUID',
    category: '3D Motion',
    image: poster3,
    year: '2024',
    size: 'medium',
  },
  {
    id: '04',
    title: 'ARCHIVE V1',
    category: 'Curation',
    image: userRef,
    year: '2022',
    size: 'large',
  },
];

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string[];
}

export const experiences: Experience[] = [
  {
    company: 'VK Амбассадоры',
    role: 'Дизайн-лид',
    period: 'Сентябрь 2023 — Сейчас',
    description: [
      'Управление командой дизайнеров',
      'Разработка дизайна презентаций для бизнеса и продуктов',
      'Генерация идей и образов художественных решений',
      'Разработка рекламных материалов для соцсетей',
      'Организация редизайна и ребрендинга продукции',
      'Координация промо-акций и PR-мероприятий'
    ]
  },
  {
    company: 'Простор и Студия Простора',
    role: 'Дизайнер',
    period: 'Июнь 2025 — Сейчас',
    description: [
      'Разработка дизайна рекламных материалов',
      'Исследование дизайнерских решений конкурентов',
      'Разработка дизайна email-рассылок и презентаций',
      'Создание продающего контента'
    ]
  },
  {
    company: 'Школа дизайна НИУ ВШЭ',
    role: 'Ассистент менеджера\nпо CRM-маркетингу',
    period: 'Март 2025 — Сейчас',
    description: [
      'Разработка дизайна и верстка email-рассылок',
      'Сбор и анализ обратной связи клиентов',
      'Анализ эффективности маркетинговых кампаний'
    ]
  }
];

export const skills = {
  advanced: [
    'Adobe Photoshop', 'Figma', 'Tilda', 'Graphic Design', 
    'Email Design', 'Machine Learning', 'ChatGPT', 'Presentations'
  ],
  intermediate: [
    'Adobe Illustrator', 'After Effects', 'WordPress', 
    'Branding', 'Management', 'English'
  ],
  basic: ['Adobe InDesign']
};

export const education = [
  {
    university: 'ННГУ им. Н.И. Лобачевского',
    degree: 'Инженерия программного обеспечения, Бакалавр',
    year: '2027'
  },
  {
    university: 'Высшая школа искусств и дизайна ННГУ им. Н.И. Лобачевского',
    degree: 'Дизайн и креативное предпринимательство',
    year: '2024'
  }
];

export const aboutText = "Творческий человек, для которого дизайн — не просто работа, а способ самовыражения. Постоянно развиваю вкус и визуальное мышление, люблю экспериментировать с цветом, формой и движением. Вдохновляюсь искусством, музыкой и технологиями. В свободное время создаю авторские визуалы и анимации — просто потому, что не могу не творить.";
