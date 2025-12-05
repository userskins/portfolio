import userRef from '@assets/logo.webp';

import gallery1 from '@assets/gallery/1.webp';
import gallery5 from '@assets/gallery/5.webp';
import gallery6 from '@assets/gallery/6.webp';
import gallery7 from '@assets/gallery/7.webp';
import gallery8 from '@assets/gallery/8.webp';
import gallery9 from '@assets/gallery/9.webp';
import gallery10 from '@assets/gallery/10.webp';
import gallery11 from '@assets/gallery/11.webp';
import gallery12 from '@assets/gallery/12.webp';
import gallery13 from '@assets/gallery/13.webp';
import gallery15 from '@assets/gallery/15.webp';
import gallery17 from '@assets/gallery/17.webp';
import gallery18 from '@assets/gallery/18.webp';
import gallery19 from '@assets/gallery/19.webp';
import gallery20 from '@assets/gallery/20.webp';
import gallery21 from '@assets/gallery/21.webp';
import gallery22 from '@assets/gallery/22.webp';
import gallery23 from '@assets/gallery/23.webp';
import gallery24 from '@assets/gallery/24.webp';
import gallery25 from '@assets/gallery/25.webp';
import gallery26 from '@assets/gallery/26.webp';
import gallery27 from '@assets/gallery/27.webp';
import gallery28 from '@assets/gallery/28.webp';
import gallery29 from '@assets/gallery/29.webp';
import gallery30 from '@assets/gallery/30.webp';
import gallery31 from '@assets/gallery/31.webp';
import gallery32 from '@assets/gallery/32.webp';
import gallery33 from '@assets/gallery/33.webp';
import gallery34 from '@assets/gallery/34.webp';
import gallery35 from '@assets/gallery/35.webp';
import gallery36 from '@assets/gallery/36.webp';
import gallery37 from '@assets/gallery/37.webp';
import gallery38 from '@assets/gallery/38.webp';
import gallery39 from '@assets/gallery/39.webp';
import gallery40 from '@assets/gallery/40.webp';
import gallery61 from '@assets/gallery/61.webp';
import gallery62 from '@assets/gallery/62.webp';
import gallery63 from '@assets/gallery/63.webp';
import gallery64 from '@assets/gallery/64.webp';
import gallery65 from '@assets/gallery/65.webp';
import gallery66 from '@assets/gallery/66.webp';
import gallery67 from '@assets/gallery/67.webp';
import gallery68 from '@assets/gallery/68.webp';
import gallery69 from '@assets/gallery/69.webp';
import gallery70 from '@assets/gallery/70.webp';
import gallery71 from '@assets/gallery/71.webp';
import gallery72 from '@assets/gallery/72.webp';
import gallery73 from '@assets/gallery/73.webp';
import gallery74 from '@assets/gallery/74.webp';
import gallery75 from '@assets/gallery/75.webp';
import gallery76 from '@assets/gallery/76.webp';
import gallery77 from '@assets/gallery/77.webp';
import gallery78 from '@assets/gallery/78.webp';
import gallery79 from '@assets/gallery/79.webp';
import gallery80 from '@assets/gallery/80.webp';
import gallery81 from '@assets/gallery/81.webp';
import gallery82 from '@assets/gallery/82.webp';
import gallery83 from '@assets/gallery/83.webp';
import gallery84 from '@assets/gallery/84.webp';
import gallery85 from '@assets/gallery/85.webp';
import gallery86 from '@assets/gallery/86.webp';
import gallery87 from '@assets/gallery/87.webp';
import gallery88 from '@assets/gallery/88.webp';
import gallery89 from '@assets/gallery/89.webp';
import gallery90 from '@assets/gallery/90.webp';
import gallery91 from '@assets/gallery/91.webp';
import gallery92 from '@assets/gallery/92.webp';

export interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  year: string;
  size: 'small' | 'medium' | 'large';
  tag: 'design' | 'animation' | 'email' | 'websites';
  url?: string;
}

