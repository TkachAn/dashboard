
import { ColumnSetWidget } from "../../app/ui/widgets/SetColumn/column"
import { Dashboard_Layout } from "../layouts/layout"
import { Article, Section } from "../ui/structure/struct";
import s from "./s.module.css"

export default function ClimatePage() {
    return (
        <Dashboard_Layout id={"0"} sw_h1={true} title="Home" >
            <Section id='1' title={'Юго-восточная лоджия'}>
                <Article className={s.flex}>
                    <ColumnSetWidget
                        iconName="thermometer"
                        title="Температура"
                        current={23}
                        initial={25}
                        min={0}
                        max={100}
                        unit="°C"
                        colorTheme="orange"
                    /><ColumnSetWidget

                        iconName="droplet"
                        title="Влажность"
                        current={34}
                        initial={65}
                        min={0}
                        max={100}
                        unit="%"
                        colorTheme="blue"
                    /><ColumnSetWidget
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
            </Section>
        </Dashboard_Layout >
    )
}   