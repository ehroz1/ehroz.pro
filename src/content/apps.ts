/**
 * Все продукты витрины — в одном месте.
 * Новое приложение: скопируйте любой объект ниже, поменяйте поля, положите иконку
 * в assets-src/icons/<slug>.png и выполните `npm run icons`.
 * Сцены (поле `scene`) — компоненты из src/components/scenes; для нового приложения
 * можно взять 'generic', он рисует подпись фичи на фоне акцентного цвета.
 */

export type Lang = 'ru' | 'en';
export type L = { ru: string; en: string };
export type Platform = 'macos' | 'windows' | 'web';
export type Status = 'ready' | 'beta' | 'dev';

export interface Feature {
  title: L;
  text: L;
  /** id сцены из src/components/scenes/index.ts */
  scene: string;
}

export interface AppLink {
  kind: 'download' | 'open' | 'github' | 'releases';
  href: string;
  label: L;
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
  version?: string;
  /** Цвет кнопок и подсветки на странице. */
  accent: string;
  /** Цвет текста на кнопке с акцентом. */
  onAccent: string;
  /** Три цвета «обоев» страницы приложения (из иконки или интерфейса). */
  glow: [string, string, string];
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
    version: '0.2.2',
    accent: '#f5f5f7',
    onAccent: '#1d1d1f',
    glow: ['#5b4a9c', '#2b6f8c', '#9c4a6b'],
    links: [
      { kind: 'download', href: 'https://github.com/ehroz1/morfus-releases/releases/latest', label: t('Скачать для Mac', 'Download for Mac') },
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
    version: '3.3',
    accent: '#ffffff',
    onAccent: '#000000',
    glow: ['#3a3a44', '#6c6c7a', '#22222a'],
    links: [
      { kind: 'download', href: 'https://github.com/ehroz1/morfu-releases/releases/latest', label: t('Скачать для Mac', 'Download for Mac') },
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
    status: 'beta',
    version: '0.1.1',
    accent: '#4f6bff',
    onAccent: '#ffffff',
    glow: ['#4fa8ff', '#3b5bff', '#5a2fd6'],
    links: [{ kind: 'releases', href: 'https://github.com/ehroz1/pachaq-releases/releases', label: t('Страница релизов', 'Releases page') }],
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
      t('Скачайте установщик для Mac или Windows со страницы релизов.', 'Download the installer for Mac or Windows from the releases page.'),
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
    accent: '#ff5b2e',
    onAccent: '#ffffff',
    glow: ['#ff5b2e', '#6b3a2a', '#2a2a33'],
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
    short: t('Локальное удаление фона на Mac', 'Local background removal on Mac'),
    tagline: t('Фон убирается на вашем Mac, без загрузки в облако.', 'Backgrounds removed on your Mac, nothing uploaded.'),
    about: t(
      'radius — локальное удаление фона для macOS. Работает на модели BiRefNet HR-matting, переведённой в Core ML: на вход картинка 2048×2048, на выходе — альфа-маска с мягкими краями. В разработке; модели уже опубликованы.',
      'radius is local background removal for macOS. It runs BiRefNet HR-matting converted to Core ML: a 2048×2048 image in, a soft-edged alpha matte out. In development; the models are already published.',
    ),
    audience: t('Дизайнерам и всем, кто вырезает объекты с фото.', 'Designers and anyone cutting objects out of photos.'),
    platforms: ['macos'],
    status: 'dev',
    accent: '#d4d7e0',
    onAccent: '#101114',
    glow: ['#3a3f4b', '#7c8394', '#1b1e25'],
    links: [{ kind: 'github', href: 'https://github.com/ehroz1/radius-models', label: t('Модели Core ML', 'Core ML models') }],
    features: [
      {
        scene: 'radius-matte',
        title: t('Мягкая альфа-маска', 'A soft alpha matte'),
        text: t('Не «ножницы», а маска с прозрачностью от 0 до 1: волосы и полупрозрачные края остаются живыми.', 'Not a hard cut but a matte from 0 to 1: hair and translucent edges stay natural.'),
      },
      {
        scene: 'radius-local',
        title: t('Только на устройстве', 'On-device only'),
        text: t('Core ML в формате fp16: нормализация и сигмоида встроены в модель, фото не покидает Mac.', 'Core ML in fp16 with normalisation and sigmoid baked in — the photo never leaves your Mac.'),
      },
    ],
    steps: [
      t('Откройте фото.', 'Open a photo.'),
      t('Модель строит альфа-маску 2048×2048.', 'The model builds a 2048×2048 alpha matte.'),
      t('Сохраните PNG с прозрачным фоном.', 'Save a PNG with a transparent background.'),
    ],
    faq: [
      { q: t('Какая модель внутри?', 'Which model is inside?'), a: t('BiRefNet HR-matting (MIT), переведённая в Core ML через coremltools 9.', 'BiRefNet HR-matting (MIT), converted to Core ML with coremltools 9.') },
      { q: t('Когда выйдет приложение?', 'When does the app ship?'), a: t('Пока в разработке. Модели уже лежат в открытом репозитории.', 'Still in development. The models are already in a public repository.') },
    ],
    requirements: [t('macOS', 'macOS'), t('Core ML', 'Core ML')],
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
    accent: '#ededed',
    onAccent: '#171717',
    glow: ['#3d3d3d', '#1f8a5b', '#5c5c5c'],
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
    accent: '#ffffff',
    onAccent: '#101114',
    glow: ['#7c5cff', '#06b6d4', '#ff6428'],
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
];

export const appBySlug = (slug: string) => apps.find((a) => a.slug === slug);