export const projects: Project[] = [
  {
    id: '07',
    title: '9 лет ИИТММ',
    category: 'Дизайнер',
    image: userRef,
    year: '2024-2025',
    size: 'large',
    tag: 'design',
    url: 'https://www.figma.com/proto/VA2U2Y2Q14OndOwQEDxu8Z/%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D1%8B-%D0%B4%D0%BB%D1%8F-%D0%BF%D0%BE%D1%80%D1%82%D1%84%D0%BE%D0%BB%D0%B8%D0%BE--%D0%A7%D0%B0%D1%81%D1%82%D1%8C-2-?page-id=24%3A2&node-id=24-3&viewport=469%2C136%2C0.13&t=FIiTMUUf6a95JRcO-1&scaling=scale-down-width&content-scaling=fixed',
  },
  {
    id: '07b',
    title: '10 лет ИИТММ',
    category: 'Дизайнер',
    image: userRef,
    year: '2024-2025',
    size: 'large',
    tag: 'design',
    url: 'https://www.figma.com/proto/tjBCvGh0UoF67tPc721yvt/%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D1%8B-%D0%B4%D0%BB%D1%8F-%D0%BF%D0%BE%D1%80%D1%82%D1%84%D0%BE%D0%BB%D0%B8%D0%BE--%D0%A7%D0%B0%D1%81%D1%82%D1%8C-1-?page-id=0%3A1&node-id=16-146&viewport=486%2C28%2C0.11&t=uUxSHlWFcTia7SB3-1&scaling=scale-down-width&content-scaling=fixed',
  },
  {
    id: '11',
    title: 'Онбординг креатора от Студии Простора',
    category: 'Дизайн и вёрстка email-рассылки',
    image: userRef,
    year: '2025',
    size: 'small',
    tag: 'email',
    url: 'https://app.emailmaker.ru/email/1583930/raw?key=519cfb50b4e0b1028767a317a095a855',
  },
  {
    id: '13',
    title: 'Профессии от МЦ МФО',
    category: 'Дизайн и вёрстка email-рассылки',
    image: userRef,
    year: '2025',
    size: 'small',
    tag: 'email',
    url: 'https://app.emailmaker.ru/email/1602326/raw?key=b9d977f6a3c4d971896b9ad88fc3b501',
  },
  {
    id: '14',
    title: 'Дайджест новостей Школы дизайна НИУ ВШЭ',
    category: 'Дизайн и вёрстка email-рассылки',
    image: userRef,
    year: '2025',
    size: 'small',
    tag: 'email',
    url: 'https://app.emailmaker.ru/email/1602333/raw?key=8d847fcb21aff222a212c1c92a0c4823',
  },
  {
    id: '21',
    title: 'Знакомство с платформой mediiia',
    category: 'Вёрстка рассылки',
    image: userRef,
    year: '2025',
    size: 'small',
    tag: 'email',
    url: 'https://app.emailmaker.ru/email/1602329/raw?key=260f32eb62ae102b372f6eba5975dabc',
  },
  {
    id: '17',
    title: 'День победы в Сириусе',
    category: 'Дизайн и вёрстка сайта',
    image: userRef,
    year: '2025',
    size: 'large',
    tag: 'websites',
    url: 'https://9may.sirius.ru',
  },
  {
    id: '18',
    title: 'The Russian Symphony',
    category: 'Дизайн и вёрстка сайта',
    image: userRef,
    year: '2025',
    size: 'large',
    tag: 'websites',
    url: 'https://russianstars-concert.ru/',
  },
  {
    id: '19',
    title: 'Sirius Talent Summit',
    category: 'Дизайн и вёрстка сайта',
    image: userRef,
    year: '2025',
    size: 'large',
    tag: 'websites',
    url: 'https://uae.sirius.ru/',
  },
  {
    id: '06',
    title: 'Где себя играем не мы',
    category: 'Дизайн-лид',
    image: userRef,
    year: '2024',
    size: 'large',
    tag: 'design',
    url: 'https://www.figma.com/design/tjBCvGh0UoF67tPc721yvt/%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D1%8B-%D0%B4%D0%BB%D1%8F-%D0%BF%D0%BE%D1%80%D1%82%D1%84%D0%BE%D0%BB%D0%B8%D0%BE?node-id=3-3',
  },
  {
    id: '08',
    title: 'Мы в медиа',
    category: 'Дизайнер',
    image: userRef,
    year: '2024',
    size: 'large',
    tag: 'design',
    url: 'https://www.figma.com/design/VA2U2Y2Q14OndOwQEDxu8Z/%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D1%8B-%D0%B4%D0%BB%D1%8F-%D0%BF%D0%BE%D1%80%D1%82%D1%84%D0%BE%D0%BB%D0%B8%D0%BE--%D0%9B%D0%B8%D1%87%D0%BD%D1%8B%D0%B5-?node-id=0-1',
  },
  {
    id: '12',
    title: 'Полезный кейс от Ingate',
    category: 'Дизайн и вёрстка email-рассылки',
    image: userRef,
    year: '2024',
    size: 'small',
    tag: 'email',
    url: 'https://app.emailmaker.ru/email/1602315/raw?key=7726617c95100ceb998dde138fcfd151',
  },
  {
    id: '16',
    title: 'Астрологическое Бюро Пунита Нахаты',
    category: 'Вёрстка email-рассылки',
    image: userRef,
    year: '2024',
    size: 'small',
    tag: 'email',
    url: 'https://app.emailmaker.ru/email/1602323/raw?key=a6ac142e672625327d1d691875957f2e',
  },
  {
    id: '20',
    title: 'Новогодний музыкальный фестиваль «Сириус»',
    category: 'Дизайн и вёрстка сайта',
    image: userRef,
    year: '2024',
    size: 'large',
    tag: 'websites',
    url: 'https://nyfestival.parksirius.ru/',
  },
  {
    id: '05',
    title: 'С закрытыми глазами',
    category: 'Дизайнер',
    image: userRef,
    year: '2023',
    size: 'large',
    tag: 'design',
    url: 'https://www.figma.com/design/tjBCvGh0UoF67tPc721yvt/%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D1%8B-%D0%B4%D0%BB%D1%8F-%D0%BF%D0%BE%D1%80%D1%82%D1%84%D0%BE%D0%BB%D0%B8%D0%BE?node-id=3-2',
  },
  {
    id: '04',
    title: 'Josef Muller-Brockmann animation',
    category: 'Анимация постеров',
    image: userRef,
    year: '2023',
    size: 'large',
    tag: 'animation',
    url: 'https://disk.yandex.ru/i/ZpSR2Or-qZJI-w',
  },
  {
    id: '09',
    title: 'Frankly, My Dear',
    category: 'Дизайн и вёрстка сайта',
    image: userRef,
    year: '2023',
    size: 'large',
    tag: 'websites',
    url: 'https://franklymydear.ie',
  },
  {
    id: '10',
    title: 'Best of Ireland Awards',
    category: 'Дизайн и вёрстка сайта',
    image: userRef,
    year: '2023',
    size: 'large',
    tag: 'websites',
    url: 'https://bestofirelandawards.ie',
  },
  {
    id: '03',
    title: 'Adrian Ghenie E-book',
    category: 'Создание анимации электронной книги',
    image: userRef,
    year: '2022',
    size: 'large',
    tag: 'animation',
    url: 'https://disk.yandex.ru/i/UraQKNqJCH7EjQ',
  },
  {
    id: '02',
    title: 'Denis Juneau exhibition',
    category: 'Анимация приглашения на выставку',
    image: userRef,
    year: '2021',
    size: 'large',
    tag: 'animation',
    url: 'https://disk.yandex.ru/i/ZpSR2Or-qZJI-w',
  },
  {
    id: '01',
    title: 'twenty øne piløts artbook',
    category: 'Создание иллюстраций',
    image: userRef,
    year: '2021',
    size: 'large',
    tag: 'design',
    url: 'https://www.figma.com/design/VA2U2Y2Q14OndOwQEDxu8Z/%D0%9F%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D1%8B-%D0%B4%D0%BB%D1%8F-%D0%BF%D0%BE%D1%80%D1%82%D1%84%D0%BE%D0%BB%D0%B8%D0%BE--%D0%9B%D0%B8%D1%87%D0%BD%D1%8B%D0%B5-?node-id=1-2&t=7sPoHRwivyPx69oK-1',
  },
];

