/**
 * Микроразметка schema.org (JSON-LD). Каждая страница отдаёт один связанный граф (@graph):
 * сущности ссылаются друг на друга через @id, поэтому сайт и автор описаны один раз и не противоречат друг другу.
 *
 * Правила: только то, что видно на странице; без выдуманных рейтингов и отзывов; dateModified — реальная дата
 * изменения текста (поле updated в apps.ts).
 */
import type { App, Lang } from '../content/apps';
import { homeUpdated } from '../content/apps';
import { CONTACTS, PLATFORM, SITE_NAME, path, pick, asset } from '../i18n';

type Node = Record<string, unknown>;

export function schemaIds(site: URL) {
  const root = new URL(path('ru'), site).href;
  return {
    website: `${root}#website`,
    person: `${root}#person`,
  };
}

const abs = (site: URL, p: string) => new URL(p, site).href;
const inLang = (lang: Lang) => (lang === 'ru' ? 'ru-RU' : 'en-US');

export function sameAs() {
  const c = CONTACTS;
  return [
    `https://t.me/${c.telegram}`,
    `https://github.com/${c.github}`,
    `https://instagram.com/${c.instagram}`,
    `https://www.behance.net/${c.behance}`,
  ];
}

/** Сайт: один на оба языка. */
export function website(site: URL): Node {
  const ids = schemaIds(site);
  return {
    '@type': 'WebSite',
    '@id': ids.website,
    name: SITE_NAME,
    alternateName: ['Эхроз', 'ehroz.pro', 'EHROZ'],
    url: abs(site, path('ru')),
    inLanguage: ['ru-RU', 'en-US'],
    publisher: { '@id': ids.person },
    author: { '@id': ids.person },
  };
}

/** Автор и владелец сайта. Организации нет — приложения делает один человек. */
export function person(site: URL, lang: Lang): Node {
  const ids = schemaIds(site);
  const c = CONTACTS;
  return {
    '@type': 'Person',
    '@id': ids.person,
    name: pick(lang, c.name),
    alternateName: lang === 'ru' ? ['Ehroz', 'EHROZ'] : ['Эхроз', 'EHROZ'],
    jobTitle: lang === 'ru' ? 'Дизайнер и разработчик' : 'Designer & Developer',
    url: abs(site, path(lang, 'about')),
    email: `mailto:${c.email}`,
    address: { '@type': 'PostalAddress', addressLocality: pick(lang, c.city), addressCountry: 'KZ' },
    knowsAbout: lang === 'ru'
      ? ['Дизайн интерфейсов', 'Разработка приложений для macOS', 'Веб-разработка']
      : ['Interface design', 'macOS app development', 'Web development'],
    sameAs: sameAs(),
  };
}

export interface Crumb {
  name: string;
  url: string;
}

export function breadcrumbs(site: URL, url: string, crumbs: Crumb[]): Node {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(site, c.url) })),
  };
}

interface PageOpts {
  site: URL;
  lang: Lang;
  url: string;
  type?: 'WebPage' | 'CollectionPage' | 'AboutPage' | 'ContactPage' | 'ProfilePage';
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  updated: string;
  breadcrumb?: boolean;
  about?: string;
  mainEntity?: string;
}

/** Страница: заголовок, описание, язык, обложка, дата изменения, автор. */
export function webpage(o: PageOpts): Node {
  const ids = schemaIds(o.site);
  return {
    '@type': o.type ?? 'WebPage',
    '@id': `${o.url}#webpage`,
    url: o.url,
    name: o.name,
    description: o.description,
    inLanguage: inLang(o.lang),
    isPartOf: { '@id': ids.website },
    author: { '@id': ids.person },
    dateModified: o.updated,
    primaryImageOfPage: {
      '@type': 'ImageObject',
      '@id': `${o.url}#primaryimage`,
      url: o.image,
      contentUrl: o.image,
      width: 1200,
      height: 630,
      caption: o.imageAlt,
    },
    ...(o.breadcrumb ? { breadcrumb: { '@id': `${o.url}#breadcrumb` } } : {}),
    ...(o.about ? { about: { '@id': o.about } } : {}),
    ...(o.mainEntity ? { mainEntity: { '@id': o.mainEntity } } : {}),
  };
}

/** Приложение. Цена 0 — только у вышедших бесплатных приложений (на их страницах это написано). */
export function application(site: URL, lang: Lang, app: App, url: string): Node {
  const ids = schemaIds(site);
  const icon = abs(site, asset(`icons/${app.slug}-512.png`));
  return {
    '@type': app.platforms.includes('web') ? 'WebApplication' : 'SoftwareApplication',
    '@id': `${url}#app`,
    name: app.name,
    description: pick(lang, app.about),
    url,
    inLanguage: inLang(lang),
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: app.platforms.map((p) => PLATFORM[p].en).join(', '),
    ...(app.version ? { softwareVersion: app.version } : {}),
    image: { '@type': 'ImageObject', url: icon, contentUrl: icon, width: 512, height: 512, caption: app.name },
    author: { '@id': ids.person },
    publisher: { '@id': ids.person },
    dateModified: app.updated,
    featureList: app.features.map((f) => pick(lang, f.title)),
    ...(app.status === 'ready' ? { offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' } } : {}),
    ...(app.links[0] && app.status === 'ready' ? { downloadUrl: app.links[0].href } : {}),
  };
}

/** FAQ — те же вопросы и ответы, что видны на странице. */
export function faq(url: string, lang: Lang, app: App): Node {
  return {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    url,
    inLanguage: inLang(lang),
    mainEntity: app.faq.map((q) => ({
      '@type': 'Question',
      name: pick(lang, q.q),
      acceptedAnswer: { '@type': 'Answer', text: pick(lang, q.a) },
    })),
  };
}

/** Список приложений на главной (виден как каталог). */
export function appList(site: URL, lang: Lang, apps: App[], url: string): Node {
  return {
    '@type': 'ItemList',
    '@id': `${url}#apps`,
    name: lang === 'ru' ? 'Приложения Ehroz' : 'Apps by Ehroz',
    numberOfItems: apps.length,
    itemListElement: apps.map((a, i) => ({ '@type': 'ListItem', position: i + 1, name: a.name, url: abs(site, path(lang, a.slug)) })),
  };
}

/** Услуга с пакетами. Цены — ровно те, что видны на странице («от»). */
export interface ServicePackage { name: string; price: number; description: string }
export function service(site: URL, lang: Lang, url: string, o: { name: string; description: string; area: string; packages: ServicePackage[]; id?: string; type?: string }): Node {
  const ids = schemaIds(site);
  return {
    '@type': 'Service',
    '@id': `${url}#${o.id ?? 'service'}`,
    name: o.name,
    description: o.description,
    serviceType: o.type ?? (lang === 'ru' ? 'Разработка сайтов' : 'Website development'),
    url,
    inLanguage: inLang(lang),
    provider: { '@id': ids.person },
    areaServed: { '@type': 'City', name: o.area },
    offers: o.packages.map((p) => ({
      '@type': 'Offer',
      name: p.name,
      description: p.description,
      priceSpecification: { '@type': 'PriceSpecification', minPrice: p.price, priceCurrency: 'USD' },
    })),
  };
}

/** FAQ обычной страницы — те же вопросы и ответы, что видны в тексте. */
export function faqList(url: string, lang: Lang, items: { q: string; a: string }[]): Node {
  return {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    url,
    inLanguage: inLang(lang),
    mainEntity: items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
  };
}

export const graph = (...nodes: Node[]) => ({ '@context': 'https://schema.org', '@graph': nodes });

export { homeUpdated };
