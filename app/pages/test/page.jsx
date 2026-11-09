'use client';

import { useState } from 'react';
import s from '@/app/s.module.css';
import { Dashboard_Layout } from '@/app/layouts/layout';
import { Section, Article, Card } from '@/app/ui/structure/struct';

import { VerticalBlindsControl } from "@/app/ui/widgets/original/galusi/gal";
import { DamperFanIndicator } from "@/app/ui/widgets/original/fan/DFMi";
import { ClimateCompactWidget } from "@/app/ui/widgets/original/compact/w1";
import { ColumnSetWidget } from "@/app/ui/widgets/SetColumn/column";
import { CircleSetWidget } from "@/app/ui/widgets/SetCircle/circle";

import { TextInput, EmailInput, PasswordInput, PriceInput } from "@/app/ui/elements/inputs/inputsGPT";
import { LED } from "@/app/ui/widgets/original/indicators/LED";
import {
  Server,
  Router,
  Radio,
  Network,
  Camera,
} from "lucide-react";
import { Forma } from "@/app/ui/elements/forms/form";

const Icons = [
  { icon: <Camera />, title: 'Камера', state: 'unknown' },
  { icon: <Server />, title: 'Сервер', state: 'loading' },
  { icon: <Router />, title: 'Роутер', state: 'ready' },
  { icon: <Radio />, title: 'Радио', state: 'warning' },
  { icon: <Network />, title: 'Сеть', state: 'error' },
];

export default function TestPage() {
  const [shouldCrash, setShouldCrash] = useState(false);

  if (shouldCrash) {
    const brokenObject = null;
    return <div>{brokenObject.nonExistentProperty}</div>;
  }

  return (
    <Dashboard_Layout id={"0"} sw_h1={true} title="Тестовая лаборатория" >
      <Section id={'0'} title={'Тестирование ошибок и компонентов'}>
        <Article id="err-test" title="Проверка error boundary">
          <div style={{ padding: '10px 0' }}>
            <button
              onClick={() => setShouldCrash(true)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#dc3545',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Спровоцировать ошибку (Runtime Crash)
            </button>
          </div>
        </Article>
      </Section>

      <Section id={'1'} title={'Тестовый дашборд (Все компоненты)'}>
        <Article id="article1" title="Элементы управления и формы">
          <div className={s.flex}>
            <VerticalBlindsControl />
            <CircleSetWidget />
            <CircleSetWidget unit='%' colorTheme='orange' min={0} max={100} current={60} />
            <ClimateCompactWidget />
            <Card title="card 1" className={s.blinds}></Card>
            <Card title="card 2"></Card>
            <Card title="card 3" id={'c3'}>
              <ColumnSetWidget />
            </Card>
            <Card title="card 4" id={'c4'} className={s.card4}></Card>
            <Card title="card 5" id={'c5'}>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {Icons.map((item, index) => (
                  <li key={index} style={{ marginBottom: 6 }}>
                    <LED id={index} icon={item.icon} title={item.title} state={item.state} />
                  </li>
                ))}
              </ul>
            </Card>
            <Card title="card 6" id={'c6'} className={s.card6}>
              <Forma>
                <EmailInput />
                <PasswordInput />
                <TextInput placeholder="placeholder" name={'t1'} />
                <PriceInput />
              </Forma>
            </Card>
          </div>
        </Article>

        <Article id="article2" title="Унифицированные колонки и заслонки">
          <div className={s.flex}>
            <ColumnSetWidget title="Температура" current={25} target={28} min={15} max={28} unit="°C" colorTheme="orange" />
            <ColumnSetWidget title="Влажность" current={60} target={30} min={20} max={80} unit="%" colorTheme="green" />
            <ColumnSetWidget title="Давление" current={1017} target={1020} min={900} max={1100} unit="гПа" colorTheme="blue" />
            <DamperFanIndicator
              currentTemp={24.5}
              fanState={40}
              damperOpen={60}
              color="orange"
            />
          </div>
        </Article>
      </Section>

      <Section id={'2'} title={'Климат-контроль (Окна)'}>
        <Article id="article3" title="SE Window">
          <div className={s.flex}>
            <ClimateCompactWidget />
          </div>
        </Article>
        <Article id="article4" title="NW Window">
          <div className={s.flex}>
            <ClimateCompactWidget title="NW Window" temp='22' humidity='59' pressure='985' damper='15' />
          </div>
        </Article>
      </Section>
    </Dashboard_Layout>
  );
}
