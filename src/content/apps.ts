/**
 * Все продукты витрины — в одном месте.
 * Новое приложение: скопируйте любой объект ниже, поменяйте поля, положите иконку
 * в assets-src/icons/<slug>.png и выполните `npm run icons`.
 * Сцены (поле `scene`) — компоненты из src/components/scenes; для нового приложения
 * можно взять 'generic', он рисует подпись фичи на фоне акцентного цвета.
 */

import type { InstallKind } from './install';

export type Lang = 'ru' | 'en';
export type L = { ru: string; en: string };
export type Platform = 'macos' | 'windows' | 'web' | 'extension';
export type Status = 'ready' | 'beta' | 'dev';

export interface Feature {
  title: L;
  text: L;
  /** id сцены из src/components/scenes/index.ts */
  scene: string;
}

export interface AppLink {
  kind: 'download' | 'open' | 'github' | 'releases' | 'contact';
  href: string;
  label: L;
  /** Имя файла в последнем релизе GitHub (когда в нём есть версия). При сборке href заменяется
   *  на прямую ссылку на этот файл — см. src/lib/downloads.ts. */
  asset?: RegExp;
  /** Инструкция первого запуска: после нажатия на ссылку откроется окно (см. src/content/install.ts). */
  install?: InstallKind;
}

export interface App {
  slug: string;
  name: string;
  /** Короткая фраза для карточки и Dock. */
  short: L;
  /** Слоган на странице приложения. */
  tagline: L;
  /** Абзац «что это и для кого». */
  about: L;
  audience: L;
  platforms: Platform[];
  status: Status;
  /** Дата последнего изменения содержимого страницы (YYYY-MM-DD). Обновляйте при правке текстов —
   *  попадает в sitemap (lastmod) и в разметку schema.org (dateModified). */
  updated: string;
  version?: string;
  /** Цвет кнопок и подсветки на странице. */
  accent: string;
  /** Цвет текста на кнопке с акцентом. */
  onAccent: string;
  /** Три цвета из иконки или интерфейса (OG-картинки). */
  glow: [string, string, string];
  /** Цвет изделия в каталоге: ярлык номера, кромка, подписи. dark — для тёмной темы, light — для светлой. */
  tint: { dark: string; light: string };
  /** Короткая категория для шапки карточки (моноширинная подпись). */
  kind: L;
  links: AppLink[];
  features: Feature[];
  steps: [L, L, L];
  faq: { q: L; a: L }[];
  requirements: L[];
  /** Исходный код открыт? */
  openSource?: boolean;
}

const t = (ru: string, en: string): L => ({ ru, en });

