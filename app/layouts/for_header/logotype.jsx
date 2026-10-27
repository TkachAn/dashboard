import Link from "next/link";
import s from "./s.module.css";
import { NextLogo } from "./imgLogo.jsx"; // Укажите актуальный путь к файлу NextLogo, если он в другой папке

export function Logotype() {
    return (
        <div className={s.logotype}>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <NextLogo width={100} height={20} className={s.logo} />
            </Link>
        </div>
    );
}


/*
import Link from "next/link";
import s from "./s.module.css";
import Image from "next/image";
export function Logotype() {
    return (
        <div className={s.logotype}>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <Image
                    className={s.logo}
                    src="/next.svg"
                    alt="Next.js logo"
                    width={100}
                    height={20}
                    priority
                />
            </Link>
        </div>
    );
}

/*
 <h3 className={s.logoText}>Logotype</h3>

*/


/*
import Link from "next/link";
import s from "./s.module.css";

export function Logotype() {
    return (
        <div className={s.logotype}>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <h3 className={s.logoText}>Logotype</h3>
            </Link>
        </div>
    );
}
*/