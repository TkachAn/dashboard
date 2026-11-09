
import s from "./s.module.css"
import { Dashboard_Layout } from "../layouts/layout";
import { Article, Section, Card } from "../ui/structure/struct";
import { ColumnSetWidget } from "../../app/ui/widgets/unific/SetColumn/column";
import { CircleSetWidget } from "../../app/ui/widgets/unific/SetCircle/circle";
import { NormButton } from "../ui/elements/buttons/buttons";

export default function ClimatePage() {
    return (
        <Dashboard_Layout id='0' sw_h1={true} title="Home" >
            <Section id='1' title={'Юго-восточная лоджия'}>
                <Article id='11' title={'article1'} className={s.flex}>
                    <ColumnSetWidget
                        iconName="thermometer"
                        title="Температура"
                        current={23}
                        initial={25}
                        min={0}
                        max={100}
                        unit="°C"
                        colorTheme="orange"
                    />
                    <ColumnSetWidget

                        iconName="droplet"
                        title="Влажность"
                        current={34}
                        initial={65}
                        min={0}
                        max={100}
                        unit="%"
                        colorTheme="blue"
                    />
                    <ColumnSetWidget
                        id='gauge'
                        iconName="gauge"
                        title="Давление"
                        current={1200}
                        initial={1540}
                        min={1000}
                        max={2000}
                        unit="pA"
                        colorTheme="green"
                    />
                    <ColumnSetWidget
                        iconName="sun"
                        title="Освещённость"
                        current={1200}
                        initial={1540}
                        min={1000}
                        max={2000}
                        unit="lx"
                        colorTheme="red"
                    />
                </Article>
                <Article id='12' title={'article2'} className={s.flex}>
                    <CircleSetWidget />
                    <Card id='21' className={s.card}>
                        Вентилятор
                        <NormButton>
                            ВКЛ
                        </NormButton>
                        <div className={s.flex}>
                            <NormButton>
                                33%
                            </NormButton>
                            <NormButton>
                                66%
                            </NormButton>
                            <NormButton>
                                99%
                            </NormButton>
                        </div>
                    </Card>

                </Article>
            </Section>
        </Dashboard_Layout >
    )
}   