export interface GalleryImage {
  id: number;
  src: string;
}

export const galleryImages: GalleryImage[] = [
  { id: 1, src: gallery1 },
  { id: 5, src: gallery5 },
  { id: 6, src: gallery6 },
  { id: 7, src: gallery7 },
  { id: 8, src: gallery8 },
  { id: 9, src: gallery9 },
  { id: 10, src: gallery10 },
  { id: 11, src: gallery11 },
  { id: 12, src: gallery12 },
  { id: 13, src: gallery13 },
  { id: 15, src: gallery15 },
  { id: 17, src: gallery17 },
  { id: 18, src: gallery18 },
  { id: 19, src: gallery19 },
  { id: 20, src: gallery20 },
  { id: 21, src: gallery21 },
  { id: 22, src: gallery22 },
  { id: 23, src: gallery23 },
  { id: 24, src: gallery24 },
  { id: 25, src: gallery25 },
  { id: 26, src: gallery26 },
  { id: 27, src: gallery27 },
  { id: 28, src: gallery28 },
  { id: 29, src: gallery29 },
  { id: 30, src: gallery30 },
  { id: 31, src: gallery31 },
  { id: 32, src: gallery32 },
  { id: 33, src: gallery33 },
  { id: 34, src: gallery34 },
  { id: 35, src: gallery35 },
  { id: 36, src: gallery36 },
  { id: 37, src: gallery37 },
  { id: 38, src: gallery38 },
  { id: 39, src: gallery39 },
  { id: 40, src: gallery40 },
  { id: 61, src: gallery61 },
  { id: 62, src: gallery62 },
  { id: 63, src: gallery63 },
  { id: 64, src: gallery64 },
  { id: 65, src: gallery65 },
  { id: 66, src: gallery66 },
  { id: 67, src: gallery67 },
  { id: 68, src: gallery68 },
  { id: 69, src: gallery69 },
  { id: 70, src: gallery70 },
  { id: 71, src: gallery71 },
  { id: 72, src: gallery72 },
  { id: 73, src: gallery73 },
  { id: 74, src: gallery74 },
  { id: 75, src: gallery75 },
  { id: 76, src: gallery76 },
  { id: 77, src: gallery77 },
  { id: 78, src: gallery78 },
  { id: 79, src: gallery79 },
  { id: 80, src: gallery80 },
  { id: 81, src: gallery81 },
  { id: 82, src: gallery82 },
  { id: 83, src: gallery83 },
  { id: 84, src: gallery84 },
  { id: 85, src: gallery85 },
  { id: 86, src: gallery86 },
  { id: 87, src: gallery87 },
  { id: 88, src: gallery88 },
  { id: 89, src: gallery89 },
  { id: 90, src: gallery90 },
  { id: 91, src: gallery91 },
  { id: 92, src: gallery92 },
];

// Shuffle gallery images on initialization
let shuffledImages = [...galleryImages];
for (let i = shuffledImages.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [shuffledImages[i], shuffledImages[j]] = [shuffledImages[j], shuffledImages[i]];
}

export const shuffledGalleryImages = shuffledImages;

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
    'Email Design', 'Machine Learning', 'ChatGPT', 'Presentations', 'Nano Banana', 'Midjourney'
  ],
  intermediate: [
    'Adobe Illustrator', 'After Effects', 'WordPress', 
    'Branding', 'Management', 'English', 'Motion design', 'Animation'
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
