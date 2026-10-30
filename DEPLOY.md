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
