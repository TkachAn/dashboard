JavaScript
'use client';
//app/erros.jsx и app/not-found.jsx
export default function TestErrorsPage() {
    // Нарочно обращаемся к свойству `.nonExistentProperty` у несуществующего объекта (null).
    // JavaScript мгновенно выбросит нативный TypeError: Cannot read properties of null
    const brokenObject = null;
    //const crash = brokenObject.nonExistentProperty;
    const crach = 'crash';
    console.log(crash, 'crach TestErrorsPage')
    return (
        <div>
            <h1>{crash}</h1>
        </div>
    );
}