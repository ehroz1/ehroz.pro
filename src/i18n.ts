import type { Lang, L, Platform, Status } from './content/apps';

export const LANGS: Lang[] = ['ru', 'en'];

/** Основной домен: https, без www, со слешем в конце адресов. Только он открыт для индексации. */
export const PRODUCTION_ORIGIN = 'https://ehroz.pro';

/** Название сайта/бренда в метаданных (og:site_name, application-name, schema.org WebSite). */
export const SITE_NAME = 'Ehroz';

/**
 * Коды подтверждения прав в панелях вебмастеров (только сам код из content="…").
 * Удобнее подтверждать через DNS — тогда здесь ничего не нужно. См. DEPLOY.md → «Поисковые системы».
 */
export const SEARCH_VERIFICATION = {
  google: '', // Google Search Console → HTML-тег → google-site-verification
  yandex: '6a8b554db1ca875b', // Яндекс Вебмастер → Мета-тег → yandex-verification
  bing: '', // Bing Webmaster Tools → HTML Meta Tag → msvalidate.01
};

/** Обрезает текст для meta description по границе слова (по умолчанию до 160 символов). */
export function clip(text: string, max = 160): string {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:—–-]+$/, '') + '…';
}

/** Контакты — правьте здесь. */
export const CONTACTS = {
  name: { ru: 'Эхроз', en: 'Ehroz' } as L,
  role: 'designer & developer',
  city: { ru: 'Астана', en: 'Astana' } as L,
  telegram: 'hhrrzz1',
  /** Телефон для WhatsApp и Telegram (только цифры, с кодом страны). */
  phone: '77775971798',
  email: 'ehrozbekisharifzoda@gmail.com',
  instagram: 'ehroz1',
  github: 'ehroz1',
  behance: 'ehroz',
  /** «Заказать сайт» — лендинг услуг. */
  order: 'https://dsgn.ehroz.web.picta.cc',
};

