'use client';

import { Section } from "@/app/ui/structure/struct";
import s from "./s.module.css";
import { Dashboard_Layout } from "./layouts/layout";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Полный справочник статус-кодов (4xx, 5xx и служебные)
const errorReference = {
    400: { title: "Bad Request", description: "Некорректный запрос (синтаксическая ошибка)." },
    401: { title: "Unauthorized", description: "Требуется аутентификация (логин/пароль)." },
    402: { title: "Payment Required", description: "Зарезервировано для будущих платежных систем." },
    403: { title: "Forbidden", description: "Доступ запрещен (даже если вы авторизованы)." },
    404: { title: "Not Found", description: "Страница или файл не найдены." },
    405: { title: "Method Not Allowed", description: "Метод запроса (например, POST) не поддерживается для этого URL." },
    406: { title: "Not Acceptable", description: "Сервер не может отдать контент в нужном формате (Encoding/Language)." },
    407: { title: "Proxy Authentication Required", description: "Нужна авторизация через прокси-сервер." },
    408: { title: "Request Timeout", description: "Истекло время ожидания запроса от браузера." },
    409: { title: "Conflict", description: "Конфликт при выполнении запроса (например, при правке одного файла)." },
    410: { title: "Gone", description: "Ресурс был удален навсегда (в отличие от 404)." },
    411: { title: "Length Required", description: "Не указана длина содержимого (Content-Length)." },
    412: { title: "Precondition Failed", description: "Одно из условий запроса не выполнено." },
    413: { title: "Payload Too Large", description: "Запрос слишком большой (например, файл весит больше лимита)." },
    414: { title: "URI Too Long", description: "URL-адрес слишком длинный." },
    415: { title: "Unsupported Media Type", description: "Неподдерживаемый тип данных (формат файла)." },
    416: { title: "Range Not Satisfiable", description: "Запрошен недопустимый диапазон байтов." },
    417: { title: "Expectation Failed", description: "Сервер не может удовлетворить условиям заголовка Expect." },
    418: { title: "I'm a teapot", description: "Первоапрельская шутка (протокол HTCPCP)." },
    421: { title: "Misdirected Request", description: "Запрос направлен на сервер, который не может дать ответ." },
    422: { title: "Unprocessable Entity", description: "Ошибка в логике данных (например, неверный формат почты в форме)." },
    423: { title: "Locked", description: "Ресурс заблокирован." },
    424: { title: "Failed Dependency", description: "Ошибка из-за сбоя предыдущей операции." },
    426: { title: "Upgrade Required", description: "Сервер требует обновления протокола (например, на TLS 1.3)." },
    429: { title: "Too Many Requests", description: "Слишком много запросов (защита от спама/DDOS)." },
    431: { title: "Request Header Fields Too Large", description: "Заголовки запроса слишком велики." },
    444: { title: "No Response", description: "Nginx закрывает соединение без ответа (защита от ботов)." },
    451: { title: "Unavailable For Legal Reasons", description: "Доступ закрыт по юридическим причинам (цензура)." },
    499: { title: "Client Closed Request", description: "Клиент закрыл соединение до того, как Nginx успел ответить." },
    500: { title: "Internal Server Error", description: "Общая ошибка сервера (самая частая, без деталей)." },
    501: { title: "Not Implemented", description: "Сервер не поддерживает метод, нужный для ответа." },
    502: { title: "Bad Gateway", description: "Плохой шлюз (ошибка связи между двумя серверами)." },
    503: { title: "Service Unavailable", description: "Сервер перегружен или на тех-обслуживании." },
    504: { title: "Gateway Timeout", description: "Истекло время ожидания ответа от вышестоящего сервера." },
    505: { title: "HTTP Version Not Supported", description: "Версия протокола HTTP не поддерживается." },
    506: { title: "Variant Also Negotiates", description: "Ошибка конфигурации (циклическая ссылка на ресурсы)." },
    507: { title: "Insufficient Storage", description: "На сервере закончилось место на диске." },
    508: { title: "Loop Detected", description: "Сервер обнаружил бесконечный цикл при обработке запроса." },
    510: { title: "Not Extended", description: "Нужны дополнительные расширения для выполнения запроса." },
    511: { title: "Network Authentication Required", description: "Требуется авторизация в самой сети (например, Wi-Fi в отеле)." },
    520: { title: "Unknown Error", description: "Cloudflare не понимает, что именно сломалось на сервере." },
    521: { title: "Web Server Is Down", description: "Сервер полностью выключен или сбрасывает соединение." },
    522: { title: "Connection Timed Out", description: "Cloudflare не смог подключиться к серверу за отведенное время." },
    524: { title: "A Timeout Occurred", description: "Соединение установлено, но сервер молчит слишком долго." }
};

export default function NotFound({ statusCode = 404 }) {
    const pathname = usePathname();

    // Ищем информацию по коду в справочнике, иначе ставим дефолтные значения
    const errorInfo = errorReference[statusCode] || {
        title: "Что-то пошло не так",
        description: "Произошла непредвиденная ошибка."
    };

    return (
        <Dashboard_Layout>
            <Section title={errorInfo.title}>
                <div className={s.notFound}>
                    <small className={s.errorCode}>{statusCode}</small>

                    <p className={s.message}>Упс! Похоже, вы заблудились (путь: {pathname}).</p>

                    <p className={s.description}>
                        {errorInfo.description}
                    </p>

                    <Link href="/" className={s.homeLink}>
                        Вернуться на Главную страницу
                    </Link>
                </div>

                <p>
                    Это ошибка со статусом {statusCode}. Сервер зафиксировал проблему в запросе или на линии.
                </p>

            </Section>
        </Dashboard_Layout>
    );
}


/*
{Number(statusCode) === 404 && (
                    <p>
                        Наиболее вероятные причины:
                        <br />- опечатка в адресе
                        <br />- удалённая / перемещённая страница
                        <br />- битая ссылка с другого сайта
                    </p>
                )}
*/