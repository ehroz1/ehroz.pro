/**
 * Инструкции первого запуска, которые показываются в окне после нажатия «Скачать».
 * Приложения Ehroz не подписаны сертификатом Apple (и Windows), поэтому системы предупреждают при первом запуске.
 * Тип инструкции задаётся в `links[].install` в src/content/apps.ts. Текст `{app}` заменяется на имя приложения.
 */
import type { L } from './apps';

export type InstallKind = 'mac' | 'mac-zip' | 'pkg' | 'win' | 'chrome';

export interface InstallGuide {
  title: L;
  lead: L;
  steps: L[];
  /** Дополнительная подсказка под шагами. */
  note?: L;
  /** Команда для Терминала (показывается моноширинным блоком). `{app}` — имя приложения. */
  command?: string;
  commandNote?: L;
}

const t = (ru: string, en: string): L => ({ ru, en });

const macLead = t(
  '{app} пока без подписи Apple, поэтому при первом запуске macOS спросит подтверждение. Это делается один раз.',
  '{app} isn’t signed with an Apple certificate yet, so macOS asks for confirmation on first launch. You only do this once.',
);
const macTail: L[] = [
  t('Правый клик (или Control + клик) по {app} в «Программах» → «Открыть».', 'Right-click (or Control-click) {app} in Applications → Open.'),
  t('В окне с предупреждением нажмите «Открыть».', 'In the warning dialog, click Open.'),
  t(
    'Нет кнопки «Открыть»? Системные настройки → «Конфиденциальность и безопасность», прокрутите вниз → «Всё равно открыть» и введите пароль.',
    'No Open button? System Settings → Privacy & Security, scroll down → Open Anyway and enter your password.',
  ),
];
const macCommand = {
  command: 'xattr -dr com.apple.quarantine "/Applications/{app}.app"',
  commandNote: t(
    'macOS пишет, что приложение «повреждено»? Вставьте эту команду в Терминал и нажмите Return — она снимает карантин с файла.',
    'macOS says the app is “damaged”? Paste this into Terminal and press Return — it removes the quarantine flag.',
  ),
};

export const INSTALL: Record<InstallKind, InstallGuide> = {
  mac: {
    title: t('Скачивание {app} началось', '{app} is downloading'),
    lead: macLead,
    steps: [t('Откройте скачанный .dmg (он в «Загрузках») и перетащите {app} в «Программы».', 'Open the downloaded .dmg (it’s in Downloads) and drag {app} to Applications.'), ...macTail],
    ...macCommand,
  },
  'mac-zip': {
    title: t('Скачивание {app} началось', '{app} is downloading'),
    lead: macLead,
    steps: [t('Откройте скачанный .zip (он в «Загрузках») и перенесите {app} в «Программы».', 'Open the downloaded .zip (it’s in Downloads) and move {app} to Applications.'), ...macTail],
    ...macCommand,
  },
  pkg: {
    title: t('Скачивание {app} началось', '{app} is downloading'),
    lead: t(
      'Установщик пока без подписи Apple, поэтому macOS спросит подтверждение. Пароль администратора не нужен — всё ставится в вашу папку.',
      'The installer isn’t signed with an Apple certificate yet, so macOS asks for confirmation. No admin password needed — everything goes into your home folder.',
    ),
    steps: [
      t('Правый клик (или Control + клик) по скачанному .pkg → «Открыть» → «Открыть».', 'Right-click (or Control-click) the downloaded .pkg → Open → Open.'),
      t('Не пускает? Системные настройки → «Конфиденциальность и безопасность» → «Всё равно открыть».', 'Blocked? System Settings → Privacy & Security → Open Anyway.'),
      t(
        'После установки откроется страница расширений Chrome, а путь к папке уже в буфере: включите «Режим разработчика» → «Загрузить распакованное расширение» → ⌘⇧G, ⌘V, Return → «Выбрать».',
        'When it finishes, Chrome’s extensions page opens with the folder path already on your clipboard: turn on Developer mode → Load unpacked → ⌘⇧G, ⌘V, Return → Select.',
      ),
    ],
    note: t('Это нужно один раз — дальше расширение обновляется само.', 'You only do this once — after that the extension updates itself.'),
  },
  win: {
    title: t('Скачивание {app} началось', '{app} is downloading'),
    lead: t(
      'У {app} пока нет подписи Windows, поэтому SmartScreen может показать предупреждение. Это нормально для приложений без сертификата.',
      '{app} isn’t signed for Windows yet, so SmartScreen may show a warning. That’s normal for apps without a certificate.',
    ),
    steps: [
      t('Откройте скачанный .exe.', 'Open the downloaded .exe.'),
      t('В синем окне «Windows защитила ваш компьютер» нажмите «Подробнее».', 'In the blue “Windows protected your PC” window, click More info.'),
      t('Нажмите «Выполнить в любом случае» и пройдите установку.', 'Click Run anyway and go through the installer.'),
    ],
    note: t(
      'Браузер тоже может предупредить о «редко скачиваемом файле»: в Edge нажмите «…» → «Сохранить» → «Все равно сохранить», в Chrome — «Сохранить».',
      'Your browser may also warn about an “uncommon download”: in Edge click … → Keep → Keep anyway, in Chrome click Keep.',
    ),
  },
  chrome: {
    title: t('Скачивание расширения {app} началось', 'The {app} extension is downloading'),
    lead: t(
      'Расширение ставится вручную, как «распакованное»: так работает любое расширение вне Chrome Web Store.',
      'The extension installs manually as an “unpacked” extension — that’s how any extension outside the Chrome Web Store works.',
    ),
    steps: [
      t('Распакуйте архив в постоянную папку и не удаляйте её — Chrome читает расширение оттуда.', 'Unzip the archive into a permanent folder and keep it — Chrome reads the extension from there.'),
      t('Откройте chrome://extensions и включите «Режим разработчика» (справа вверху).', 'Open chrome://extensions and turn on Developer mode (top right).'),
      t('Нажмите «Загрузить распакованное расширение» и выберите папку.', 'Click Load unpacked and pick the folder.'),
    ],
    note: t('Подойдёт Chrome 137+, а также Edge, Brave и Arc.', 'Works in Chrome 137+, as well as Edge, Brave and Arc.'),
  },
};
