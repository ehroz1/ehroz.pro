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
  yandex: '', // Яндекс Вебмастер → Мета-тег → yandex-verification
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
  email: 'ehrozbekisharifzoda@gmail.com',
  instagram: 'ehroz1',
  github: 'ehroz1',
  behance: 'ehroz1',
  /** «Заказать сайт» — лендинг услуг. */
  order: 'https://dsgn.ehroz.web.picta.cc',
};

const S = {
  'meta.title': { ru: 'Ehroz — небольшие инструменты, которые экономят время', en: 'Ehroz — small tools that save time' },
  'meta.description': {
    ru: 'Приложения и инструменты Ehroz для macOS, Windows и веба: Morfus, Morfu, Pachaq, Sukhan, BLA-БЛА, Picta и radius.',
    en: 'Apps and tools by Ehroz for macOS, Windows and the web: Morfus, Morfu, Pachaq, Sukhan, BLA-БЛА, Picta and radius.',
  },
  'hero.eyebrow': { ru: 'дизайнер и разработчик · Астана', en: 'designer & developer · Astana' },
  'hero.title1': { ru: 'Ehroz.', en: 'Ehroz.' },
  'hero.title2': { ru: 'Небольшие инструменты,', en: 'Small tools' },
  'hero.title3': { ru: 'которые экономят время.', en: 'that save time.' },
  'hero.lead': {
    ru: 'Конвертеры, сжатие, субтитры, расшифровка и поиск картинок. Делаю приложения, которыми пользуюсь сам каждый день, — для macOS, Windows и браузера.',
    en: 'Converters, compression, captions, transcription and image search. I build the apps I use every day — for macOS, Windows and the browser.',
  },
  'hero.cta': { ru: 'Смотреть приложения', en: 'See the apps' },
  'hero.contact': { ru: 'Написать мне', en: 'Get in touch' },
  'hero.spotlight': { ru: 'Поиск', en: 'Search' },
  'apps.title': { ru: 'Приложения', en: 'Apps' },
  'apps.lead': { ru: 'Всё, что сейчас лежит у меня в Dock.', en: 'Everything that lives in my Dock right now.' },
  'apps.open': { ru: 'Подробнее', en: 'Learn more' },
  'about.title': { ru: 'Кто делает', en: 'Who makes these' },
  'about.text': {
    ru: 'Я Эхроз — дизайнер и разработчик из Астаны. Собираю небольшие приложения, которые убирают рутину: конвертация, сжатие, субтитры, поиск. Делаю сайты и инструменты под задачи бизнеса.',
    en: 'I’m Ehroz — a designer and developer from Astana. I make small apps that remove busywork: converting, compressing, captions, search. I also build websites and tools for businesses.',
  },
  'contact.title': { ru: 'Нужен сайт или инструмент?', en: 'Need a website or a tool?' },
  'contact.lead': { ru: 'Напишите в Telegram — отвечаю быстро.', en: 'Message me on Telegram — I reply fast.' },
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
  'menu.search': { ru: 'Поиск приложений (⌘K)', en: 'Search apps (⌘K)' },
  'menu.motion': { ru: 'Анимации', en: 'Animations' },
  'motion.auto': { ru: 'Анимации вкл.', en: 'Animations on' },
  'motion.off': { ru: 'Без анимаций', en: 'No animations' },
  'theme.auto': { ru: 'Как в системе', en: 'System' },
  'theme.dark': { ru: 'Тёмная', en: 'Dark' },
  'theme.light': { ru: 'Светлая', en: 'Light' },
  'spot.placeholder': { ru: 'Поиск приложений', en: 'Search apps' },
  'spot.empty': { ru: 'Ничего не нашлось', en: 'Nothing found' },
  'spot.apps': { ru: 'Приложения', en: 'Apps' },
  'spot.actions': { ru: 'Действия', en: 'Actions' },
  'spot.hint': { ru: '↑↓ выбрать · ↵ открыть · esc закрыть', en: '↑↓ select · ↵ open · esc close' },
  'about.mac.title': { ru: 'Об Ehroz', en: 'About Ehroz' },
  'about.mac.chip': { ru: 'Процессор', en: 'Chip' },
  'about.mac.chipv': { ru: 'Кофе M∞ Max', en: 'Coffee M∞ Max' },
  'about.mac.mem': { ru: 'Память', en: 'Memory' },
  'about.mac.memv': { ru: '7 приложений в Dock', en: '7 apps in the Dock' },
  'about.mac.disk': { ru: 'Загрузочный диск', en: 'Startup disk' },
  'about.mac.diskv': { ru: 'Идеи, 99% занято', en: 'Ideas, 99% full' },
  'about.mac.os': { ru: 'Система', en: 'macOS' },
  'about.mac.osv': { ru: 'Астана, UTC+5', en: 'Astana, UTC+5' },
  'about.mac.more': { ru: 'Подробнее…', en: 'More Info…' },
  'about.mac.egg': { ru: 'Пасхалка: Konami-код или двойной щелчок по логотипу.', en: 'Easter egg: the Konami code or double-click the logo.' },
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
    ru: 'Как связаться с Эхрозом: Telegram, email, GitHub, Instagram и Behance. Заказ сайта или инструмента, вопросы по приложениям.',
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
