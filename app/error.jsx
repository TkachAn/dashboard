'use client';

import { useEffect } from 'react';
import NotFound from './not-found';

/**
 * Глобальный перехватчик ошибок для App Router.
 * Next.js автоматически передает сюда пропсы:
 * - error: объект ошибки (может содержать status, statusCode, digest)
 * - reset: функция для попытки повторного рендера
 */
export default function ErrorBoundary({ error, reset }) {
    useEffect(() => {
        // Логируем ошибку для отладки
        console.error('Сработал перехватчик ошибок (Boundary):', error);
    }, [error]);

    // Вычисляем код ошибки из входящего объекта. 
    // Если сервер/код не передал явный статус, по умолчанию берем 500 (Internal Server Error)
    const statusCode = error?.statusCode || error?.status || 500;

    return (
        <NotFound statusCode={statusCode} />
    );
}