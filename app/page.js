
import { Dashboard_Layout } from "./layouts/layout";
import { ClimateWidget } from "./ui/device's/esp/esp8266/climate/bme280";
import { DamperFanWidget } from "./ui/device's/esp/esp8266/climate/fan/DFW";
import { DamperFanIndicator } from "./ui/device's/esp/esp8266/climate/fan/DFMi";
import { DamperFanWidgetMan } from "./ui/device's/esp/esp8266/climate/fan2/DFW_am";
import { Section, Article, Card } from "./ui/structure/struct";
import s from './s.module.css';
import { TextInput, TextAreaInput, SelectInput, PhoneInput, NumericInput, EmailInput, PasswordInput, IntegerInput, FloatInput, PriceInput } from "./ui/elements/inputs/inputsGPT";
import { Toggle } from "./ui/elements/buttons/toggle/toggle";
import { ScrollToTopButton } from "./ui/elements/buttons/button_Up";
import { SocialAuth } from "./ui/elements/buttons/SocialAuth";
import { NormButton, SubmitButton, DeleteButton, AddButton, EditButton } from "./ui/elements/buttons/buttons";
import { LoginIconButton, CloseIconButton, DeleteIconButton, EditIconButton, AddIconButton, UserAddIconButton, UserEditIconButton, MenuIconButton, LogOutIconButton, ThemeToggle } from "./ui/elements/buttons/IconButtons";
import { Checkbox } from "./ui/elements/buttons/checkBox/checkbox";
import { LED } from "./ui/elements/widgets/indicators/LED";
import {
  Server,
  Router,
  Radio,
  Network,
  Camera,
} from "lucide-react";
import { Forma } from "./ui/elements/forms/form";
const Icons = [
  { icon: <Camera />, title: 'Камера', state: 'unknown' },
  { icon: <Server />, title: 'Сервер', state: 'loading' },
  { icon: <Router />, title: 'Роутер', state: 'ready' },
  { icon: <Radio />, title: 'Радио', state: 'warning' },
  { icon: <Network />, title: 'Сеть', state: 'error' },

]


export default function Home() {
  return (
    <Dashboard_Layout id={"0"} sw_h1={true} title="Home" >
      <Section id={'1'} title={'Dashboard'}>
        <Article id="article1" title="article 1">
          <div className={s.flex}>
            <Card title="card 1" >
              <TextInput placeholder="placeholder" name={'t1'} />
              <TextAreaInput name={'ta1'} />
              <TextInput placeholder="placeholder" />
              <TextAreaInput />
            </Card>
            <Card title="card 2" >
              <SelectInput name={'SelectInput'} options={[{ value: '1', label: '1' }, { value: '2', label: '2' }]} />
              <PhoneInput name={'PhoneInput'} country="UA" placeholder="+380" />
              <NumericInput name={'NumericInput'} />

              <IntegerInput name={'IntegerInput'} />
              <FloatInput name={'FloatInput'} />

            </Card>
            <Card title="card 3" id={'c3'}>

              <NormButton>Norm Button</NormButton>
              <SubmitButton>Submit Button</SubmitButton>
              <DeleteButton>Delete Button</DeleteButton>
              <AddButton>Add Button</AddButton>
              <EditButton>Edit Button</EditButton>
            </Card>
            <Card title="card 4" id={'c4'} className={s.card4}>
              <ThemeToggle />
              <Toggle />
              <SocialAuth />
              <Checkbox id="checkbox1" label="Checkbox 1" />
              <LoginIconButton />
              <CloseIconButton />
              <DeleteIconButton />
              <EditIconButton />
              <AddIconButton />
              <UserAddIconButton />
              <UserEditIconButton />
              <MenuIconButton />
              <LogOutIconButton />
            </Card>
            <Card title="card 5" id={'c5'}>
              <ul style={{ listStyleType: 'none' }}>
                {Icons.map((item, index) => (
                  <li key={index} >
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
        <Article id="article2" title="article 2">
          <ScrollToTopButton />

          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo quisquam voluptatibus nostrum odit, in quia? Quas, quia, aspernatur ducimus, voluptas autem laborum repellendus saepe quod vel ullam aperiam officia doloremque?</p>


        </Article>
      </Section>
      <Section id={'2'} title={'Climate control'}>
        <Article id="article3" title="SE Window ESP8266" >
          <div className={s.flex}>
            <ClimateWidget title="Температура" current={25} target={28} min={15} max={28} unit="°C" colorTheme="orange" />
            <ClimateWidget title="Влажность" current={60} target={30} min={20} max={80} unit="%" colorTheme="green" />
            <ClimateWidget title="Давление" current={1017} target={1020} min={900} max={1100} unit="гПа" colorTheme="blue" />
            <DamperFanWidget
              currentTemp={24.5}
              fanState={40}
              damperOpen={60}
              color="orange"
            />
            <DamperFanIndicator currentTemp={24.5}
              fanState={40}
              damperOpen={60}
              color="orange" />
          </div>
        </Article>
        <Article id="article4" title="NW Window ESP8266    ">
          <div className={s.flex}>
            <ClimateWidget title="Температура" current={25} target={28} min={15} max={28} unit="°C" colorTheme="orange" />
            <ClimateWidget title="Влажность" current={60} target={30} min={20} max={80} unit="%" colorTheme="green" />
            <ClimateWidget title="Давление" current={1017} target={1020} min={900} max={1100} unit="гПа" colorTheme="blue" />
            <DamperFanWidget
              currentTemp={24.5}
              fanState={40}
              damperOpen={60}
              color="orange"
            />
            <DamperFanWidgetMan
              title="Заслонка и Вентилятор"
              currentPosition={35}
              initialTarget={50}
              minPosition={0}
              maxPosition={100}
              currentFanSpeed={45}
              initialFanTarget={50}
              minFanSpeed={0}
              maxFanSpeed={100}
              currentTemp={23}
              tempUnit="°C"
              color="green"
            />
          </div>
        </Article>
      </Section>
    </Dashboard_Layout>
  );
}
