# Стандарт новой страницы ehroz.pro

Один документ со всеми правилами: техническое SEO, индексация, метаданные, микроразметка, нейросети,
UX, доступность, безопасность и аналитика. Новая страница считается готовой, когда выполнены все пункты
чек-листа в конце и проходит `npm run check:seo`.

Подробности и причины решений: `DEPLOY.md` (домен, редиректы, поисковые системы) и `SEO.md` (что сделано по сайту).

---

## 1. Два типа страниц

**Новое приложение.** Ничего не верстайте вручную: добавьте объект в `src/content/apps.ts` (см. README).
Страницы RU/EN, метаданные, OG-обложка, микроразметка, FAQ, хлебные крошки, sitemap, llms.txt, Dock, поиск
и ссылки из подвала появятся сами. Обязательно заполните `updated: 'ГГГГ-ММ-ДД'`.

**Обычная страница** (как «Об Ehroz», «Контакты»). Компонент в `src/components/`, две тонкие обёртки
`src/pages/<slug>/index.astro` и `src/pages/en/<slug>/index.astro`. Шаблон — в разделе 10.

## 2. Адрес (URL)

- Нижний регистр, латиница, слова через дефис: `/order-website/`. Без пробелов, `_`, параметров и `.html`.
- Всегда со слешем в конце. Ссылки внутри сайта — только через `path(lang, slug)`, не вручную.
- Русская версия — `/<slug>/`, английская — `/en/<slug>/`. У каждой страницы есть обе.
- Глубина — не больше 3 кликов от главной. Сейчас всё в 1–2 кликах.
- Адрес не меняется после публикации. Если пришлось сменить — 301 в `vercel.json` (`redirects`) для обоих языков.
- Удалили страницу — 301 на ближайшую по смыслу (или на главную); если замены нет, адрес отдаст 404.

## 3. Метаданные (передаются в `<Layout>`)

| Что | Правило |
|---|---|
| `title` | Уникальный, ≤ 60 символов, суть в начале. Формат: «Тема — уточнение · Ehroz» (бренд — если влезает). |
| `description` | Уникальный, 50–160 символов, своими словами о содержании. Длинный текст — через `clip()`. |
| `lang`, `slug` | Обязательны: из них строятся canonical, hreflang (ru, en, x-default) и переключатель языка. |
| `og`, `ogAlt` | Обложка 1200×630 и её подпись. Своя обложка, если страница важная; иначе `og/<lang>/home.png`. |
| `updated` | Дата последнего изменения текста `ГГГГ-ММ-ДД`. Меняйте при каждой правке текста, не при правке вёрстки. |
| `jsonld` | Граф микроразметки (раздел 5). |
| `noindex` | Только для технических, тестовых и черновых страниц — тогда не будет canonical и hreflang. |

Canonical, hreflang, Open Graph, Twitter Card, favicon, `robots`, название сайта — Layout ставит сам. Не дублируйте их.

## 4. Структура контента

- **Ровно один `<h1>`**, он первый заголовок на странице. Дальше `h2 → h3` без пропусков уровней.
  Нужен крупный текст без смысла заголовка — используйте `<p>` с классом, не `<h2>`.
- Первый абзац под h1 — суть страницы в 1–2 предложениях (так её понимают и люди, и нейросети).
- Одна страница — одна тема. Не делайте почти одинаковые страницы под разные запросы.
- Конкретика: цифры, версии, платформы, даты, ограничения. Термины — с пояснением.
- Названия продуктов, бренда и автора — как в `apps.ts` и `i18n.ts` (`SITE_NAME`, `CONTACTS`), без вариаций.
- Ссылки на первоисточники — где есть факты не из вашего опыта.
- Таблица — где нужно сравнить. FAQ — в конце, если есть реальные вопросы.
- Видимые **хлебные крошки** (`nav.crumbs`, последний пункт с `aria-current="page"`) и, для материалов,
  видимые автор и дата обновления (`<time datetime="…">`).
