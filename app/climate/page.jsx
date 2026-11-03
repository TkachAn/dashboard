import { ClimateWidget } from "../../app/ui/devices/esp/esp8266/climate/bme/bme280";
import { Dashboard_Layout } from "../layouts/layout"

export default function ClimatePage() {
    return (
        <Dashboard_Layout id={"0"} sw_h1={true} title="H" >

            <ClimateWidget
                title="Температура"
                current={23}
                target={25}
                min={0}
                max={100}
                unit="°C"
                colorTheme="blue"
            />
        </Dashboard_Layout>
    )
}   