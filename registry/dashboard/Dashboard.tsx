"use client";

import { AreaMorph } from "../area-morph/AreaMorph";
import { DonutMorph } from "../donut-morph/DonutMorph";
import { DotGrid } from "../dot-grid/DotGrid";
import { PillTabs } from "../pill-tabs/PillTabs";
import { ProgressRing } from "../progress-ring/ProgressRing";
import { RankList } from "../rank-list/RankList";
import type { Ranked } from "../rank-list/rank";
import { SpringBars } from "../spring-bars/SpringBars";
import { StatCounter } from "../stat-counter/StatCounter";
import styles from "./Dashboard.module.css";

export type Stat = { label: string; value: number; previous?: number; format?: Intl.NumberFormatOptions; upIsGood?: boolean };

export type Range = {
  id: string;
  label: string;
  stats: Stat[];
  trend: number[];
  trendLabels?: string[];
  trendMax?: number;
  bars: { label: string; value: number }[];
  barsMax?: number;
  goal: { label: string; value: number; max: number };
  leaders: Ranked[];
  channels?: { label: string; value: number }[];
  activity?: number[];
};

type Props = {
  title: string;
  ranges: Range[];
  value: string;
  onChange(id: string): void;
  colors?: string[];
  locale?: string;
};

const PALETTE = ["#7c5cff", "#14b8a6", "#ff8a3d", "#ff4d8d"];

export function Dashboard({ title, ranges, value, onChange, colors = PALETTE, locale }: Props) {
  const range = ranges.find((r) => r.id === value) ?? ranges[0];
  const color = (i: number) => colors[i % colors.length];
  return (
    <section className={styles.root} aria-label={title}>
      <header className={styles.head}>
        <h2 className={styles.title}>{title}</h2>
        <PillTabs label="Range" tabs={ranges.map((r) => ({ value: r.id, label: r.label }))} value={range.id} onChange={onChange} />
      </header>
      <div className={styles.stats}>
        {range.stats.map((s, i) => (
          <StatCounter key={s.label} {...s} locale={locale} color={color(i)} />
        ))}
      </div>
      <div className={styles.wide}>
        <AreaMorph label="Trend" values={range.trend} max={range.trendMax} labels={range.trendLabels} color={color(0)} />
        <div className={styles.goal}>
          <ProgressRing label={range.goal.label} value={range.goal.value} max={range.goal.max} locale={locale} color={color(2)} />
        </div>
      </div>
      <div className={styles.split}>
        <SpringBars label="Activity" data={range.bars} max={range.barsMax} locale={locale} color={color(1)} />
        <RankList label="Top sellers" items={range.leaders} locale={locale} color={color(3)} />
      </div>
      {(range.channels || range.activity) && (
        <div className={styles.split}>
          {range.channels && <DonutMorph label="Visits" parts={range.channels.map((c, i) => ({ ...c, color: color(i) }))} locale={locale} />}
          {range.activity && <DotGrid label="Activity" values={range.activity} summary={`${range.label}: ${range.activity.length} days`} color={color(1)} />}
        </div>
      )}
    </section>
  );
}