- Весь текст — в HTML при сборке. Не подгружайте контент скриптом и не прячьте его до клика.

## 5. Микроразметка (JSON-LD)

Только через `src/lib/schema.ts`, одним графом на страницу:

```ts
const jsonld = graph(
  webpage({ site, lang, url, type: 'WebPage', name: title, description, updated,
            image: ogUrl, imageAlt: title, breadcrumb: true }),
  breadcrumbs(site, url, crumbs),   // те же пункты, что видны на странице
  website(site),
  person(site, lang),
);
```

- Тип страницы: `WebPage`, `CollectionPage` (списки), `AboutPage`/`ProfilePage`, `ContactPage`.
- Размечайте только то, что видно на странице. Без выдуманных рейтингов, отзывов, цен.
- FAQ в разметке = FAQ в тексте дословно (`faq()`).
- Новый тип контента (статья, видео, событие) — добавьте функцию в `schema.ts`, не вставляйте JSON вручную.
  Для статей обязательно: автор (`person`), `datePublished`, `dateModified`.
- После деплоя — проверить страницу в validator.schema.org и Rich Results Test.

## 6. Ссылки и навигация

- На новую страницу должна вести ссылка хотя бы с одной существующей страницы (обычно — подвал
  `Footer.astro`, раздел «ehroz.pro»). Страница без входящих ссылок = ошибка `check:seo`.
- Со страницы — ссылки на связанные страницы (как «Другие приложения»).
- Внешние ссылки: `target="_blank" rel="noopener"`; на свои профили — `rel="noopener me"`.
- Никаких автоматических редиректов (по языку, по времени), попапов, рекламы, таймеров и ложных уведомлений.

## 7. UX и доступность

- Картинки — с `width`/`height` (без скачков вёрстки) и `alt`; декоративные — `alt=""` (`AppIcon decorative`).
- Кнопки — `<button>`, переходы — `<a href>`. Видимый фокус не отключать.
- У каждого `<nav>` уникальный `aria-label`. Иконки без текста — с `aria-label`.
- Контраст текста ≥ 4.5:1 в светлой и тёмной теме (используйте цвета-переменные `--text`, `--text-2`, `--muted`).
- Анимации: уважайте `prefers-reduced-motion` и `html[data-motion='reduce']` (переключатель «Без анимаций»).
  В JS: `matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'reduce'`.
- Проверить на ширине 375 px: без горизонтальной прокрутки, кнопки не меньше 40 px по высоте.

## 8. Безопасность

- Скрипты — только через `<script>` в компонентах Astro (собираются в файлы) или `is:inline` для мелочей:
  хеши inline-скриптов CSP посчитает при сборке сама (`src/lib/csp.ts`).
- Нельзя: `onclick="…"` и другие обработчики в атрибутах, `eval`, `new Function`, скрипты со сторонних
  доменов. Нужен сторонний сервис — добавьте его домен в `src/lib/csp.ts`.
- `innerHTML` — только с вашими строками, никогда с текстом из URL или от пользователя.
- В коде нет секретов и ключей API (кроме публичных по смыслу, как IndexNow).
- Появится форма — нужна защита от спама и ограничение частоты запросов на стороне сервера.

## 9. Аналитика

- Ничего не подключайте напрямую: счётчики грузятся только после согласия (`src/scripts/analytics.ts`).
- Целевые кнопки размечайте `data-kind`: `download`, `releases`, `open`, `contact` — события посчитаются сами.
  Telegram, email, «Заказать сайт», внешние ссылки, поиск, прокрутка, 404 и ошибки отслеживаются автоматически.
- Новая цель — добавьте `track('имя_события', { … })` в `analytics.ts` и опишите её в `SEO.md`.

## 10. Шаблон обычной страницы

