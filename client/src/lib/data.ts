
import poster1 from '@assets/generated_images/acid_graphics_poster_1.png';
import poster2 from '@assets/generated_images/acid_graphics_poster_2.png';
import poster3 from '@assets/generated_images/acid_graphics_poster_3.png';
import userRef from '@assets/image_1763675755958.png';

import gallery1 from '@assets/gallery/1.webp';
import gallery2 from '@assets/gallery/2.webp';
import gallery3 from '@assets/gallery/3.webp';
import gallery4 from '@assets/gallery/4.webp';
import gallery5 from '@assets/gallery/5.webp';
import gallery6 from '@assets/gallery/6.webp';
import gallery7 from '@assets/gallery/7.webp';
import gallery8 from '@assets/gallery/8.webp';
import gallery9 from '@assets/gallery/9.webp';
import gallery10 from '@assets/gallery/10.webp';
import gallery11 from '@assets/gallery/11.webp';
import gallery12 from '@assets/gallery/12.webp';
import gallery13 from '@assets/gallery/13.webp';
import gallery14 from '@assets/gallery/14.webp';
import gallery15 from '@assets/gallery/15.webp';
import gallery16 from '@assets/gallery/16.webp';
import gallery17 from '@assets/gallery/17.webp';
import gallery18 from '@assets/gallery/18.webp';
import gallery19 from '@assets/gallery/19.webp';
import gallery20 from '@assets/gallery/20.webp';

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

export interface GalleryImage {
  id: number;
  src: string;
}

export const galleryImages: GalleryImage[] = [
  { id: 1, src: gallery1 },
  { id: 2, src: gallery2 },
  { id: 3, src: gallery3 },
  { id: 4, src: gallery4 },
  { id: 5, src: gallery5 },
  { id: 6, src: gallery6 },
  { id: 7, src: gallery7 },
  { id: 8, src: gallery8 },
  { id: 9, src: gallery9 },
  { id: 10, src: gallery10 },
  { id: 11, src: gallery11 },
  { id: 12, src: gallery12 },
  { id: 13, src: gallery13 },
  { id: 14, src: gallery14 },
  { id: 15, src: gallery15 },
  { id: 16, src: gallery16 },
  { id: 17, src: gallery17 },
  { id: 18, src: gallery18 },
  { id: 19, src: gallery19 },
  { id: 20, src: gallery20 },
];

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string[];
}

export const experiences: Experience[] = [
  {
    company: 'Амбассадоры VK',
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
    company: 'Песочница VK Education (ex. dreamlab)',
    role: 'Куратор направления "Продвижение цифрового продукта"',
    period: 'Август 2024 — Апрель 2025',
    description: [
      'Управление командой дизайнеров',
      'Разработка рекламных материалов для соцсетей',
      'Курирование занятий обучающего трека',
      'Проведение мастер-классов (в том числе по дизайну в Figma)'
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
    university: 'Высшая школа искусств и дизайна (ННГУ им. Н.И. Лобачевского)',
    degree: 'Дизайн и креативное предпринимательство',
    year: '2024'
  },
  {
    university: 'ННГУ им. Н.И. Лобачевского',
    degree: 'Инженерия программного обеспечения, Бакалавр',
    year: '2027'
  }
];

export const aboutText = "Творческий человек, для которого дизайн — не просто работа, а способ самовыражения. Постоянно развиваю вкус и визуальное мышление, люблю экспериментировать с цветом, формой и движением. Вдохновляюсь искусством, музыкой и технологиями. В свободное время создаю авторские визуалы и анимации — просто потому, что не могу не творить.";
