import s from "./s.module.css";


export function Container({ children, className }) {
    return <div className={`${s.container} ${className || ""}`}>{children}</div>;
}

export function Header({ children, id, title }) {
    return (
        <header id={id} title={title} className={s.header_wrapper}>
            <div className={s.header}>{children}</div>
        </header>
    );
}
export function Sidebar({ children, id, className }) {
    return (
        <aside id={id} className={`${s.sidebar} ${className || ""}`}>
            {children}
        </aside>
    );
}


export function Wrapper({ id, children }) {
    return (
        <div id={id} className={s.main_wrapper}>
            {children}
        </div>
    );
}

export function Main({ children, id }) {
    return (
        <main id={id} className={s.main}>
            {children}
        </main>
    );
}

export function Section({ children, title, id, className }) {
    return (
        <section
            id={id}
            className={`${s.section} ${className || ""}`}
            title={title}
        >
            {title && <h2 className={s.section_title}>{title}</h2>}
            {children}
        </section>
    );
}

export function Article({ children, title, id, className }) {
    return (
        <article
            id={id}
            className={`${s.article} ${className || ""}`}
            title={title}
        >
            {title && <h3 className={s.article_title}>{title}</h3>}
            {children}
        </article>
    );
}
export function Card({ children, id, className, title }) {
    return (
        <div id={id} className={`${s.card} ${className || ""}`}>
            {title && <h4 className={s.card_title}>{title}</h4>}
            {children}
        </div>
    );
}