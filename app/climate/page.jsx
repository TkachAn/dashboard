import { ClimateWidget } from "../ui/device's/esp/esp8266/climate/bme280";

export function ClimatePage() {
    return (
        <ClimateWidget
            title="Температура"
            current={23}
            target={25}
            min={0}
            max={100}
            unit="°C"
            colorTheme="blue"
        />
    )
}   