export const translations = {
  en: {
    nav: {
      cv: 'CV',
      gallery: 'GALLERY',
      projects: 'PROJECTS',
      about: 'ABOUT',
      contact: 'CONTACT',
    },
    hero: {
      greeting: 'HELLO MY NAME IS',
      firstName: 'DMITRIY',
      lastName: 'GUSEV',
    },
    gallery: {
      title: 'Gallery',
    },
    projects: {
      title: 'Projects',
    },
    aboutSection: {
      title: 'About Me',
      connectTitle: 'Let\'s Connect',
      email: 'Email',
      telegram: 'Telegram',
      vk: 'VK',
    },
  },
  ru: {
    nav: {
      cv: 'РЕЗЮМЕ',
      gallery: 'ГАЛЕРЕЯ',
      projects: 'ПРОЕКТЫ',
      about: 'ОБО МНЕ',
      contact: 'КОНТАКТ',
    },
    hero: {
      greeting: 'ПРИВЕТ, МЕНЯ ЗОВУТ',
      firstName: 'ДМИТРИЙ',
      lastName: 'ГУСЕВ',
    },
    gallery: {
      title: 'Галерея',
    },
    projects: {
      title: 'Проекты',
    },
    aboutSection: {
      title: 'Обо мне',
      connectTitle: 'Давайте свяжемся',
      email: 'Почта',
      telegram: 'Телеграм',
      vk: 'ВК',
    },
  },
};

export function t(path: string, language: 'en' | 'ru'): string {
  const keys = path.split('.');
  let value: any = translations[language];
  
  for (const key of keys) {
    value = value?.[key];
  }
  
  return value || path;
}