`src/components/ExamplePage.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import type { Lang } from '../content/apps';
import { tr, path, asset, clip, SITE_NAME } from '../i18n';
import { graph, webpage, breadcrumbs, website, person } from '../lib/schema';
import Footer from './Footer.astro';

interface Props { lang: Lang }
const { lang } = Astro.props;
const ru = lang === 'ru';
const SLUG = 'example';            // нижний регистр, через дефис
const UPDATED = '2026-10-30';      // дата изменения текста

const site = Astro.site!;
const url = new URL(path(lang, SLUG), site).href;
const title = ru ? 'Тема страницы — уточнение · Ehroz' : 'Page topic — detail · Ehroz';   // ≤ 60
const h1 = ru ? 'Тема страницы' : 'Page topic';
const description = clip(ru ? 'Суть страницы своими словами…' : 'What the page is about…'); // 50–160
const og = `og/${lang}/home.png`;
const crumbs = [
  { name: SITE_NAME, url: path(lang) },
  { name: h1, url: path(lang, SLUG) },
];
const jsonld = graph(
  webpage({ site, lang, url, name: title, description, updated: UPDATED, breadcrumb: true,
            image: new URL(asset(og), site).href, imageAlt: title }),
  breadcrumbs(site, url, crumbs),
  website(site),
  person(site, lang),
);
---
<Layout lang={lang} title={title} description={description} slug={SLUG} og={og} ogAlt={title} updated={UPDATED} jsonld={jsonld}>
  <section class="container" aria-labelledby="page-h1" data-spy={h1}>
    <div class="sec-bar">
      <nav class="crumbs" aria-label={ru ? 'Навигационная цепочка' : 'Breadcrumb'}>
        <ol>
          <li><a href={path(lang)}>{SITE_NAME}</a></li>
          <li><span aria-current="page">{h1}</span></li>
        </ol>
      </nav>
    </div>
    <h1 class="display" id="page-h1">{h1}</h1>
    <p class="lead">{/* суть в 1–2 предложениях */}</p>
    <h2 class="h3">{/* раздел */}</h2>
    <p>Обновлено: <time datetime={UPDATED}>{UPDATED}</time></p>
  </section>
  <Footer lang={lang} />
</Layout>
```

`src/pages/example/index.astro` и `src/pages/en/example/index.astro`:

```astro
---
import ExamplePage from '../../components/ExamplePage.astro';   // для en/ — '../../../components/…'
---
<ExamplePage lang="ru" />
```

Стили хлебных крошек `.crumbs` — скопируйте из `AboutPage.astro`. Тексты длиннее пары слов — в `src/i18n.ts`.
Затем добавьте ссылку на страницу в `Footer.astro`; если она важна для нейросетей — в `src/pages/llms.txt.ts`.

## 11. Чек-лист перед публикацией

- [ ] URL: нижний регистр, дефисы, слеш в конце; есть RU и EN.
- [ ] Уникальные `title` (≤ 60) и `description` (50–160), передан `updated`.
- [ ] Один h1 первым, уровни заголовков без пропусков, суть — в первом абзаце.
- [ ] Видимые хлебные крошки; автор и дата — для материалов.
- [ ] Микроразметка через `schema.ts`, только видимые данные.
- [ ] На страницу ведёт ссылка с сайта; со страницы — ссылки на связанные.
- [ ] Картинки с размерами и `alt`; `nav` с уникальными подписями; работает с клавиатуры.
- [ ] Нет inline-обработчиков и сторонних скриптов без правки CSP.
- [ ] Целевые кнопки размечены `data-kind`.
- [ ] Техническая страница — `noindex`.
- [ ] `npm run build && npm run check:seo` — без ошибок; `npx astro check` — 0 ошибок.
- [ ] Превью Vercel проверено на телефоне и компьютере, в светлой и тёмной теме, без ошибок в консоли.
- [ ] Сменили или удалили адрес — добавлен 301 в `vercel.json`.
