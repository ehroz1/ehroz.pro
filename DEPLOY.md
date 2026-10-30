# Публикация ehroz.pro

Сайт — статический (Astro): `npm run build` собирает всё в папку `dist/`. Подойдёт любой хостинг.

## Как вносить правки и ничего не сломать

Продакшн: **https://ehroz.pro** (Vercel, ветка `main`). Каждый merge в `main` обновляет сайт за 1–2 минуты.

1. Создайте ветку от `main` (например `fix-hero-text`) и внесите правки.
2. Перед пушем: `npm run build && npm run check:seo` — сборка и проверка битых ссылок, canonical, title/description.
3. Запушьте ветку — Vercel сам соберёт **Preview** на отдельном адресе (`*.vercel.app`), `ehroz.pro` он не трогает.
4. Проверьте preview (телефон + компьютер), откройте Pull Request в `main`.
5. Красная сборка в PR = не мержить. Всё хорошо — Merge.

Откат: Vercel → Deployments → прошлый рабочий деплой → **Promote to Production**.

Не трогайте без нужды: `vercel.json`, `astro.config.mjs`, DNS на Porkbun, домены в Vercel.

## Техническое SEO — как устроено

- **Основной адрес:** `https://ehroz.pro/` — https, без www, со слешем в конце (`/morfus/`).
  Задан в `PRODUCTION_ORIGIN` (`src/i18n.ts`) и `vercel.json`.
- **Редиректы (vercel.json):** HTTP → HTTPS делает сам Vercel; `www.ehroz.pro` → `ehroz.pro` (301);
  `/morfus` → `/morfus/` (308, тоже постоянный); `/index.html`, `/x.html` → чистый адрес; `/ru/...` → `/...`.
- **Индексация:** открыт только `ehroz.pro`. Зеркало на GitHub Pages и адреса `*.vercel.app` получают
  `noindex` (meta + заголовок `X-Robots-Tag`), robots.txt на зеркале закрывает всё. Страница 404 — `noindex`, без canonical.
- **Canonical и hreflang** (ru/en/x-default) — на каждой странице, в `src/layouts/Layout.astro`.
  Параметры в адресе (`?utm_source=…`) не создают дублей: canonical всегда без них.
- **Черновик/служебная страница:** передайте в `<Layout … noindex>` — страница закроется и уйдёт из canonical.
  Чтобы убрать её из sitemap, добавьте адрес в `filter` в `astro.config.mjs`.
- **Сменили адрес страницы:** добавьте в `redirects` в `vercel.json`
  `{ "source": "/old-slug/", "destination": "/new-slug/", "statusCode": 301 }` (и для `/en/old-slug/`).
- **Удалили приложение насовсем:** уберите его из `src/content/apps.ts` и поставьте 301 на ближайшую страницу
  (или на `/`). Если замены нет — адрес отдаст 404 со списком приложений. Ответ 410 на статическом хостинге
  требует Vercel Middleware; заводите его, только если удалённых адресов станет много.

## Индексация и метаданные

- **robots.txt** (`src/pages/robots.txt.ts`) — всё открыто, указан адрес sitemap. Важно: robots.txt запрещает
  только *обход*, а не попадание в индекс. Чтобы убрать страницу из поиска, нужен `noindex` (см. выше),
  и обход ей при этом **не** закрывать — иначе робот не увидит noindex.
- **Sitemap** (`/sitemap-index.xml`) собирается при каждой сборке: добавили или удалили приложение — sitemap
  обновится сам. В нём только канонические страницы со статусом 200, hreflang ru/en/x-default, иконки приложений.
  Делить на несколько файлов по типам не нужно: это имеет смысл от тысяч адресов, у нас их 24.
- **lastmod** — реальная дата изменения текста, а не дата сборки. Поменяли тексты приложения —
  обновите `updated` у него в `src/content/apps.ts`; поменяли главную — `HOME_UPDATED` там же.
- **Метаданные** генерируются из `apps.ts`: title «Приложение — описание · Ehroz», description из текста
  «о приложении» (обрезается по слову до 160 символов), своя OG-обложка 1200×630 на каждую страницу и язык,
  Twitter Card, schema.org (WebSite + Person на главной, SoftwareApplication на страницах приложений).
- **Проверка** `npm run check:seo` ловит: битые ссылки, повторы title/description, длину, порядок заголовков
  (один h1, первым, без скачков h2→h4), OG/Twitter, страницы-сироты, глубину больше 3 кликов, расхождения
  sitemap со страницами, отсутствие lastmod.

## Поисковые системы (сделать один раз вручную)

Проще всего подтверждать права через **DNS** (запись TXT у регистратора, Porkbun): так подтверждается
весь домен, включая www и http. Если удобнее мета-тег — вставьте код в `SEARCH_VERIFICATION` в `src/i18n.ts`.

