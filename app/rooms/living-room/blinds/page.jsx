'use client';

import React from 'react';
import Link from 'next/link';
import { Dashboard_Layout } from '@/app/layouts/layout';
import { Section, Article } from '@/app/ui/structure/struct';
import { VerticalBlindsControl } from "@/app/ui/widgets/original/galusi/gal";
import { ArrowLeft } from 'lucide-react';

export default function LivingRoomBlindsPage() {
    return (
        <Dashboard_Layout title="Гостиная — Вертикальные жалюзи">
            <Section id='2' titlt='ququ' style={{ marginBottom: 16 }}>
                <Link
                    href="/rooms/living-room"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        color: 'var(--accent-primary)',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        padding: '8px 16px',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 8,
                        textDecoration: 'none'
                    }}
                >
                    <ArrowLeft size={16} />
                    <span>Вернуться в Гостиную</span>
                </Link>
            </Section>

            <Section id='1' title="Управление вертикальными жалюзи">
                <Article id='11' title="Оконный блок и балконная дверь: регулировка положения и угла ламелей">
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
                        <VerticalBlindsControl />
                    </div>
                </Article>
            </Section>
        </Dashboard_Layout>
    );
}
