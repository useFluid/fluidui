"use client";

import { MorphPath } from "@usefluid/motion/react";
import { useState } from "react";
import { REPO_URL } from "@/lib/site";
import styles from "./GitHubLink.module.css";

const MARK = "M12 1C5.923 1 1 5.923 1 12c0 4.867 3.149 8.979 7.521 10.436.55.096.756-.233.756-.522 0-.262-.013-1.128-.013-2.049-2.764.509-3.479-.674-3.699-1.292-.124-.317-.66-1.293-1.127-1.554-.385-.207-.936-.715-.014-.729.866-.014 1.485.797 1.691 1.128.99 1.663 2.571 1.196 3.204.907.096-.715.385-1.196.701-1.471-2.448-.275-5.005-1.224-5.005-5.432 0-1.196.426-2.186 1.128-2.956-.111-.275-.496-1.402.11-2.915 0 0 .921-.288 3.024 1.128a10.193 10.193 0 0 1 2.75-.371c.936 0 1.871.123 2.75.371 2.104-1.43 3.025-1.128 3.025-1.128.605 1.513.221 2.64.111 2.915.701.77 1.127 1.747 1.127 2.956 0 4.222-2.571 5.157-5.019 5.432.399.344.743 1.004.743 2.035 0 1.471-.014 2.654-.014 3.025 0 .289.206.632.756.522C19.851 20.979 23 16.854 23 12c0-6.077-4.922-11-11-11Z";
const STAR = "M12 .25a.75.75 0 0 1 .673.418l3.058 6.197 6.839.994a.75.75 0 0 1 .415 1.279l-4.948 4.823 1.168 6.811a.751.751 0 0 1-1.088.791L12 18.347l-6.117 3.216a.751.751 0 0 1-1.088-.79l1.168-6.812-4.948-4.823a.75.75 0 0 1 .416-1.28l6.838-.993L11.327.668A.75.75 0 0 1 12 .25Z";

export function GitHubLink({ label }: { label: string }) {
  const [star, setStar] = useState(false);
  return (
    <a
      href={REPO_URL}
      className={styles.link}
      aria-label={label}
      data-star={star || undefined}
      onPointerEnter={(e) => { if (e.pointerType === "mouse") setStar(true); }}
      onPointerLeave={() => setStar(false)}
      onFocus={() => setStar(true)}
      onBlur={() => setStar(false)}
    >
      <svg viewBox="-1 -1 26 26" aria-hidden className={styles.icon}>
        <MorphPath d={star ? STAR : MARK} fill="currentColor" config={{ w: 16, z: 0.72, points: 140, spread: 0.12 }} />
      </svg>
    </a>
  );
}