1. **Google Search Console** — search.google.com/search-console → *Добавить ресурс* → **Доменный ресурс**
   `ehroz.pro` → TXT-запись в DNS. Затем *Файлы Sitemap* → `https://ehroz.pro/sitemap-index.xml`.
2. **Яндекс Вебмастер** — webmaster.yandex.ru → *Добавить сайт* `https://ehroz.pro` → DNS или мета-тег.
   Затем *Индексирование → Файлы Sitemap* → тот же адрес. В *Настройки индексирования → Главное зеркало*
   должно быть `https://ehroz.pro`.
3. **Bing Webmaster Tools** — bing.com/webmasters → *Import from Google Search Console* (подтянет права и
   sitemap сам) или добавить вручную.

Что смотреть дальше (раз в 1–2 недели):

- **Страницы / Индексирование** — сколько страниц в индексе; исключённые страницы и причины.
- **Удобство на мобильных / Core Web Vitals** — проблемы мобильной версии.
- **Эффективность (Google) / Поисковые запросы (Яндекс)** — запросы, показы, клики, CTR.
- Включите уведомления на почту: в Search Console они по умолчанию, в Вебмастере — *Настройки уведомлений*.

Автоматически:

- **IndexNow** (`.github/workflows/indexnow.yml`) — после каждого продакшн-деплоя на Vercel сообщает Яндексу
  и Bing об изменённых страницах (по `lastmod` за 3 дня). Вручную: Actions → IndexNow → Run workflow.
  Ключ — файл `public/5a72b9009b4053c1a7ca861d41a86cac.txt`, не удаляйте его.
- **SEO monitor** (`.github/workflows/seo-monitor.yml`) — каждый понедельник проверяет живой сайт:
  robots.txt, sitemap, статус 200, noindex, canonical, редиректы и что страниц в sitemap не меньше 20.
  Если что-то не так, GitHub пришлёт письмо. Вручную: `node scripts/monitor-seo.mjs`.

## Сейчас: GitHub Pages (бесплатный адрес)

Workflow `.github/workflows/deploy.yml` при каждом пуше в `main` (и в рабочую ветку) собирает сайт и
кладёт его в ветку `gh-pages`. Адрес: **https://ehroz1.github.io/ehroz.pro/**

Если сайт по этому адресу не открывается — один раз включите Pages:
GitHub → репозиторий `ehroz.pro` → **Settings → Pages → Build and deployment → Source: Deploy from a
branch → Branch: `gh-pages` / `(root)` → Save**.

## Vercel (рекомендуется для домена ehroz.pro)

Одна команда из папки проекта (попросит войти в Vercel через браузер):

```bash
npx vercel --prod
```

Или без терминала: vercel.com → **Add New → Project → Import** репозиторий `ehroz1/ehroz.pro` → Deploy.
Настройки уже лежат в `vercel.json`, переменные окружения не нужны. Автодеплой из `main` включается сам
при импорте из GitHub.

### Домен ehroz.pro на Vercel

1. Vercel → проект → **Settings → Domains → Add** → `ehroz.pro` и `www.ehroz.pro`.
2. У регистратора домена (DNS):
   - `A` запись для `@` → `76.76.21.21`
   - `CNAME` для `www` → `cname.vercel-dns.com`
3. Через 5–30 минут Vercel сам выпустит HTTPS-сертификат.

## Cloudflare Pages (альтернатива)

dash.cloudflare.com → **Workers & Pages → Create → Pages → Connect to Git** → `ehroz1/ehroz.pro`:

- Framework preset: **Astro**
- Build command: `npm run build`
- Build output directory: `dist`
- Переменная окружения: `NODE_VERSION = 22`

Домен: **Custom domains → Set up a custom domain → ehroz.pro**. Если домен уже в Cloudflare — записи
создадутся сами; если нет — перенесите NS-серверы домена на Cloudflare. Заголовки кэша — в `public/_headers`.

## Домен на GitHub Pages (если остаётесь на Pages)

1. Settings → Secrets and variables → Actions → **Variables**: `SITE_URL = https://ehroz.pro`,
   `SITE_BASE = /`, `PAGES_CNAME = ehroz.pro`.
2. DNS у регистратора: `A` для `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`,
   `185.199.111.153`; `CNAME` для `www` → `ehroz1.github.io`.
3. Settings → Pages → Custom domain: `ehroz.pro`, включить **Enforce HTTPS**.
4. Перезапустить workflow (Actions → Deploy to GitHub Pages → Run workflow).

## Локально

```bash
npm ci
npm run dev       # http://localhost:4321
npm run build     # сборка в dist/
npm run preview   # посмотреть сборку
```
