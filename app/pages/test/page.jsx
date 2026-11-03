'use client';

import { useState } from 'react';

export default function TestErrorsPage() {
    const [shouldCrash, setShouldCrash] = useState(false);

    // Как только состояние меняется по клику, React падает прямо в браузере в рантайме
    if (shouldCrash) {
        // Намеренный TypeError, который поймает error.jsx
        const brokenObject = null;
        return <div>{brokenObject.nonExistentProperty}</div>;
    }

    return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
            <h1>Страница тестирования ошибок</h1>
            <p>Статус: всё работает нормально.</p>

            <button
                onClick={() => setShouldCrash(true)}
                style={{
                    padding: '12px 24px',
                    background: '#e53e3e',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    marginTop: '20px'
                }}
            >
                Вызвать ошибку (Runtime Crash)
            </button>
        </div>
    );
}