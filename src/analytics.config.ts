/**
 * Аналитика. Пока ID пустые — на сайт не загружается ни одного счётчика, cookies нет.
 * Впишите ID — появится плашка согласия; GA4 и Метрика загрузятся только после «Разрешить».
 *
 * GA4: analytics.google.com → Администратор → Потоки данных → Веб → «Идентификатор потока» (G-XXXXXXXXXX).
 * Яндекс Метрика: metrika.yandex.ru → Добавить счётчик → номер счётчика (только цифры).
 * Политика безопасности (CSP) сама разрешит домены счётчиков, если ID заданы.
 */
export const ANALYTICS = {
  ga4: '',
  metrika: '',
};

export const analyticsEnabled = () => Boolean(ANALYTICS.ga4 || ANALYTICS.metrika);