export const apps: App[] = [
  {
    slug: 'morfus',
    name: 'Morfus',
    short: t('Радиальный конвертер файлов для macOS', 'Radial file converter for macOS'),
    tagline: t('Зажми файл, нажми клавишу — брось в нужный сектор.', 'Grab a file, press a key, drop it on a sector.'),
    about: t(
      'Morfus открывает круглое меню прямо вокруг курсора, пока вы тащите файл. Конвертация, сжатие и инструменты для фото, видео, аудио, PDF, SVG, документов и архивов — всё локально на Mac, результат появляется рядом с исходником.',
      'Morfus opens a round menu right around your cursor while you drag a file. Convert, compress and tools for photos, video, audio, PDF, SVG, documents and archives — all local on your Mac, with the result saved next to the original.',
    ),
    audience: t('Дизайнерам, монтажёрам, SMM и всем, кто каждый день гоняет файлы между форматами.', 'Designers, editors, social media teams — anyone who shuffles files between formats every day.'),
    platforms: ['macos'],
    status: 'ready',
    updated: '2026-10-27',
    version: '0.2.3',
    accent: '#f5f5f7',
    onAccent: '#1d1d1f',
    glow: ['#5b4a9c', '#2b6f8c', '#9c4a6b'],
    tint: { dark: '#A99BFF', light: '#5B45E0' },
    kind: t('Радиальный конвертер', 'Radial converter'),
    links: [
      { kind: 'download', install: 'mac-zip', href: 'https://github.com/ehroz1/morfus-releases/releases/latest/download/Morfus.zip', label: t('Скачать для Mac', 'Download for Mac') },
      { kind: 'releases', href: 'https://github.com/ehroz1/morfus-releases/releases', label: t('Все версии', 'All releases') },
    ],
    features: [
      {
        scene: 'morfus-ring',
        title: t('Кольцо вокруг курсора', 'A ring around your cursor'),
        text: t(
          'Начните тащить файл и нажмите ⌥. Вокруг курсора появится кольцо с форматами для этого типа файла — ведите в сектор и отпустите.',
          'Start dragging a file and press ⌥. A ring of formats for that file type appears around the cursor — move into a sector and let go.',
        ),
      },
      {
        scene: 'morfus-modes',
        title: t('Три режима — три клавиши', 'Three modes, three keys'),
        text: t(
          '⌥ — конвертация, ⌘ — сжатие («Слегка / Средне / Сильно», «не больше 25 МБ»), ⌃ — инструменты: убрать фон, распознать текст, склеить PDF. Другая клавиша переключает режим на лету.',
          '⌥ converts, ⌘ compresses (light / medium / strong, “no more than 25 MB”), ⌃ opens tools: remove background, recognise text, merge PDFs. Another key switches mode on the fly.',
        ),
      },
      {
        scene: 'morfus-result',
        title: t('Результат прямо в кольце', 'The result, right in the ring'),
        text: t(
          'Короткие задачи показывают прогресс и итог в центре кольца: «4,2 МБ → 1,1 МБ · −74%». Долгие уходят в индикатор в углу экрана.',
          'Quick jobs show progress and the outcome in the centre of the ring: “4.2 MB → 1.1 MB · −74%”. Long ones move to a small indicator in the corner.',
        ),
      },
      {
        scene: 'morfus-settings',
        title: t('Кольцо под себя', 'Make the ring yours'),
        text: t(
          'Для каждого режима и типа файла — свой набор секторов: добавляйте, убирайте, меняйте порядок перетаскиванием. Избранное, второе кольцо с вариантами, свой цвет.',
          'Every mode and file type has its own set of sectors: add, remove, reorder by dragging. Favourites, a second ring with options, your own colour.',
        ),
      },
      {
        scene: 'morfus-cli',
        title: t('И без кольца', 'Or without the ring'),
        text: t(
          'Службы Finder, ⌥⌘M для выделенного, ссылки morfus:// и командная строка — те же действия для скриптов и Быстрых команд.',
          'Finder services, ⌥⌘M for the selection, morfus:// links and a command line — the same actions for scripts and Shortcuts.',
        ),
      },
    ],
    steps: [
      t('Скачайте архив, перенесите Morfus.app в «Программы» и откройте правым щелчком → «Открыть».', 'Download the zip, move Morfus.app to Applications and open it with right-click → Open.'),
      t('Пройдите знакомство: типы файлов, клавиши режимов. Для видео и PDF Morfus сам поставит ffmpeg, Ghostscript и qpdf.', 'Go through onboarding: file types and mode keys. For video and PDF, Morfus installs ffmpeg, Ghostscript and qpdf itself.'),
      t('Тащите любой файл, жмите ⌥, ⌘ или ⌃ и бросайте в сектор. Готовый файл — рядом с исходником.', 'Drag any file, press ⌥, ⌘ or ⌃ and drop on a sector. The result lands next to the original.'),
    ],
    faq: [
      { q: t('Файлы куда-то загружаются?', 'Are my files uploaded anywhere?'), a: t('Нет. Всё обрабатывается на Mac: встроенные библиотеки, Vision от Apple и программы вроде ffmpeg.', 'No. Everything runs on your Mac: built-in libraries, Apple Vision and tools like ffmpeg.') },
      { q: t('Как обновляться?', 'How do updates work?'), a: t('Morfus сам проверяет новые версии, в меню значка появляется «Обновить Morfus». Архив сверяется по SHA-256 и подписи.', 'Morfus checks for new versions and shows “Update Morfus” in its menu. The download is verified by SHA-256 and signature.') },
      { q: t('macOS не даёт открыть приложение', 'macOS won’t open the app'), a: t('Правый щелчок по Morfus.app → «Открыть» → «Открыть». Или «Настройки → Конфиденциальность и безопасность → Всё равно открыть».', 'Right-click Morfus.app → Open → Open. Or System Settings → Privacy & Security → Open Anyway.') },
      { q: t('Можно перенести настройки на другой Mac?', 'Can I move settings to another Mac?'), a: t('Да: «Справка → Перенос настроек» сохраняет всё в один файл .morfus.', 'Yes: Help → Transfer settings saves everything into a single .morfus file.') },
    ],
    requirements: [t('macOS 13 Ventura и новее', 'macOS 13 Ventura or later'), t('Apple Silicon и Intel', 'Apple Silicon and Intel'), t('Для видео, звука и PDF — бесплатные ffmpeg, Ghostscript, qpdf (ставятся из Morfus)', 'Free ffmpeg, Ghostscript and qpdf for video, audio and PDF (installed from Morfus)')],
  },
  {
    slug: 'morfu',
    name: 'Morfu',
    short: t('Конвертер в строке меню macOS', 'Menu bar converter for macOS'),
    tagline: t('Бросил файл на «m» — забрал результат.', 'Drop a file on the “m”, grab the result.'),
    about: t(
      'Morfu живёт в строке меню. Бросьте на иконку видео, фото, PDF, SVG или документ — получите нужный формат и сразу увидите, сколько места сэкономлено. Всё локально, готовый файл вытаскивается мышкой или уже лежит в буфере.',
      'Morfu lives in the menu bar. Drop a video, photo, PDF, SVG or document on its icon, get the format you need and see how much space you saved. Everything stays local; drag the result out or paste it from the clipboard.',
    ),
    audience: t('Тем, кому нужен конвертер «на один бросок» без лишних окон.', 'People who want a one-drop converter without extra windows.'),
    platforms: ['macos'],
    status: 'ready',
    updated: '2026-10-27',
    version: '3.3',
    accent: '#ffffff',
    onAccent: '#000000',
    glow: ['#3a3a44', '#6c6c7a', '#22222a'],
    tint: { dark: '#E4E4E8', light: '#2A2A2E' },
    kind: t('Конвертер в строке меню', 'Menu bar converter'),
    links: [
      { kind: 'download', install: 'mac-zip', href: 'https://github.com/ehroz1/morfu-releases/releases/latest/download/Morfu.zip', label: t('Скачать для Mac', 'Download for Mac') },
      { kind: 'releases', href: 'https://github.com/ehroz1/morfu-releases/releases', label: t('Все версии', 'All releases') },
    ],
    features: [
      {
        scene: 'morfu-menubar',
        title: t('Перетаскивание туда и обратно', 'Drag in, drag out'),
        text: t('Бросьте файлы на «m» в строке меню — панель покажет очередь, а готовый файл вытаскивается мышкой прямо в мессенджер.', 'Drop files on the “m” in the menu bar — the panel shows the queue, and you drag the result straight into a chat.'),
      },
      {
        scene: 'morfu-savings',
        title: t('Видно, сколько сэкономлено', 'See what you saved'),
        text: t('Для каждого файла: «12,4 МБ → 3,1 МБ · −75%». Плюс статистика за месяц и за всё время.', 'For every file: “12.4 MB → 3.1 MB · −75%”. Plus stats for the month and all time.'),
      },
      {
        scene: 'morfu-notch',
        title: t('Островок у «чёлки»', 'An island at the notch'),
        text: t('Тащите файл к чёлке MacBook — она раскрывается островком с прогрессом и результатами.', 'Drag a file to the MacBook notch — it opens into an island with progress and results.'),
      },
      {
        scene: 'morfu-trace',
        title: t('Растр → SVG', 'Raster → SVG'),
        text: t('«SVG ч/б» для логотипов и подписей, «SVG цвет» для иллюстраций. Ползунки «Цвета / Детали / Сглаживание» с живым превью.', '“SVG b/w” for logos and signatures, “SVG colour” for illustrations. Colours / Detail / Smoothing sliders with a live preview.'),
      },
    ],
    steps: [
      t('Скачайте архив, перенесите Morfu.app в «Программы», первый запуск — правый клик → «Открыть».', 'Download the zip, move Morfu.app to Applications, first launch — right-click → Open.'),
      t('Поставьте утилиты одной командой: brew install ffmpeg webp mupdf-tools potrace pngquant.', 'Install the tools with one command: brew install ffmpeg webp mupdf-tools potrace pngquant.'),
      t('Бросайте файлы на «m» или жмите ⌘V в панели. Дальше Morfu обновляется сам.', 'Drop files on the “m” or press ⌘V in the panel. Morfu keeps itself up to date.'),
    ],
    faq: [
      { q: t('Чем Morfu отличается от Morfus?', 'How is Morfu different from Morfus?'), a: t('Morfu — панель в строке меню на Swift. Morfus — следующее поколение на Rust: круглое меню у курсора и больше действий.', 'Morfu is a Swift menu bar panel. Morfus is the next generation in Rust: a round menu at the cursor and many more actions.') },
      { q: t('Нужен интернет?', 'Does it need the internet?'), a: t('Нет. Даже расшифровка речи в TXT и SRT идёт встроенным распознавателем macOS.', 'No. Even speech-to-TXT/SRT uses the built-in macOS recogniser.') },
      { q: t('Можно сжать скриншот сразу в буфере?', 'Can it compress a screenshot in the clipboard?'), a: t('Да: ⌃⌥C — содержимое буфера конвертируется и возвращается в буфер.', 'Yes: ⌃⌥C converts the clipboard contents and puts them back.') },
    ],
    requirements: [t('macOS 13 Ventura и новее', 'macOS 13 Ventura or later'), t('Homebrew и утилиты ffmpeg, webp, mupdf-tools, potrace, pngquant', 'Homebrew with ffmpeg, webp, mupdf-tools, potrace, pngquant'), t('Media Engine на Apple Silicon ускоряет видео в 2–3 раза', 'Media Engine on Apple Silicon makes video 2–3× faster')],
  },
  {
    slug: 'pachaq',
    name: 'Pachaq',
    short: t('Сжатие и обрезка картинок для сайтов', 'Image compression and cropping for the web'),
    tagline: t('Перетащите картинки — получите лёгкие WebP, JPEG и PNG.', 'Drop images, get light WebP, JPEG and PNG.'),
    about: t(
      'Pachaq сжимает и обрезает изображения для сайтов: WebP через libwebp, JPEG через MozJPEG, PNG через oxipng. Ресайз, умная обрезка под нужное соотношение, папки наблюдения и работа из трея. Написан на Rust и Tauri, работает на Mac и Windows.',
      'Pachaq compresses and crops images for websites: WebP via libwebp, JPEG via MozJPEG, PNG via oxipng. Resizing, smart cropping to any ratio, watch folders and a tray mode. Built with Rust and Tauri for Mac and Windows.',
    ),
    audience: t('Веб-разработчикам, контент-менеджерам и всем, кто выкладывает картинки на сайт.', 'Web developers, content managers and anyone publishing images online.'),
    platforms: ['macos', 'windows'],
    status: 'ready',
    updated: '2026-11-12',
    version: '0.1.2',
    accent: '#3a55f0',
    onAccent: '#ffffff',
    glow: ['#4fa8ff', '#3b5bff', '#5a2fd6'],
    tint: { dark: '#6E8BFF', light: '#2F4FE6' },
    kind: t('Сжатие картинок', 'Image compression'),
    links: [
      { kind: 'download', install: 'mac', href: 'https://github.com/ehroz1/pachaq-releases/releases/latest/download/Pachaq-arm64.dmg', label: t('Mac — Apple Silicon', 'Mac — Apple Silicon') },
      { kind: 'download', install: 'mac', href: 'https://github.com/ehroz1/pachaq-releases/releases/latest/download/Pachaq-intel.dmg', label: t('Mac — Intel', 'Mac — Intel') },
      { kind: 'download', install: 'win', href: 'https://github.com/ehroz1/pachaq-releases/releases/latest/download/Pachaq-Setup.exe', label: t('Скачать для Windows', 'Download for Windows') },
    ],
    features: [
      {
        scene: 'pachaq-drop',
        title: t('Бросил — сжал', 'Drop and done'),
        text: t('Файлы и целые папки, вставка из буфера ⌘V. Формат выбирается сверху: WebP, JPEG, PNG или «Как есть». Рядом с каждым файлом — сколько процентов ушло.', 'Files and whole folders, or paste with ⌘V. Pick the format on top: WebP, JPEG, PNG or “As is”. Each file shows how much it shrank.'),
      },
      {
        scene: 'pachaq-crop',
        title: t('Умная обрезка', 'Smart crop'),
        text: t('1:1, 4:3, 3:2, 16:9, 4:5, 9:16, 21:9 или своё. Pachaq ищет самое интересное в кадре — детали, насыщенность, тон кожи — или вы двигаете рамку вручную.', '1:1, 4:3, 3:2, 16:9, 4:5, 9:16, 21:9 or custom. Pachaq finds the interesting part — detail, saturation, skin tones — or you move the frame yourself.'),
      },
      {
        scene: 'pachaq-watch',
        title: t('Папки наблюдения', 'Watch folders'),
        text: t('Укажите папку — новые картинки сразу сжимаются в подпапку pachaq/. Pachaq работает в фоне из трея и стартует вместе с системой.', 'Pick a folder — new images are compressed into a pachaq/ subfolder right away. Pachaq runs from the tray and starts with your system.'),
      },
      {
        scene: 'pachaq-context',
        title: t('Из Finder и Проводника', 'From Finder and Explorer'),
        text: t('Быстрое действие в Finder, пункт в контекстном меню Проводника и командная строка: pachaq --compress <файлы|папки>.', 'A Finder Quick Action, an Explorer context menu item and a CLI: pachaq --compress <files|folders>.'),
      },
    ],
    steps: [
      t('Скачайте установщик: .dmg для Mac (Apple Silicon или Intel) или .exe для Windows.', 'Download the installer: a .dmg for Mac (Apple Silicon or Intel) or an .exe for Windows.'),
      t('Выберите формат и обрезку в верхней панели.', 'Choose the format and crop in the top bar.'),
      t('Перетащите картинки или папку — сжатые файлы появятся рядом.', 'Drop images or a folder — compressed files appear next to them.'),
    ],
    faq: [
      { q: t('Какие форматы читает?', 'Which formats can it read?'), a: t('JPEG, PNG, WebP, HEIC/HEIF и TIFF. На Windows для HEIC нужно расширение «HEIF Image Extensions».', 'JPEG, PNG, WebP, HEIC/HEIF and TIFF. On Windows, HEIC needs the “HEIF Image Extensions” add-on.') },
      { q: t('Обновляется сам?', 'Does it update itself?'), a: t('Да, установленный Pachaq предлагает обновиться при запуске, если вышла новая версия.', 'Yes, Pachaq offers an update on launch when a new version is out.') },
      { q: t('Где настройки?', 'Where are the settings?'), a: t('⌘, в приложении. Хранятся в settings.json в папке приложения.', '⌘, in the app. They live in settings.json in the app folder.') },
    ],
    requirements: [t('macOS 11 и новее — Apple Silicon и Intel', 'macOS 11 or later — Apple Silicon and Intel'), t('Windows 10 и 11', 'Windows 10 and 11')],
  },
  {
    slug: 'sukhan',
    name: 'Sukhan',
    short: t('Автосубтитры для Reels, TikTok и Shorts', 'Auto captions for Reels, TikTok and Shorts'),
    tagline: t('Субтитры для вертикальных видео — сами и красиво.', 'Captions for vertical video — automatic and good-looking.'),
    about: t(
      'Sukhan — мини-монтажка для субтитров. Распознаёт речь с пословными таймкодами (русский с английскими терминами, английский, казахский), даёт поправить текст на таймлайне и прямо в превью, а превью совпадает с экспортом пиксель в пиксель. Сейчас в разработке.',
      'Sukhan is a tiny editor for captions. It transcribes speech with word-level timing (Russian with English terms, English, Kazakh), lets you fix text on the timeline or right in the preview, and the preview matches the export pixel for pixel. In development.',
    ),
    audience: t('Блогерам и SMM-специалистам, которые делают короткие вертикальные ролики.', 'Creators and social media teams making short vertical videos.'),
    platforms: ['macos'],
    status: 'dev',
    updated: '2026-10-27',
    accent: '#F2CC4E',
    onAccent: '#0E0E0F',
    glow: ['#ff5b2e', '#6b3a2a', '#2a2a33'],
    tint: { dark: '#F2CC4E', light: '#7D5A00' },
    kind: t('Автосубтитры', 'Auto captions'),
    links: [{ kind: 'releases', href: 'https://github.com/ehroz1/sukhan-releases', label: t('Следить за релизами', 'Watch for releases') }],
    features: [
      {
        scene: 'sukhan-karaoke',
        title: t('Слово за словом', 'Word by word'),
        text: t('Пословные таймкоды от Groq Whisper, ElevenLabs Scribe или Google Gemini — на бесплатных тарифах, со своими ключами в Связке ключей.', 'Word-level timing from Groq Whisper, ElevenLabs Scribe or Google Gemini — on free tiers, with your keys in the macOS Keychain.'),
      },
      {
        scene: 'sukhan-timeline',
        title: t('Таймлайн как в монтажке', 'A real timeline'),
        text: t('Waveform и масштаб, перетаскивание фраз и границ слов, разбить и склеить, сдвиг дорожки на 50 мс, ⌘Z.', 'Waveform and zoom, drag phrases and word edges, split and join, nudge the track by 50 ms, ⌘Z.'),
      },
      {
        scene: 'sukhan-formats',
        title: t('9:16, 1:1, 4:5, 16:9', '9:16, 1:1, 4:5, 16:9'),
        text: t('Если пропорции другие — «Кадрировать» перетаскиванием прямо в превью или «Вписать с размытым фоном».', 'If the ratio is different — crop by dragging right in the preview, or fit with a blurred background.'),
      },
      {
        scene: 'sukhan-engine',
        title: t('Быстрый рендер', 'A fast renderer'),
        text: t('Один движок на Rust для превью и экспорта. На Apple M4 минутный ролик 1080×1920 с субтитрами экспортируется за 8 секунд.', 'One Rust engine for preview and export. On Apple M4, a one-minute 1080×1920 clip with captions exports in 8 seconds.'),
      },
    ],
    steps: [
      t('Перетащите видео в окно — MP4, MOV, MKV, WEBM, M4V или звук.', 'Drop a video into the window — MP4, MOV, MKV, WEBM, M4V or audio.'),
      t('Выберите провайдера и язык — Sukhan распознает речь по словам.', 'Pick a provider and language — Sukhan transcribes word by word.'),
      t('Поправьте текст на таймлайне и сохраните проект .subproj.', 'Fix the text on the timeline and save a .subproj project.'),
    ],
    faq: [
      { q: t('Когда выйдет?', 'When is it out?'), a: t('Готовы этапы 0–3: движок рендера, плеер, форматы кадра, распознавание, редактор и проекты. Дальше — оформление, пресеты и экспорт.', 'Stages 0–3 are done: renderer, player, frame formats, recognition, editor and projects. Next: styling, presets and export.') },
      { q: t('Нужно что-то ставить?', 'Do I need to install anything?'), a: t('Нет, FFmpeg встроен в приложение.', 'No, FFmpeg is bundled with the app.') },
      { q: t('Где хранятся ключи API?', 'Where are API keys stored?'), a: t('В Связке ключей macOS, не в файлах.', 'In the macOS Keychain, not in files.') },
    ],
    requirements: [t('macOS на Apple Silicon (M1 и новее)', 'macOS on Apple Silicon (M1 or later)'), t('Бесплатный ключ Groq, ElevenLabs или Gemini', 'A free Groq, ElevenLabs or Gemini key')],
  },
  {
    slug: 'radius',
    name: 'radius',
    short: t('Удаление фона с фото на Mac', 'Background removal for photos on Mac'),
    tagline: t('Перетащи фото — получи PNG без фона. Локально, на видеокарте Mac.', 'Drop a photo, get a PNG with no background. Local, on your Mac’s GPU.'),
    about: t(
      'radius убирает фон с фото моделью BiRefNet прямо на Mac: примерно 1,5 секунды на снимок, без интернета и подписок. Режим «Максимум» (HR-matting, 2048 px) сохраняет волосы, мех, фату и стекло. Результат можно перетащить в Telegram, Figma или Finder, поправить кистью и заменить фон.',
      'radius removes the background from photos with the BiRefNet model right on your Mac: about 1.5 seconds per image, no internet and no subscription. Maximum mode (HR-matting, 2048 px) keeps hair, fur, veils and glass. Drag the result into Telegram, Figma or Finder, touch it up with a brush and swap the background.',
    ),
    audience: t('Дизайнерам, продавцам и всем, кто вырезает объекты с фото.', 'Designers, sellers and anyone cutting objects out of photos.'),
    platforms: ['macos'],
    status: 'ready',
    updated: '2026-11-12',
    version: '1.1.0',
    accent: '#d4d7e0',
    onAccent: '#101114',
    glow: ['#3a3f4b', '#7c8394', '#1b1e25'],
    tint: { dark: '#AEB6C6', light: '#4F5868' },
    kind: t('Удаление фона', 'Background removal'),
    links: [
      { kind: 'download', install: 'mac', href: 'https://github.com/ehroz1/radius-releases/releases/latest/download/radius.dmg', label: t('Скачать для Mac', 'Download for Mac') },
      { kind: 'github', href: 'https://github.com/ehroz1/radius-models', label: t('Модели Core ML', 'Core ML models') },
    ],
    features: [
      {
        scene: 'radius-main',
        title: t('Бросил фото — забрал PNG', 'Drop a photo, take a PNG'),
        text: t('Фото, несколько или целая папка — в окно, на значок в Dock или ⌘V. Фон результата — прозрачный, белый, чёрный или свой цвет, «Сравнить» показывает оригинал.', 'A photo, several or a whole folder — into the window, onto the Dock icon, or ⌘V. The result background is transparent, white, black or your colour, and Compare shows the original.'),
      },
      {
        scene: 'radius-matte',
        title: t('Мягкая альфа-маска', 'A soft alpha matte'),
        text: t('Не «ножницы», а маска с прозрачностью от 0 до 1. «Быстро» — 1024 px, ~1,5 с на большинство фото; «Максимум» — HR-matting 2048 px для волос и меха, ~7 с.', 'Not a hard cut but a matte from 0 to 1. Fast is 1024 px, ~1.5 s for most photos; Maximum is 2048 px HR-matting for hair and fur, ~7 s.'),
      },
      {
        scene: 'radius-local',
        title: t('Только на устройстве', 'On-device only'),
        text: t('Модель работает на видеокарте Mac, фото не покидает компьютер. Модели (~410 МБ каждая) скачиваются при первом запуске и проверяются по SHA-256.', 'The model runs on your Mac’s GPU and the photo never leaves your computer. Models (~410 MB each) download on first launch and are checked by SHA-256.'),
      },
    ],
    steps: [
      t('Установите radius и пройдите короткое знакомство — модель скачается за это время.', 'Install radius and go through the short intro — the model downloads meanwhile.'),
      t('Перетащите фото в окно, на значок в Dock или вставьте ⌘V.', 'Drop a photo onto the window or the Dock icon, or paste with ⌘V.'),
      t('Заберите результат: перетащите картинку в Telegram, Figma или Finder, ⌘C или ⌘S.', 'Take the result: drag the image into Telegram, Figma or Finder, ⌘C or ⌘S.'),
    ],
    faq: [
      { q: t('Какая модель внутри?', 'Which model is inside?'), a: t('BiRefNet (MIT) в формате Core ML: общая для режима «Быстро» и HR-matting для «Максимум».', 'BiRefNet (MIT) in Core ML: the general model for Fast and HR-matting for Maximum.') },
      { q: t('Если модель ошиблась?', 'What if the model gets it wrong?'), a: t('Нажмите B или дважды кликните по результату — кисть «Стереть / Вернуть» с отменой и масштабом поправит край за пару мазков.', 'Press B or double-click the result — an Erase / Restore brush with undo and zoom fixes an edge in a couple of strokes.') },
      { q: t('Можно без открытия окна?', 'Can I skip the window?'), a: t('Да: правый клик по фото в Finder → «Быстрые действия» → «Удалить фон (radius)». Рядом появится имя-radius.png.', 'Yes: right-click a photo in Finder → Quick Actions → Remove Background (radius). A name-radius.png appears beside it.') },
      { q: t('Обновляется сам?', 'Does it update itself?'), a: t('Да: раз в полчаса проверяет релизы, сверяет SHA-256 и подпись, ставит с откатом при ошибке и перезапускается.', 'Yes: every half hour it checks releases, verifies SHA-256 and signature, installs with rollback on error and restarts.') },
    ],
    requirements: [t('macOS 15 и новее', 'macOS 15 or later'), t('Apple Silicon', 'Apple Silicon'), t('Для режима «Максимум» нужно около 10 ГБ памяти', 'Maximum mode needs about 10 GB of memory')],
  },
  {
    slug: 'bla-bla',
    name: 'BLA-БЛА',
    short: t('Расшифровка аудио и видео в браузере', 'Audio & video transcription in the browser'),
    tagline: t('11 сервисов распознавания речи — один интерфейс и свои бесплатные ключи.', '11 speech-to-text services — one interface, your own free keys.'),
    about: t(
      'BLA-БЛА превращает аудио и видео в текст с таймкодами. Файл готовится прямо в браузере, длинные записи режутся под лимиты сервиса и склеиваются обратно. Настроена на смешанную русско-английскую речь и казахский. Сервера нет, ключи остаются в браузере.',
      'BLA-БЛА turns audio and video into timestamped text. Files are prepared right in the browser, long recordings are split to each service’s limits and stitched back. Tuned for mixed Russian–English speech and Kazakh. No server; keys stay in your browser.',
    ),
    audience: t('Журналистам, исследователям, авторам подкастов — всем, кому нужен текст из записи.', 'Journalists, researchers, podcasters — anyone who needs text from a recording.'),
    platforms: ['web'],
    status: 'ready',
    updated: '2026-10-27',
    accent: '#ededed',
    onAccent: '#171717',
    glow: ['#3d3d3d', '#1f8a5b', '#5c5c5c'],
    tint: { dark: '#3CCB8A', light: '#0F7046' },
    kind: t('Расшифровка речи', 'Speech to text'),
    openSource: true,
    links: [
      { kind: 'open', href: 'https://ehroz1.github.io/bla-bla-text/', label: t('Открыть', 'Open app') },
      { kind: 'github', href: 'https://github.com/ehroz1/bla-bla-text', label: t('GitHub', 'GitHub') },
    ],
    features: [
      {
        scene: 'bla-upload',
        title: t('Любой файл', 'Any file'),
        text: t('mp3, m4a, wav, ogg, flac, mp4, mov, webm, mkv… Из видео берётся только звук и сжимается в MP3 16 кГц моно — около 0,35 МБ в минуту.', 'mp3, m4a, wav, ogg, flac, mp4, mov, webm, mkv… Only the audio is used, squeezed into 16 kHz mono MP3 — about 0.35 MB per minute.'),
      },
      {
        scene: 'bla-providers',
        title: t('11 сервисов на выбор', 'Pick from 11 services'),
        text: t('Groq Whisper, Gemini, ElevenLabs Scribe, Speechmatics, Deepgram и другие. У каждого — бесплатный лимит, качество по языкам и пошаговая инструкция, как получить ключ.', 'Groq Whisper, Gemini, ElevenLabs Scribe, Speechmatics, Deepgram and more. Each card shows the free tier, quality per language and how to get a key, step by step.'),
      },
      {
        scene: 'bla-result',
        title: t('Текст, который можно забрать', 'Text you can take with you'),
        text: t('Правка прямо на странице, копирование и скачивание в TXT, Markdown, SRT, VTT или JSON. Последние 30 расшифровок — в истории.', 'Edit in place, copy, or download TXT, Markdown, SRT, VTT or JSON. The last 30 transcripts stay in history.'),
      },
    ],
    steps: [
      t('Откройте BLA-БЛА и перетащите аудио или видео.', 'Open BLA-БЛА and drop an audio or video file.'),
      t('Выберите сервис и вставьте бесплатный ключ — карточка подскажет, где его взять.', 'Pick a service and paste a free key — the card shows where to get one.'),
      t('Нажмите «Расшифровать» и скачайте текст или субтитры.', 'Press Transcribe and download the text or subtitles.'),
    ],
    faq: [
      { q: t('Это бесплатно?', 'Is it free?'), a: t('Сам сайт — да. У большинства сервисов есть бесплатный тариф или стартовые кредиты; быстрее всего начать с Groq.', 'The site is. Most services have a free tier or sign-up credits; Groq is the quickest start.') },
      { q: t('Куда уходит запись?', 'Where does my audio go?'), a: t('Только в выбранный вами сервис. Своего сервера у BLA-БЛА нет.', 'Only to the service you choose. BLA-БЛА has no server of its own.') },
      { q: t('Работает офлайн?', 'Does it work offline?'), a: t('Есть версия одним файлом bla-bla.html — открывается с диска, но сами сервисы распознавания требуют интернета.', 'There is a single-file bla-bla.html that opens from disk, but the speech services still need the internet.') },
    ],
    requirements: [t('Любой современный браузер на компьютере или телефоне', 'Any modern browser on desktop or mobile'), t('Ключ одного из сервисов распознавания', 'A key for one of the speech services')],
  },
  {
    slug: 'picta',
    name: 'Picta',
    short: t('Поиск фото, иконок и видео сразу везде', 'Search photos, icons and video everywhere at once'),
    tagline: t('Один запрос — Pixabay, Pexels, Unsplash, Wikimedia и ещё десяток источников.', 'One query — Pixabay, Pexels, Unsplash, Wikimedia and more.'),
    about: t(
      'Picta ищет бесплатные фото сразу по нескольким фотостокам и сводит всё в одну ленту. Русский запрос сам переводится на английский, дубли убираются, у каждой картинки понятная плашка лицензии. Отдельно — поиск иконок через Iconify и видео.',
      'Picta searches several free stock sites at once and merges everything into one feed. Russian queries are translated to English automatically, duplicates are removed and every image has a clear licence badge. Plus icon search via Iconify and video.',
    ),
    audience: t('Дизайнерам, редакторам и SMM, которым нужна картинка «на сейчас».', 'Designers, editors and social media teams who need an image right now.'),
    platforms: ['web'],
    status: 'ready',
    updated: '2026-10-27',
    accent: '#ffffff',
    onAccent: '#101114',
    glow: ['#7c5cff', '#06b6d4', '#ff6428'],
    tint: { dark: '#2CC7E8', light: '#086A84' },
    kind: t('Поиск картинок', 'Image search'),
    openSource: true,
    links: [
      { kind: 'open', href: 'https://picta.cc', label: t('Открыть picta.cc', 'Open picta.cc') },
      { kind: 'github', href: 'https://github.com/ehroz1/toptop-photo', label: t('GitHub', 'GitHub') },
    ],
    features: [
      {
        scene: 'picta-search',
        title: t('Все стоки в одной ленте', 'Every stock site in one feed'),
        text: t('Pixabay, Pexels, Unsplash, Wikimedia Commons, Openverse и другие. Запрос «кот» ищется как «cat», а под строкой видно, как именно.', 'Pixabay, Pexels, Unsplash, Wikimedia Commons, Openverse and more. A Russian query is searched in English, and you can see how.'),
      },
      {
        scene: 'picta-license',
        title: t('Лицензия — сразу на виду', 'The licence, front and centre'),
        text: t('«CC0», «Pixabay License», «CC BY-SA» с пометками «Можно для коммерции» и «Нужна атрибуция» — без похода на сайт источника.', '“CC0”, “Pixabay License”, “CC BY-SA” with “OK for commercial use” and “Attribution required” — no trip to the source site.'),
      },
      {
        scene: 'picta-icons',
        title: t('Иконки и цвета', 'Icons and colours'),
        text: t('Режим «Иконки» — больше 200 000 иконок из ~200 открытых наборов, SVG или PNG в любом цвете. Режим «Цвета» — палитра для слова.', 'Icons mode — over 200,000 icons from ~200 open sets, as SVG or PNG in any colour. Colours mode — a palette for any word.'),
      },
    ],
    steps: [
      t('Откройте picta.cc — ставить ничего не нужно.', 'Open picta.cc — nothing to install.'),
      t('Введите запрос на любом языке, отключите лишние источники.', 'Type a query in any language and switch off sources you don’t need.'),
      t('Скачайте фото, выделите несколько в ZIP или скопируйте картинку в буфер.', 'Download a photo, pick several into a ZIP, or copy the image to the clipboard.'),
    ],
    faq: [
      { q: t('Фото можно использовать бесплатно?', 'Are the photos free to use?'), a: t('Источники бесплатные, но лицензии разные — Picta показывает их на каждой картинке.', 'The sources are free, but licences differ — Picta shows them on every image.') },
      { q: t('Можно поставить как приложение?', 'Can I install it as an app?'), a: t('Да, это PWA: «Установить» в браузере или «На экран Домой» на телефоне.', 'Yes, it’s a PWA: Install in the browser or Add to Home Screen on a phone.') },
      { q: t('Есть горячие клавиши?', 'Any keyboard shortcuts?'), a: t('«/» — к поиску, Esc — очистить, D — скачать открытое фото, ← → — листать.', '“/” to search, Esc to clear, D to download the open photo, ← → to browse.') },
    ],
    requirements: [t('Любой современный браузер', 'Any modern browser'), t('Работает и на телефоне', 'Works on phones too')],
  },
  {
    slug: 'atlas',
    name: 'Atlas',
    short: t('Каталог полезных сайтов и инструментов', 'A hand-picked directory of useful sites and tools'),
    tagline: t('Полезные сайты, отобранные вручную, — чтобы помогать делать вещи.', 'Useful sites picked by hand, to help you get things made.'),
    about: t(
      'Atlas — каталог из больше чем ста сайтов и инструментов для дизайнеров, разработчиков и любопытных. Каждым сайтом сначала пользуются какое-то время, и никто не платит за место в списке. Ищите по названию, фильтруйте по категории, цене и платформе или листайте «Стену» из превью. Страницы на русском и английском, есть RSS.',
      'Atlas is a directory of over a hundred sites and tools for designers, developers and the curious. Every site is used for a while before it is added, and nobody pays for a spot on the list. Search by name, filter by category, price and platform, or scroll the Wall of previews. Pages in Russian and English, with an RSS feed.',
    ),
    audience: t('Дизайнерам, разработчикам и всем, кто ищет надёжный инструмент или вдохновение без шума.', 'Designers, developers and anyone looking for a reliable tool or inspiration without the noise.'),
    platforms: ['web'],
    status: 'ready',
    updated: '2026-11-13',
    accent: '#2F5BEA',
    onAccent: '#ffffff',
    glow: ['#2f5bea', '#0d0d0d', '#5a82ff'],
    tint: { dark: '#6C8DFF', light: '#2347C4' },
    kind: t('Каталог сайтов', 'Site directory'),
    links: [{ kind: 'open', href: 'https://atlas.ehroz.pro/', label: t('Открыть Atlas', 'Open Atlas') }],
    features: [
      {
        scene: 'atlas-home',
        title: t('Каталог с превью', 'A directory with previews'),
        text: t('Каждый сайт — карточка с превью, категорией и коротким описанием: нейросети, дизайн, вдохновение, утилиты, разработка, шрифты. Отметки «Бесплатно», «Есть бесплатный план» и «Открытый код» видны сразу.', 'Every site is a card with a preview, a category and a short description: AI, design, inspiration, utilities, development, fonts. “Free”, “Free plan” and “Open source” badges are visible at a glance.'),
      },
      {
        scene: 'atlas-search',
        title: t('Поиск и фильтры', 'Search and filters'),
        text: t('Клавиша «/» открывает поиск по сайтам и категориям. Фильтры по категории, цене и платформе сужают список, а «Мне повезёт» открывает случайный сайт.', 'The “/” key opens search across sites and categories. Filters by category, price and platform narrow the list, and “I’m feeling lucky” opens a random site.'),
      },
      {
        scene: 'atlas-wall',
        title: t('Стена', 'The Wall'),
        text: t('Все сайты — на одной бесконечной стене превью. Прокрутите или потяните, чтобы наткнуться на что-то неожиданное.', 'Every site on one endless wall of previews. Scroll or drag to stumble on something unexpected.'),
      },
    ],
    steps: [
      t('Откройте atlas.ehroz.pro — ничего ставить не нужно.', 'Open atlas.ehroz.pro — nothing to install.'),
      t('Нажмите «/» и введите название или выберите категорию и фильтры.', 'Press “/” and type a name, or pick a category and filters.'),
      t('Откройте карточку, чтобы прочитать описание, и переходите на сайт.', 'Open a card to read the description, then visit the site.'),
    ],
    faq: [
      { q: t('Как сайты попадают в каталог?', 'How do sites get in?'), a: t('Ими сначала пользуются какое-то время. Сайт должен делать своё дело лучше очевидного выбора, быть понятным за минуту и не требовать регистрации, чтобы осмотреться. За место в списке никто не платит.', 'They are used for a while first. A site has to do its job better than the obvious choice, make sense within a minute and not require sign-up just to look around. Nobody pays for a spot.') },
      { q: t('Можно предложить свой сайт?', 'Can I suggest a site?'), a: t('Да, кнопка «Предложить сайт» на atlas.ehroz.pro ведёт на форму.', 'Yes — the “Suggest a site” button on atlas.ehroz.pro opens a form.') },
      { q: t('Есть ли RSS?', 'Is there an RSS feed?'), a: t('Да: atlas.ehroz.pro/rss.xml — новые сайты приходят в вашу читалку.', 'Yes: atlas.ehroz.pro/rss.xml — new sites arrive in your reader.') },
    ],
    requirements: [t('Любой современный браузер на компьютере или телефоне', 'Any modern browser on desktop or mobile')],
  },
  {
    slug: 'padbridge',
    name: 'PadBridge',
    short: t('Геймпад в любой игре на Mac', 'A gamepad in any game on Mac'),
    tagline: t('DualShock, DualSense, Xbox или Switch Pro — в любой игре, даже если она про геймпад не знает.', 'DualShock, DualSense, Xbox or Switch Pro — in any game, even one that knows nothing about gamepads.'),
    about: t(
      'PadBridge превращает нажатия геймпада в клавиатуру и мышь. Работает в играх с itch.io и GOG, в браузерных играх, в Windows-играх через CrossOver, Whisky и Wine, в эмуляторах и обычных программах. Сам узнаёт игру и предлагает готовую раскладку по жанру, а профили переключаются под активное приложение. Кнопка PS отключает эмуляцию там, где игра сама понимает геймпад, а Share + Options показывает подсказку поверх игры.',
      'PadBridge turns gamepad input into keyboard and mouse. It works in itch.io and GOG games, browser games, Windows games via CrossOver, Whisky and Wine, emulators and regular apps. It recognises the game, offers a ready layout for its genre and switches profiles for the active app. The PS button turns emulation off where a game understands the gamepad itself, and Share + Options shows a hint over the game.',
    ),
    audience: t('Тем, кто играет на Mac и хочет держать в руках геймпад, а не клавиатуру.', 'Mac players who would rather hold a gamepad than a keyboard.'),
    platforms: ['macos'],
    status: 'ready',
    updated: '2026-11-12',
    version: '0.5.0',
    accent: '#4FB4FF',
    onAccent: '#0E0E0F',
    glow: ['#2fc7ff', '#5b4bff', '#141a2e'],
    tint: { dark: '#4FB4FF', light: '#1A5F9E' },
    kind: t('Геймпад для Mac', 'Gamepad for Mac'),
    links: [{ kind: 'download', install: 'mac', href: 'https://github.com/ehroz1/padbridge-releases/releases/latest/download/PadBridge.dmg', label: t('Скачать для Mac', 'Download for Mac') }],
    features: [
      {
        scene: 'padbridge-map',
        title: t('Кнопка → клавиша', 'Button → key'),
        text: t('Каждую кнопку, стик и курок можно назначить на клавишу, сочетание или мышь. Стик работает как мышь, профили сами включаются под активное приложение.', 'Any button, stick or trigger can become a key, a shortcut or the mouse. A stick works as a mouse, and profiles switch for the active app.'),
      },
      {
        scene: 'padbridge-newgame',
        title: t('«Новая игра»', '“New game”'),
        text: t('Открыли незнакомую игру — поверх неё появляется окно с раскладками по жанрам: платформер, шутер, стратегия, визуальная новелла, браузерная игра. Выбор прямо геймпадом.', 'Open an unfamiliar game and a window with genre layouts appears on top: platformer, shooter, strategy, visual novel, browser game. Pick one with the gamepad.'),
      },
      {
        scene: 'padbridge-learn',
        title: t('Научить по клавиатуре', 'Learn from your keyboard'),
        text: t('PadBridge считает, какие клавиши вы жмёте в игре, и раскладывает их по геймпаду: движение — на левый стик, прицел — на правый, прыжок — на нижнюю кнопку.', 'PadBridge counts which keys you press in a game and lays them out on the gamepad: movement on the left stick, aim on the right, jump on the bottom button.'),
      },
      {
        scene: 'padbridge-couch',
        title: t('Режим «Диван»', 'Couch mode'),
        text: t('Весь Мак с геймпада: курсор, клики, Mission Control, громкость, музыка и экранная клавиатура RU/EN. Плюс слои, радиальное меню и обмен профилями файлами .padprofile.', 'The whole Mac from a gamepad: cursor, clicks, Mission Control, volume, music and an RU/EN on-screen keyboard. Plus layers, a radial menu and .padprofile sharing.'),
      },
    ],
    steps: [
      t('Подключите геймпад кабелем или по Bluetooth — он сразу появится в окне.', 'Connect the gamepad by cable or Bluetooth — it shows up right away.'),
      t('Разрешите PadBridge управлять клавиатурой и мышью в «Универсальном доступе».', 'Allow PadBridge to control the keyboard and mouse in Accessibility settings.'),
      t('Запустите игру и выберите раскладку в окне «Новая игра» или научите свою.', 'Launch a game and pick a layout in the “New game” window, or teach your own.'),
    ],
    faq: [
      { q: t('Какие геймпады подходят?', 'Which gamepads work?'), a: t('DualShock 4, DualSense, Xbox и Switch Pro — по USB и Bluetooth.', 'DualShock 4, DualSense, Xbox and Switch Pro — over USB and Bluetooth.') },
      { q: t('Зачем ему «Универсальный доступ»?', 'Why does it need Accessibility?'), a: t('Чтобы нажимать клавиши и двигать мышь за вас. Режим «Научить» хранит только счётчики клавиш, а не то, что вы печатаете.', 'To press keys and move the mouse for you. Learn mode stores only key counters, not what you type.') },
      { q: t('Что делает кнопка PS?', 'What does the PS button do?'), a: t('Включает «геймпад напрямую»: игра сама читает геймпад, PadBridge отходит в сторону и запоминает это для игры.', 'It switches to direct gamepad mode: the game reads the gamepad itself, PadBridge steps aside and remembers that for the game.') },
      { q: t('Обновляется сам?', 'Does it update itself?'), a: t('Да: раз в полчаса проверяет релизы, сверяет SHA-256 и подпись и ставит новую версию, когда геймпад не трогали 3 минуты — игра не прервётся.', 'Yes: every half hour it checks releases, verifies the SHA-256 and signature, and installs the new version once the gamepad has been idle for 3 minutes, so a game is never interrupted.') },
      { q: t('Работает с Windows-играми?', 'Does it work with Windows games?'), a: t('Да, PadBridge узнаёт .exe в Wine, CrossOver и Whisky и включает для них свой профиль.', 'Yes, PadBridge detects .exe files in Wine, CrossOver and Whisky and switches to their profile.') },
    ],
    requirements: [t('macOS 13 Ventura и новее', 'macOS 13 Ventura or later'), t('Геймпад DualShock 4, DualSense, Xbox или Switch Pro', 'A DualShock 4, DualSense, Xbox or Switch Pro controller')],
  },
  {
    slug: 'padplus',
    name: 'Pad+',
    short: t('Новые жесты для трекпада Mac', 'New gestures for the Mac trackpad'),
    tagline: t('Края — ползунки, углы — кнопки, ладонь — история буфера.', 'Edges are sliders, corners are buttons, a five-finger tap is your clipboard history.'),
    about: t(
      'Pad+ добавляет трекпаду жесты, которых нет в macOS. Палец вдоль правого края листает страницу с инерцией, вдоль остальных кромок меняет громкость с тактильным щелчком, клик в углах копирует и вставляет, а тап пятью пальцами открывает историю буфера обмена. На любой жест можно назначить действие, сочетание клавиш или запуск программы.',
      'Pad+ adds trackpad gestures macOS doesn’t have. A finger along the right edge scrolls with inertia, along the other edges it changes volume with a haptic click, clicking the corners copies and pastes, and a five-finger tap opens the clipboard history. Any gesture can run an action, a shortcut or an app.',
    ),
    audience: t('Тем, кто работает на Mac с трекпадом и хочет больше жестов без лишних программ.', 'Mac users who live on the trackpad and want more gestures without extra clutter.'),
    platforms: ['macos'],
    status: 'ready',
    updated: '2026-11-12',
    version: '1.1.0',
    accent: '#5B7CFF',
    onAccent: '#0E0E0F',
    glow: ['#2b3fd6', '#5b7cff', '#12141d'],
    tint: { dark: '#7F9BFF', light: '#2340C8' },
    kind: t('Жесты трекпада', 'Trackpad gestures'),
    links: [{ kind: 'download', install: 'mac', href: 'https://github.com/ehroz1/padplus-releases/releases/latest/download/PadPlus.dmg', label: t('Скачать для Mac', 'Download for Mac') }],
    features: [
      {
        scene: 'padplus-pad',
        title: t('Края — ползунки, углы — кнопки', 'Edges are sliders, corners are buttons'),
        text: t('Палец вдоль правого края — прокрутка с инерцией, вдоль левого, верхнего и нижнего — громкость с щелчком на каждом шаге. Клик в правом верхнем углу — копировать, в правом нижнем — вставить. Тап пятью пальцами — история буфера: текст, картинки, файлы.', 'A finger along the right edge scrolls with inertia; along the left, top and bottom edges it sets volume with a click on every step. Click the top-right corner to copy, the bottom-right to paste. A five-finger tap opens the clipboard history: text, images, files.'),
      },
      {
        scene: 'padplus-settings',
        title: t('Каждый жест — под себя', 'Every gesture, your way'),
        text: t('На жест — встроенное действие, своё сочетание клавиш или запуск программы. Длительность тапа, размеры углов и полос, шаг громкости и скорость прокрутки настраиваются на живой схеме трекпада, где видны пальцы. В играх и графических редакторах Pad+ не трогает трекпад.', 'Give a gesture a built-in action, your own shortcut or an app to launch. Tap length, corner and strip sizes, volume step and scroll speed are tuned on a live trackpad diagram that shows your fingers. In games and graphics editors Pad+ leaves the trackpad alone.'),
      },
      {
        scene: 'padplus-welcome',
        title: t('Знакомство с первого запуска', 'An intro from the first launch'),
        text: t('Короткая презентация покажет жесты, а у каждого в настройках есть анимация: наведите на строку — слева покажется, как его делать. Тема, цвет подсветки, три значка для строки меню и подсказка на экране, какой жест сработал.', 'A short intro walks through the gestures, and each one has an animation in settings: hover a row and the left side shows how to do it. Theme, highlight colour, three menu-bar icons and an on-screen hint of which gesture fired.'),
      },
      {
        scene: 'padplus-installer',
        title: t('Установка и обновления', 'Install and updates'),
        text: t('Образ с окном установки: перетащите Pad+ в «Программы». Дальше он обновляется сам: раз в четыре часа сверяет SHA-256 и подпись. Настройки дублируются в файл и переживают переустановку; перенос на другой Mac — «Экспорт / Импорт».', 'A disk image with an install window: drag Pad+ to Applications. After that it updates itself, checking the SHA-256 and signature every four hours. Settings are mirrored to a file and survive reinstalling; move to another Mac with Export / Import.'),
      },
    ],
    steps: [
      t('Скачайте Pad+ и перетащите его в «Программы».', 'Download Pad+ and drag it to Applications.'),
      t('Разрешите «Универсальный доступ» — без него жесты видны, но клавиши и окна Pad+ не трогает.', 'Allow Accessibility — without it Pad+ sees gestures but can’t press keys or move windows.'),
      t('Проведите пальцем вдоль правого края трекпада — страница прокрутится.', 'Slide a finger along the right edge of the trackpad — the page scrolls.'),
    ],
    faq: [
      { q: t('Зачем нужен «Универсальный доступ»?', 'Why does it need Accessibility?'), a: t('Чтобы нажимать клавиши, кликать в углах и двигать окна за вас. Без него Pad+ видит жесты, но ничего не делает.', 'To press keys, click corners and move windows for you. Without it Pad+ sees the gestures but can’t act on them.') },
      { q: t('Какие жесты есть?', 'Which gestures are there?'), a: t('Края трекпада, клики в углах, тапы тремя, четырьмя и пятью пальцами, двойной тап тремя (фиксация перетаскивания), тип-тап, свайпы по кромкам и жесты окон: свайп двумя пальцами по заголовку ставит окно на половину экрана.', 'Trackpad edges, corner clicks, three-, four- and five-finger taps, a double three-finger tap (drag lock), type-tap, edge swipes and window gestures: a two-finger swipe on a title bar snaps the window to half the screen.') },
      { q: t('Что будет с настройками, если удалить Pad+?', 'What happens to my settings if I delete Pad+?'), a: t('Они лежат в файле ~/Library/Application Support/Ehroz/Pad+/settings.json и остаются. После повторной установки Pad+ всё восстановит сам.', 'They live in ~/Library/Application Support/Ehroz/Pad+/settings.json and stay. After reinstalling, Pad+ restores everything.') },
    ],
    requirements: [t('macOS 13 Ventura и новее', 'macOS 13 Ventura or later'), t('Apple Silicon и Intel', 'Apple Silicon and Intel'), t('Трекпад Apple', 'An Apple trackpad')],
  },
  {
    slug: 'moss-pocket',
    name: 'Moss Pocket',
    short: t('Папка «Загрузки» рядом с Dock', 'Your Downloads, right next to the Dock'),
    tagline: t('Панель справа от Dock, которая выглядит как его продолжение.', 'A panel to the right of the Dock that looks like part of it.'),
    about: t(
      'Moss Pocket показывает содержимое папки — по умолчанию «Загрузки» — в панели справа от Dock. Файлы можно вытаскивать из неё в любые приложения, бросать в неё и отправлять в Корзину. Панель сама читает настройки Dock: размер значков, увеличение, автоскрытие — и подстраивается под них.',
      'Moss Pocket shows a folder — Downloads by default — in a panel to the right of the Dock. Drag files out into any app, drop files in, or send them to the Trash. The panel reads your Dock settings — icon size, magnification, auto-hide — and follows them.',
    ),
    audience: t('Тем, кто постоянно что-то скачивает и не хочет каждый раз открывать Finder.', 'People who download all day and are tired of opening Finder.'),
    platforms: ['macos'],
    status: 'dev',
    updated: '2026-10-28',
    version: '0.1.0',
    accent: '#9CCB7A',
    onAccent: '#0E0E0F',
    glow: ['#5e8f55', '#2b5534', '#1b2a1d'],
    tint: { dark: '#9CCB7A', light: '#3F6B2A' },
    kind: t('Полка у Dock', 'Shelf by the Dock'),
    links: [{ kind: 'contact', href: 'https://t.me/hhrrzz1', label: t('Узнать о выходе', 'Get notified') }],
    features: [
      {
        scene: 'moss-panel',
        title: t('Как продолжение Dock', 'Part of the Dock'),
        text: t('Панель стоит вплотную к Dock и повторяет его стекло и размер. Новые загрузки появляются в ней сразу.', 'The panel sits right next to the Dock and matches its glass and size. New downloads appear in it instantly.'),
      },
      {
        scene: 'moss-drag',
        title: t('Перетаскивание', 'Drag and drop'),
        text: t('Тащите файлы из панели в Telegram, письмо или Figma, бросайте в неё вложения из Почты и картинки из браузера, ⌘⌫ — в Корзину.', 'Drag files from the panel into Telegram, mail or Figma, drop in mail attachments and images from the browser, ⌘⌫ to trash.'),
      },
      {
        scene: 'moss-magnify',
        title: t('Увеличение, как у Dock', 'Magnifies like the Dock'),
        text: t('Если в Dock включено увеличение, значки панели увеличиваются так же, а панель отъезжает вслед за краем Dock без перекрытия.', 'If Dock magnification is on, the panel icons magnify the same way and the panel follows the Dock edge without overlapping.'),
      },
    ],
    steps: [
      t('Запустите Moss Pocket и разрешите доступ к папке «Загрузки».', 'Launch Moss Pocket and allow access to Downloads.'),
      t('Панель встанет справа от Dock и подстроится под его размер.', 'The panel docks to the right of the Dock and matches its size.'),
      t('Тащите файлы из панели куда угодно, Quick Look — по пробелу.', 'Drag files anywhere; Space opens Quick Look.'),
    ],
    faq: [
      { q: t('Можно показывать другую папку?', 'Can it show another folder?'), a: t('Да: правый клик по панели → «Папка», в строке меню или в настройках. Папки можно закреплять.', 'Yes: right-click the panel → Folder, from the menu bar or in settings. Folders can be pinned.') },
      { q: t('Нужен «Универсальный доступ»?', 'Does it need Accessibility?'), a: t('Не обязательно. С ним панель берёт точную рамку Dock, без него — считает её по составу Dock.', 'No. With it the panel reads the exact Dock frame; without it, it calculates the frame from the Dock’s contents.') },
      { q: t('А если Dock сбоку?', 'What if the Dock is on the side?'), a: t('Пока панель умеет только Dock внизу; при боковом Dock она встаёт в правый нижний угол.', 'For now it supports a bottom Dock only; with a side Dock it sits in the bottom-right corner.') },
    ],
    requirements: [t('macOS 14 Sonoma и новее', 'macOS 14 Sonoma or later'), t('Apple Silicon и Intel', 'Apple Silicon and Intel')],
  },
  {
    slug: 'peecube',
    name: 'Peecube',
    short: t('Ссылка — в окне поверх страницы', 'Links in a window over the page'),
    tagline: t('Зажмите ⌥ и нажмите правой кнопкой по ссылке. Посмотрели — кликнули мимо, и вы там же, где были.', 'Hold ⌥ and right-click a link. Done reading — click outside and you’re back where you were.'),
    about: t(
      'Peecube открывает ссылки во всплывающем окне рядом с курсором — из браузера, Telegram и других приложений. В окне есть вкладки, блокировка рекламы и cookie-баннеров, перевод, анализ страницы, скачивание фото и видео. Для Firefox и Chrome есть расширения с теми же функциями, в том числе на Android.',
      'Peecube opens links in a pop-up window next to the cursor — from the browser, Telegram and other apps. The window has tabs, ad and cookie-banner blocking, translation, page analysis and photo and video downloads. Firefox and Chrome extensions do the same, including Firefox on Android.',
    ),
    audience: t('Тем, кто читает ссылки из чатов и не хочет терять место на странице.', 'People who open links from chats and don’t want to lose their place.'),
    platforms: ['macos', 'extension'],
    status: 'ready',
    updated: '2026-11-04',
    version: '4.1',
    accent: '#F0EAD6',
    onAccent: '#0E0E0F',
    glow: ['#2b2b30', '#5a5a64', '#16161a'],
    tint: { dark: '#F0EAD6', light: '#3B3A35' },
    kind: t('Окно для ссылок', 'Link pop-up'),
    links: [
      { kind: 'download', install: 'mac', href: 'https://github.com/ehroz1/peecube-releases/releases/latest/download/Peecube.dmg', label: t('Скачать для Mac', 'Download for Mac') },
      { kind: 'open', href: 'https://addons.mozilla.org/ru/firefox/addon/peecube/', label: t('Расширение для Firefox', 'Firefox extension') },
      { kind: 'download', install: 'chrome', href: 'https://github.com/ehroz1/peecube-releases/releases/latest/download/Peecube-Chrome.zip', label: t('Расширение для Chrome', 'Chrome extension') },
    ],
    features: [
      {
        scene: 'peecube-popup',
        title: t('Ссылка — поверх страницы', 'A link over the page'),
        text: t('⌥ + правый клик по ссылке в Telegram или браузере — окно открывается рядом с курсором. Esc или клик мимо — закрыть, ⌘↩ — в обычную вкладку, ⌘⇧P — закрепить.', '⌥ + right-click a link in Telegram or the browser — a window opens by the cursor. Esc or click outside to close, ⌘↩ to move it to a tab, ⌘⇧P to pin.'),
      },
      {
        scene: 'peecube-analysis',
        title: t('Шрифты, цвета, технологии', 'Fonts, colours, tech'),
        text: t('«Анализ страницы» показывает шрифты, цвета (клик копирует), технологии сайта и вес картинок с советами, как облегчить.', 'Page analysis shows fonts, colours (click to copy), the site’s tech and image weights with tips to slim it down.'),
      },
      {
        scene: 'peecube-media',
        title: t('Все фото и видео страницы', 'Every photo and video on the page'),
        text: t('Скачивание картинок и видео с понятными именами, HLS-видео, WebP и AVIF — сразу в PNG или JPG.', 'Download images and video with clear names, HLS streams, WebP and AVIF straight to PNG or JPG.'),
      },
      {
        scene: 'peecube-features',
        title: t('Десятки функций', 'Dozens of features'),
        text: t('Блокировка рекламы и cookie-баннеров, автоотказ от cookie, перевод, QR-коды, скриншот всей страницы, слежение за сайтами. Включайте нужное.', 'Ad and cookie-banner blocking, automatic cookie refusal, translation, QR codes, full-page screenshots, site watching. Turn on what you need.'),
      },
    ],
    steps: [
      t('Скачайте Peecube.dmg и перетащите Peecube в «Программы». Первый запуск — правый клик → «Открыть».', 'Download Peecube.dmg and drag Peecube to Applications. On first launch, right-click → Open.'),
      t('Пройдите короткую настройку и сделайте Peecube браузером по умолчанию — он начнёт ловить ссылки из Telegram.', 'Go through the short setup and make Peecube your default browser so it catches links from Telegram.'),
      t('Зажмите ⌥ и нажмите правой кнопкой по ссылке. Посмотрели — кликнули мимо, и вы там же, где были.', 'Hold ⌥ and right-click a link. Done reading — click outside and you’re back where you were.'),
    ],
    faq: [
      { q: t('Это платно?', 'Is it paid?'), a: t('14 дней — бесплатно и без ограничений. Дальше — один ключ навсегда: разовая покупка, все будущие обновления включены. Ключ вводится в «Настройки → Лицензия». Когда пробный период закончится, ссылки по-прежнему будут открываться — в вашем обычном браузере.', 'Free for 14 days with every feature. After that, one key for good: a one-time purchase with all future updates included. Enter it in Settings → License. When the trial ends, links still open — in your regular browser.') },
      { q: t('Работает со ссылками из Telegram?', 'Does it work with Telegram links?'), a: t('Да, это умеет приложение для Mac. Расширение для Firefox работает только внутри браузера.', 'Yes, the Mac app does. The Firefox extension works inside the browser only.') },
      { q: t('Как поставить расширение?', 'How do I install the extension?'), a: t('Firefox (142+, в том числе на Android): нажмите «Расширение для Firefox» и установите его из каталога Mozilla. Chrome, Edge, Brave, Arc (Chrome 137+): скачайте архив, распакуйте в постоянную папку, откройте chrome://extensions, включите «Режим разработчика» и нажмите «Загрузить распакованное». Один ключ работает и в приложении, и в расширениях.', 'Firefox (142+, including Android): click Firefox extension and install it from the Mozilla add-ons catalog. Chrome, Edge, Brave, Arc (Chrome 137+): download the archive, unpack it to a permanent folder, open chrome://extensions, turn on Developer mode and click Load unpacked. One key works in the app and in the extensions.') },
      { q: t('Как обновляется?', 'How does it update?'), a: t('Сам: каждое обновление подписано автором, а Peecube проверяет, что его файлы никто не изменил.', 'By itself: every update is signed by the author, and Peecube checks that its files haven’t been changed.') },
    ],
    requirements: [t('macOS 13 Ventura или новее, Apple Silicon и Intel', 'macOS 13 Ventura or later, Apple Silicon and Intel'), t('Firefox 142+ или Chrome 137+ (Edge, Brave, Arc) — для расширения', 'Firefox 142+ or Chrome 137+ (Edge, Brave, Arc) — for the extension')],
  },
  {
    slug: 'any-camera',
    name: 'ANY CAMERA',
    short: t('Видео или фото вместо веб-камеры', 'A video or photo instead of your webcam'),
    tagline: t('Сайты получают выбранное вами видео (по кругу) или фото вместо потока с веб-камеры.', 'Websites get the video (on a loop) or photo you choose instead of the webcam stream.'),
    about: t(
      'ANY CAMERA — виртуальная камера в виде расширения браузера. Пока подмена включена, сайт видит одну камеру «ANY CAMERA» и получает ваш файл; микрофон остаётся настоящим. Без файла сайт получает тестовую картинку — удобно проверять, как сервис работает с камерой. Один код для Chrome и Firefox: на Mac в Chrome, Arc, Brave и Edge она ставится установщиком .pkg и обновляется сама, в Firefox — на компьютере и на Android.',
      'ANY CAMERA is a virtual camera as a browser extension. While it’s on, a site sees one camera called “ANY CAMERA” and gets your file; the microphone stays real. With no file, the site gets a test card — handy for checking how a service handles the camera. One codebase for Chrome and Firefox: on Mac it installs into Chrome, Arc, Brave and Edge with a .pkg and updates itself; Firefox works on desktop and Android.',
    ),
    audience: t('Разработчикам и тестировщикам сервисов с камерой, а ещё тем, кто ведёт демо и презентации.', 'Developers and testers of camera features, and anyone running demos and presentations.'),
    platforms: ['extension'],
    status: 'ready',
    updated: '2026-11-12',
    version: '1.1.0',
    accent: '#FF7AA8',
    onAccent: '#0E0E0F',
    glow: ['#5b3cf0', '#8b2fe0', '#f0407f'],
    tint: { dark: '#FF7AA8', light: '#B0245A' },
    kind: t('Виртуальная камера', 'Virtual camera'),
    links: [
      { kind: 'download', install: 'pkg', href: 'https://github.com/ehroz1/any-camera-releases/releases/latest/download/ANY-CAMERA.pkg', label: t('Скачать для Mac', 'Download for Mac') },
      { kind: 'download', install: 'chrome', href: 'https://github.com/ehroz1/any-camera-releases/releases/latest/download/ANY-CAMERA.zip', label: t('Расширение (.zip)', 'Extension (.zip)') },
    ],
    features: [
      {
        scene: 'anycam-call',
        title: t('Любой файл — как камера', 'Any file as a camera'),
        text: t('Сайт запрашивает камеру — и получает выбранное видео по кругу или фото. Разрешение и частота кадров берутся из запроса сайта, но не выше выбранных.', 'A site asks for the camera and gets your looping video or photo. Resolution and frame rate follow the site’s request, capped by your settings.'),
      },
      {
        scene: 'anycam-popup',
        title: t('Всё в одном окне', 'All in one pop-up'),
        text: t('Переключатель «Подменять камеру», выбор файла, разрешение 480p / 720p / 1080p, 15 / 24 / 30 кадров и зеркало. На вкладке сайта видно, сработала ли подмена.', 'A “Replace camera” switch, file picker, 480p / 720p / 1080p, 15 / 24 / 30 fps and mirroring. The pop-up shows whether the current site is getting the replacement.'),
      },
      {
        scene: 'anycam-test',
        title: t('Тестовая картинка', 'A test card'),
        text: t('Без файла сайт получает цветные полосы и время — сразу видно, что камера подменяется и поток идёт.', 'With no file the site gets colour bars and a clock — you see at once that the stream is replaced and running.'),
      },
    ],
    steps: [
      t('Скачайте установщик .pkg для Mac (Chrome, Arc, Brave, Edge) или поставьте расширение в Firefox.', 'Download the .pkg for Mac (Chrome, Arc, Brave, Edge) or install the extension in Firefox.'),
      t('Нажмите значок ANY CAMERA → «Выбрать видео или фото».', 'Click the ANY CAMERA icon → “Choose video or photo”.'),
      t('Включите подмену и включите камеру на сайте.', 'Turn the replacement on and enable the camera on the site.'),
    ],
    faq: [
      { q: t('Звук тоже подменяется?', 'Is audio replaced too?'), a: t('Нет. Видео играет без звука, а если сайт просит микрофон, используется настоящий.', 'No. Video plays muted, and if a site asks for a microphone, the real one is used.') },
      { q: t('Какие браузеры?', 'Which browsers?'), a: t('Firefox 128+ на компьютере и Android, Chrome 111+ и другие Chromium-браузеры на Mac.', 'Firefox 128+ on desktop and Android, Chrome 111+ and other Chromium browsers on Mac.') },
      { q: t('Какие файлы подходят?', 'Which files work?'), a: t('Видео H.264 MP4 или WebM и обычные фото. HEVC и HEIC лучше перекодировать.', 'H.264 MP4 or WebM video and regular photos. HEVC and HEIC are best converted first.') },
    ],
    requirements: [t('Firefox 128+ (компьютер или Android)', 'Firefox 128+ (desktop or Android)'), t('или Chrome 111+ на Mac', 'or Chrome 111+ on Mac')],
  },
  {
    slug: 'snowpuff',
    name: 'Snowpuff',
    short: t('Тёплый снег на рабочем столе Mac и Windows', 'Cozy snow on your Mac and Windows desktop'),
    tagline: t('Снег падает, оседает на окнах и Dock и разлетается от курсора.', 'Snow falls, settles on your windows and Dock, and scatters from your cursor.'),
    about: t(
      'Snowpuff — снегопад поверх рабочего стола macOS и Windows. Снег копится сугробами на окнах, Dock и панели задач, под окнами растут сосульки, активное окно светится тёплым светом. Есть режимы дождя и осенних листьев. Можно подуть в микрофон, и снег разлетится. На созвонах снег прячется сам, а новые версии ставятся автоматически.',
      'Snowpuff is a snowfall on top of your macOS or Windows desktop. Snow piles up on windows, the Dock and the taskbar, icicles grow under windows, and the active window glows warm. There are rain and autumn-leaves modes too. Blow into the microphone and the snow flies away. It hides itself during calls and installs new versions automatically.',
    ),
    audience: t('Всем, кому зимой хочется уюта прямо на экране, без лишних окон и настроек.', 'Anyone who wants a cozy winter right on their screen, with no extra windows or setup.'),
    platforms: ['macos', 'windows'],
    status: 'ready',
    updated: '2026-11-12',
    version: '1.2.0',
    accent: '#FFD27E',
    onAccent: '#1E110B',
    glow: ['#7D4426', '#E98F3E', '#2A170E'],
    tint: { dark: '#FFD27E', light: '#9C3A28' },
    kind: t('Снег на рабочем столе', 'Desktop snow'),
    links: [
      { kind: 'download', install: 'mac', href: 'https://github.com/ehroz1/Snowpuff/releases/latest/download/Snowpuff.dmg', label: t('Скачать для Mac', 'Download for Mac') },
      { kind: 'download', install: 'win', href: 'https://github.com/ehroz1/Snowpuff/releases/latest/download/Snowpuff-Setup.exe', label: t('Скачать для Windows', 'Download for Windows') },
      { kind: 'github', href: 'https://github.com/ehroz1/Snowpuff', label: t('GitHub', 'GitHub') },
    ],
    features: [
      {
        scene: 'snowpuff-desktop',
        title: t('Снег, который оседает', 'Snow that settles'),
        text: t(
          'Лёгкий, ровный, метель или переменный снегопад. Снег копится сугробами на окнах, Dock и панели задач Windows, тает и разлетается, если провести по нему курсором.',
          'Light, steady, heavy or variable snowfall. Snow piles up on windows, the Dock and the Windows taskbar, melts, and scatters when you sweep the cursor through it.',
        ),
      },
      {
        scene: 'snowpuff-icicles',
        title: t('Сосульки', 'Icicles'),
        text: t(
          'Под окнами со снегом растут сосульки. Дёрните окно, закройте или сверните его — они слетят и разобьются.',
          'Icicles grow under windows with snow on them. Shake, close or minimise the window and they fall off and shatter.',
        ),
      },
      {
        scene: 'snowpuff-glow',
        title: t('Тёплый свет окна', 'Warm window light'),
        text: t(
          'Активное окно светится, как окно на иконке Snowpuff, и снег рядом с ним теплеет. Переключились на другое — свет переходит следом.',
          'The active window glows like the window on the Snowpuff icon, and nearby snow turns warm. Switch windows and the light follows.',
        ),
      },
      {
        scene: 'snowpuff-menu',
        title: t('Подуть на снег', 'Blow on the snow'),
        text: t(
          'Включите в меню микрофон и подуйте — снег разлетится. Звук только проверяется на дуновение и не записывается. Там же звук ветра, камина или обоих сразу, он синтезируется на лету.',
          'Turn on the microphone in the menu and blow — the snow flies away. Audio is only checked for a puff and never recorded. The same menu has wind, fireplace or both, synthesised on the fly.',
        ),
      },
      {
        scene: 'snowpuff-calls',
        title: t('Прячется на созвонах', 'Hides during calls'),
        text: t(
          'Когда другое приложение включает камеру или микрофон, снег и звук плавно исчезают и возвращаются после звонка. Обновление тоже ждёт конца созвона.',
          'When another app turns on the camera or microphone, the snow and sound fade away and come back after the call. Updates wait for the call to end too.',
        ),
      },
    ],
    steps: [
      t('Скачайте Snowpuff.dmg для Mac или Snowpuff-Setup.exe для Windows. Права администратора не нужны.', 'Download Snowpuff.dmg for Mac or Snowpuff-Setup.exe for Windows. No admin rights needed.'),
      t('На Mac откройте Snowpuff из образа — он сам переедет в «Программы». На Windows запустите установщик.', 'On a Mac, open Snowpuff from the disk image — it moves itself to Applications. On Windows, run the installer.'),
      t('Снежинка в строке меню или в трее — снегопад, сугробы, сосульки, звук и микрофон. Дальше Snowpuff обновляется сам.', 'The snowflake in the menu bar or tray holds snowfall, drifts, icicles, sound and the microphone. Snowpuff keeps itself up to date.'),
    ],
    faq: [
      { q: t('macOS или Windows не дают запустить Snowpuff', 'macOS or Windows won’t run Snowpuff'), a: t('Приложение не подписано платным сертификатом. На Mac: «Системные настройки → Конфиденциальность и безопасность → Всё равно открыть», один раз. На Windows в окне SmartScreen: «Подробнее → Выполнить в любом случае».', 'The app isn’t signed with a paid certificate. On a Mac: System Settings → Privacy & Security → Open Anyway, once. On Windows, in the SmartScreen window: More info → Run anyway.') },
      { q: t('Микрофон что-то записывает?', 'Does the microphone record anything?'), a: t('Нет. Микрофон нужен только для «Подуть на снег» и включается в меню. Звук проверяется на дуновение и никуда не отправляется.', 'No. The microphone is only for “Blow on the Snow” and is turned on in the menu. Audio is checked for a puff and never sent anywhere.') },
      { q: t('Как обновляется?', 'How does it update?'), a: t('Сам: раз в несколько часов проверяет релизы на GitHub, скачивает новую версию, сверяет SHA-256 и перезапускается. Во время созвона ждёт. Выключается пунктом «Обновлять автоматически».', 'By itself: every few hours it checks GitHub releases, downloads the new version, verifies its SHA-256 and restarts. During a call it waits. Turn it off with “Update Automatically”.') },
      { q: t('Снег не будет мешать работать?', 'Won’t the snow get in the way?'), a: t('Можно убрать его за окна пунктом «За окнами», спрятать со скриншотов или смести весь снег одной командой.', 'You can move it behind windows with “Behind Windows”, hide it from screenshots or clear all the snow in one click.') },
      { q: t('Код открыт?', 'Is it open source?'), a: t('Да, по лицензии MIT. Snowpuff основан на Snowhush (MIT, © Mykhailo Bezruchko).', 'Yes, under the MIT license. Snowpuff is based on Snowhush (MIT, © Mykhailo Bezruchko).') },
    ],
    requirements: [t('macOS 14 Sonoma и новее — Apple Silicon и Intel', 'macOS 14 Sonoma or later — Apple Silicon and Intel'), t('Windows 10 и 11', 'Windows 10 and 11'), t('Микрофон — только для «Подуть на снег»', 'A microphone — only for “Blow on the Snow”')],
    openSource: true,
  },
];

/** Дата последнего изменения главной (герой, тексты). Итоговая дата главной — самая поздняя из этой и дат приложений. */
export const HOME_UPDATED = '2026-10-28';
export const homeUpdated = () => [HOME_UPDATED, ...apps.map((a) => a.updated)].sort().at(-1)!;

export const appBySlug = (slug: string) => apps.find((a) => a.slug === slug);
