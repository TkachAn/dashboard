
import { Dashboard_Layout } from "./layouts/layout";
import { Section, Article, Card } from "./ui/structure/struct";
import s from './s.module.css';

export default function Home() {
  return (
    <Dashboard_Layout id={"0"} sw_h1={true} title="Home" >
      <Section id={'1'} title={'Dashboard'}>
        <Article id="article1" title="article 1">
          <div className={s.flex}>
            <Card title="card 1" id={'c1'}>
              <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo quisquam voluptatibus nostrum odit, in quia? Quas, quia, aspernatur ducimus, voluptas autem laborum repellendus saepe quod vel ullam aperiam officia doloremque?</p>

            </Card>
            <Card title="card 2" id={'c2'}>
              <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo quisquam voluptatibus nostrum odit, in quia? Quas, quia, aspernatur ducimus, voluptas autem laborum repellendus saepe quod vel ullam aperiam officia doloremque?</p>

            </Card>
            <Card title="card 3" id={'c3'}>
              <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo quisquam voluptatibus nostrum odit, in quia? Quas, quia, aspernatur ducimus, voluptas autem laborum repellendus saepe quod vel ullam aperiam officia doloremque?</p>

            </Card>
            <Card title="card 4" id={'c4'}>
              <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo quisquam voluptatibus nostrum odit, in quia? Quas, quia, aspernatur ducimus, voluptas autem laborum repellendus saepe quod vel ullam aperiam officia doloremque?</p>

            </Card>
            <Card title="card 5" id={'c5'}>
              <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo quisquam voluptatibus nostrum odit, in quia? Quas, quia, aspernatur ducimus, voluptas autem laborum repellendus saepe quod vel ullam aperiam officia doloremque?</p>

            </Card>
            <Card title="card 6" id={'c6'}>
              <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo quisquam voluptatibus nostrum odit, in quia? Quas, quia, aspernatur ducimus, voluptas autem laborum repellendus saepe quod vel ullam aperiam officia doloremque?</p>

            </Card>
          </div>
        </Article>
        <Article id="article2" title="article 2">
          <p>hello children</p>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo quisquam voluptatibus nostrum odit, in quia? Quas, quia, aspernatur ducimus, voluptas autem laborum repellendus saepe quod vel ullam aperiam officia doloremque?</p>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo quisquam voluptatibus nostrum odit, in quia? Quas, quia, aspernatur ducimus, voluptas autem laborum repellendus saepe quod vel ullam aperiam officia doloremque?</p>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo quisquam voluptatibus nostrum odit, in quia? Quas, quia, aspernatur ducimus, voluptas autem laborum repellendus saepe quod vel ullam aperiam officia doloremque?</p>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo quisquam voluptatibus nostrum odit, in quia? Quas, quia, aspernatur ducimus, voluptas autem laborum repellendus saepe quod vel ullam aperiam officia doloremque?</p>
        </Article>
      </Section>
      <Section id={'2'} title={'hello world'}>
        <Article id="article3" title="article 3">
          <p>hello children</p>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo quisquam voluptatibus nostrum odit, in quia? Quas, quia, aspernatur ducimus, voluptas autem laborum repellendus saepe quod vel ullam aperiam officia doloremque?</p>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo quisquam voluptatibus nostrum odit, in quia? Quas, quia, aspernatur ducimus, voluptas autem laborum repellendus saepe quod vel ullam aperiam officia doloremque?</p>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo quisquam voluptatibus nostrum odit, in quia? Quas, quia, aspernatur ducimus, voluptas autem laborum repellendus saepe quod vel ullam aperiam officia doloremque?</p>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo quisquam voluptatibus nostrum odit, in quia? Quas, quia, aspernatur ducimus, voluptas autem laborum repellendus saepe quod vel ullam aperiam officia doloremque?</p>
        </Article>
        <Article id="article4" title="article 4">
          <p>hello children</p>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo quisquam voluptatibus nostrum odit, in quia? Quas, quia, aspernatur ducimus, voluptas autem laborum repellendus saepe quod vel ullam aperiam officia doloremque?</p>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo quisquam voluptatibus nostrum odit, in quia? Quas, quia, aspernatur ducimus, voluptas autem laborum repellendus saepe quod vel ullam aperiam officia doloremque?</p>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo quisquam voluptatibus nostrum odit, in quia? Quas, quia, aspernatur ducimus, voluptas autem laborum repellendus saepe quod vel ullam aperiam officia doloremque?</p>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo quisquam voluptatibus nostrum odit, in quia? Quas, quia, aspernatur ducimus, voluptas autem laborum repellendus saepe quod vel ullam aperiam officia doloremque?</p>
        </Article>
      </Section>
    </Dashboard_Layout>
  );
}
