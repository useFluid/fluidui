import { REPO } from "@/lib/site";
import { catalog } from "@usefluid/registry";
import Link from "next/link";
import { BigMark } from "@/components/BigMark";
import { BrandsRow } from "@/components/BrandsRow";
import { BrandToolbar } from "@/components/BrandToolbar";
import { CopyButton } from "@/components/CopyButton";
import { LogoParade } from "@/components/LogoParade";
import { Mosaic } from "@/components/Mosaic";
import { PaintedStage } from "@/components/PaintedStage";
import { PetParade } from "@/components/PetParade";
import { Reveal } from "@/components/Reveal";
import { SpringLab } from "@/components/SpringLab";
import { PostVideo, StoryVideo } from "@/components/SocialVideo";
import { highlight } from "@/lib/highlight";
import { type Lang, dictionaries, href } from "@/lib/i18n";
import styles from "./page.module.css";

const HERO_CODE = `// npx @usefluid/cli add splash-choice
// npx @usefluid/cli logo logo.svg --out src/lib/logo.ts
import { shapes } from "@usefluid/motion";
import { SplashChoice } from "@/components/fluid/splash-choice/SplashChoice";
import { logo } from "@/lib/logo";

export function Opening() {
  return (
    <SplashChoice
      logo={logo}
      title="Made for"
      word="you."
      options={[
        { value: "shops", label: "Shops", word: "shops.", shape: shapes.square },
        { value: "apps", label: "Apps", word: "apps.", shape: shapes.capsule },
        { value: "brands", label: "Brands", word: "brands.", shape: shapes.flower },
      ]}
    />
  );
}`;

const LOGO_CODE = `import { fitPath, shapes } from "@usefluid/motion";
import { MorphPath } from "@usefluid/motion/react";

// Any path, at any size, fitted to a 120 box.
const logo = fitPath(myLogoPath);

<svg viewBox="0 0 120 120">
  <MorphPath d={ready ? logo : shapes.circle} />
</svg>`;

const VIDEO_CODE = `npx @usefluid/cli record http://localhost:3000/intro --format story
npx @usefluid/cli record http://localhost:3000/pet --format square --seconds 4`;

const INSTALL = "npm i @usefluid/motion";
const SKILLS = `npx skills@latest add ${REPO}`;

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const lang = (await params).lang as Lang;
  const t = dictionaries[lang];
  const s = t.sections;
  const [hero, logo, video] = await Promise.all([
    highlight(HERO_CODE, "tsx"),
    highlight(LOGO_CODE, "tsx"),
    highlight(VIDEO_CODE, "bash"),
  ]);
  const splash = catalog.find((e) => e.slug === "splash-choice")!;
  const eyebrow = (n: number, text: string) => (
    <p className={styles.eyebrow}><span>{String(n).padStart(2, "0")}</span>{text}</p>
  );

  return (
    <>
      <section className={styles.hero} aria-labelledby="title">
        <div className={`container ${styles.heroGrid}`}>
          <div>
            <h1 id="title" className={styles.title}>{t.hero.title}</h1>
            <p className={styles.lead}>{t.hero.lead}</p>
            <div className={styles.actions}>
              <Link href={href(lang, "/components")} className={styles.primary}>{t.hero.primary}</Link>
              <div className={styles.install}>
                <code>{INSTALL}</code>
                <CopyButton text={INSTALL} />
              </div>
            </div>
          </div>
          <BigMark className={styles.heroMark} />
        </div>
      </section>

      <div className={`container ${styles.showcase}`}>
        <div className={styles.editor}>
          <div className={styles.editorBar}>
            <span className={styles.dots} aria-hidden><i /><i /><i /></span>
            <span>Opening.tsx</span>
          </div>
          <div className={`${styles.editorCode} scroll-dark`} dangerouslySetInnerHTML={{ __html: hero }} />
        </div>
        <PaintedStage slug="splash-choice" paint="accent" loop={splash.loop} className={styles.preview} />
      </div>

      <div className="container">
        <dl className={styles.stats}>
          <div><dt>{t.stats.pieces}</dt><dd>{catalog.length}</dd></div>
          <div><dt>{t.stats.deps}</dt><dd>0</dd></div>
          <div><dt>{t.stats.skills}</dt><dd>{t.skills.length}</dd></div>
          <div><dt>{t.stats.formats}</dt><dd>4</dd></div>
        </dl>
      </div>

      <section className={styles.section} aria-labelledby="wall">
        <div className="container">
          <Reveal className={styles.head}>
            {eyebrow(1, s.catalog.eyebrow)}
            <h2 id="wall" className={styles.sectionTitle}>{s.catalog.title}</h2>
            <p className={styles.text}>{s.catalog.text}</p>
          </Reveal>
          <Mosaic entries={catalog.map(({ slug, name, loop }) => ({ slug, name, loop }))} />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="brands">
        <div className="container">
          <Reveal className={styles.head}>
            {eyebrow(2, s.brands.eyebrow)}
            <h2 id="brands" className={styles.sectionTitle}>{s.brands.title}</h2>
            <p className={styles.text}>{s.brands.text}</p>
          </Reveal>
          <BrandsRow loop={splash.loop} />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="logo">
        <div className={`container ${styles.split}`}>
          <Reveal>
            {eyebrow(3, s.contour.eyebrow)}
            <h2 id="logo" className={styles.sectionTitle}>{s.contour.title}</h2>
            <p className={styles.text}>{s.contour.text}</p>
            <BrandToolbar lang={lang} />
            <div className={styles.editor}>
              <div className={`${styles.editorCode} scroll-dark`} dangerouslySetInnerHTML={{ __html: logo }} />
            </div>
          </Reveal>
          <LogoParade />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="physics">
        <div className="container">
          <Reveal className={styles.head}>
            {eyebrow(4, s.physics.eyebrow)}
            <h2 id="physics" className={styles.sectionTitle}>{s.physics.title}</h2>
            <p className={styles.text}>{s.physics.text}</p>
          </Reveal>
          <SpringLab />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="characters">
        <div className="container">
          <Reveal className={styles.head}>
            {eyebrow(5, s.characters.eyebrow)}
            <h2 id="characters" className={styles.sectionTitle}>{s.characters.title}</h2>
            <p className={styles.text}>{s.characters.text}</p>
          </Reveal>
          <PetParade />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="video">
        <div className={`container ${styles.split}`}>
          <Reveal>
            {eyebrow(6, s.video.eyebrow)}
            <h2 id="video" className={styles.sectionTitle}>{s.video.title}</h2>
            <p className={styles.text}>{s.video.text}</p>
            <div className={styles.editor}>
              <div className={`${styles.editorCode} scroll-dark`} dangerouslySetInnerHTML={{ __html: video }} />
            </div>
          </Reveal>
          <div className={styles.videos}>
            <StoryVideo src="/videos/opening-story.mp4" label={t.videos.story} />
            <PostVideo src="/videos/pet-square.mp4" label={t.videos.post} />
          </div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="agents">
        <div className={`container ${styles.split}`}>
          <Reveal>
            {eyebrow(7, s.agents.eyebrow)}
            <h2 id="agents" className={styles.sectionTitle}>{s.agents.title}</h2>
            <p className={styles.text}>{s.agents.text}</p>
            <div className={styles.install}>
              <code>{SKILLS}</code>
              <CopyButton text={SKILLS} />
            </div>
          </Reveal>
          <ul className={styles.skills}>
            {t.skills.map(([name, text]) => (
              <li key={name}>
                <h3>{name}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
