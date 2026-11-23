import Image from 'next/image';

export function NextLogo({ width = 100, height = 20, className }) {
    return (
        <Image
            src="/logo.png"
            alt="file"
            width={140}
            height={75}
        />
    );
}