const S = {
  'meta.title': { ru: 'Ehroz: приложения для Mac, Windows и браузера', en: 'Ehroz: apps for Mac, Windows and the browser' },
  'meta.description': {
    ru: 'Эхроз, дизайнер из Астаны, пишет программы под свои задачи и выкладывает их здесь. Morfus конвертирует файлы прямо из перетаскивания, Sukhan делает субтитры к видео.',
    en: 'Ehroz is a designer from Astana who writes software for everyday work and shares it here. Morfus converts files mid-drag, Sukhan makes captions for video.',
  },
  'hero.eyebrow': { ru: 'дизайнер и разработчик · Астана', en: 'designer & developer · Astana' },
  'hero.title1': { ru: 'Ehroz.', en: 'Ehroz.' },
  'hero.title': {
    ru: 'Я дизайнер из Астаны и пишу программы, когда готовые не справляются',
    en: 'I’m a designer in Astana, and I write software when the existing tools fall short',
  },
  'hero.lead': {
    ru: 'Morfus появился, потому что надоело открывать онлайн-конвертер ради одного файла. Sukhan вырос из субтитров, которые я расставлял вручную. Здесь собрано всё, что получилось из таких поводов. Часть программ уже можно скачать, остальные я ещё дописываю.',
    en: 'Morfus started because I was tired of opening an online converter for a single file. Sukhan grew out of captions I used to place by hand. Everything that came out of moments like these is collected here. Some of it is ready to download, the rest I’m still finishing.',
  },
  'hero.cta': { ru: 'Смотреть приложения', en: 'See the apps' },
  'hero.contact': { ru: 'Написать мне', en: 'Get in touch' },
  'apps.title': { ru: 'Приложения', en: 'Apps' },
  'apps.lead': { ru: 'Всё, что сейчас лежит у меня в Dock.', en: 'Everything that lives in my Dock right now.' },
  'apps.open': { ru: 'Подробнее', en: 'Learn more' },
  'about.title': { ru: 'Кто я', en: 'About me' },
  'about.text': {
    ru: 'Меня зовут Эхроз, я живу в Астане. Начинал с графического дизайна, потом стал сам программировать то, чего не хватало в работе. Сейчас делаю и свои приложения, и сайты на заказ.',
    en: 'My name is Ehroz and I live in Astana. I started in graphic design, then began coding the things my work was missing. Now I make my own apps and build websites for clients.',
  },
  'contact.title': { ru: 'Нужен сайт или инструмент?', en: 'Need a website or a tool?' },
  'contact.lead': {
    ru: 'Опишите в Telegram, что нужно сделать и к какому сроку. Если задача мне не подходит, так и скажу.',
    en: 'Tell me on Telegram what you need and by when. If it’s not a good fit for me, I’ll say so.',
  },
  'contact.order': { ru: 'Заказать сайт', en: 'Order a website' },
  'contact.badge': { ru: 'Контакты', en: 'Contacts' },
  'cc.title': { ru: 'Связаться', en: 'Contact' },
  'cc.copy': { ru: 'Скопировать', en: 'Copy' },
  'cc.copied': { ru: 'Скопировано', en: 'Copied' },
  'menu.apps': { ru: 'Приложения', en: 'Apps' },
  'menu.about': { ru: 'Об Ehroz', en: 'About Ehroz' },
  'menu.home': { ru: 'Главная', en: 'Home' },
  'menu.theme': { ru: 'Тема', en: 'Theme' },
  'menu.lang': { ru: 'Language: English', en: 'Язык: русский' },
  'about.mac.title': { ru: 'Об Ehroz', en: 'About Ehroz' },
  'about.mac.chip': { ru: 'Занимаюсь', en: 'Work' },
  'about.mac.chipv': { ru: 'Дизайн и разработка', en: 'Design and development' },
  'about.mac.mem': { ru: 'Пишу для', en: 'Platforms' },
  'about.mac.memv': { ru: 'macOS, Windows, браузер', en: 'macOS, Windows, browser' },
  'about.mac.disk': { ru: 'Связь', en: 'Contact' },
  'about.mac.diskv': { ru: 'Telegram @hhrrzz1', en: 'Telegram @hhrrzz1' },
  'about.mac.os': { ru: 'Город', en: 'City' },
  'about.mac.osv': { ru: 'Астана, UTC+5', en: 'Astana, UTC+5' },
  'about.mac.more': { ru: 'Подробнее…', en: 'More Info…' },
  'about.mac.egg': { ru: 'Пасхалка: Konami-код или двойной щелчок по логотипу — запускает космический шутер.', en: 'Easter egg: the Konami code or double-click the logo launches a space shooter.' },
  'page.features': { ru: 'Что умеет', en: 'What it does' },
  'page.how': { ru: 'Как это работает', en: 'How it works' },
  'page.faq': { ru: 'Вопросы', en: 'FAQ' },
  'page.req': { ru: 'Требования', en: 'Requirements' },
  'page.for': { ru: 'Для кого', en: 'Who it’s for' },
  'page.other': { ru: 'Другие приложения', en: 'Other apps' },
  'page.version': { ru: 'Версия', en: 'Version' },
  'page.back': { ru: 'Все приложения', en: 'All apps' },
  'page.source': { ru: 'Открытый код', en: 'Open source' },
  'page.demo': { ru: 'Демонстрация интерфейса', en: 'Interface demo' },
  'page.step': { ru: 'Шаг', en: 'Step' },
  'foot.egg': { ru: 'Секрет: введи код или нажми — и разнеси этот сайт', en: 'Secret: enter the code or tap — and blow this site up' },
  'foot.egg.btn': { ru: 'Играть', en: 'Play' },
  'foot.made': { ru: 'Сделано в Астане. Без cookies и трекеров.', en: 'Made in Astana. No cookies, no trackers.' },
  'foot.consent': { ru: 'Сделано в Астане. Аналитика — только с вашего согласия.', en: 'Made in Astana. Analytics only with your consent.' },
  'foot.cookies': { ru: 'Настройки cookies', en: 'Cookie settings' },
  'nf.title': { ru: 'Такого окна нет', en: 'No such window' },
  'nf.text': { ru: 'Похоже, ссылка устарела. Загляните в Dock.', en: 'Looks like the link is outdated. Check the Dock.' },
  'nf.apps': { ru: 'Все приложения', en: 'All apps' },
  'nf.home': { ru: 'На главную', en: 'Home' },
  'about.page.title': { ru: 'Об Ehroz — дизайнер и разработчик из Астаны', en: 'About Ehroz — designer & developer from Astana' },
  'about.page.desc': {
    ru: 'Эхроз — дизайнер и разработчик из Астаны. Делает небольшие приложения для macOS, Windows и браузера и сайты под задачи бизнеса.',
    en: 'Ehroz is a designer and developer from Astana who makes small apps for macOS, Windows and the browser, and websites for businesses.',
  },
  'about.page.h1': { ru: 'Об Ehroz', en: 'About Ehroz' },
  'about.page.facts': { ru: 'Коротко', en: 'In short' },
  'about.page.apps': { ru: 'Что я сделал', en: 'What I’ve made' },
  'about.page.profiles': { ru: 'Где меня найти', en: 'Where to find me' },
  'about.page.how': { ru: 'Как я работаю', en: 'How I work' },
  'about.page.how1': {
    ru: 'Делаю то, чем пользуюсь сам: каждое приложение начиналось с моей рутинной задачи.',
    en: 'I build what I use myself: every app started as a chore of my own.',
  },
  'about.page.how2': {
    ru: 'Дизайн и код — сам, от иконки до релиза. Исходники части проектов открыты на GitHub.',
    en: 'Design and code are mine, from the icon to the release. Some projects are open source on GitHub.',
  },
  'about.page.how3': {
    ru: 'Сайт без cookies и трекеров по умолчанию: статистика включается только с вашего согласия.',
    en: 'The site has no cookies or trackers by default: analytics only runs with your consent.',
  },
  'contacts.page.title': { ru: 'Контакты — связаться с Ehroz', en: 'Contacts — get in touch with Ehroz' },
  'contacts.page.desc': {
    ru: 'Как связаться с Эхрозом: Telegram, почта, GitHub, Instagram и Behance. Можно заказать сайт или спросить про приложения.',
    en: 'How to reach Ehroz: Telegram, email, GitHub, Instagram and Behance. Order a website or a tool, or ask about the apps.',
  },
  'contacts.page.h1': { ru: 'Контакты', en: 'Contacts' },
  'contacts.page.fast': { ru: 'Быстрее всего — Telegram', en: 'Fastest: Telegram' },
  'contacts.page.write': { ru: 'Написать', en: 'Message' },
  'contacts.page.where': { ru: 'Где я', en: 'Where I am' },
  'contacts.page.apps': {
    ru: 'Вопрос по приложению? Укажите его название и версию — так отвечу точнее.',
    en: 'A question about an app? Mention its name and version so I can answer precisely.',
  },
  'skip': { ru: 'Перейти к содержимому', en: 'Skip to content' },
} satisfies Record<string, L>;

export type Key = keyof typeof S;
export const tr = (lang: Lang, key: Key) => S[key][lang];
export const pick = (lang: Lang, v: L) => v[lang];

export const PLATFORM: Record<Platform, L> = {
  macos: { ru: 'macOS', en: 'macOS' },
  windows: { ru: 'Windows', en: 'Windows' },
  web: { ru: 'Веб', en: 'Web' },
  extension: { ru: 'Расширение', en: 'Extension' },
};

export const STATUS: Record<Status, L> = {
  ready: { ru: 'Готово', en: 'Available' },
  beta: { ru: 'Скоро релиз', en: 'Coming soon' },
  dev: { ru: 'В разработке', en: 'In development' },
};

/** Ссылка с учётом base и языка: path('en', 'morfus') → /en/morfus/ */
export function path(lang: Lang, slug = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const parts = [lang === 'en' ? 'en' : '', slug].filter(Boolean).join('/');
  return `${base}/${parts}${parts ? '/' : ''}`;
}

export const asset = (p: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${p.replace(/^\//, '')}`;
