"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./AboutHeroSimulation.module.scss";

/* --- Phase order + timing --- */
const PHASE_ORDER = ["code", "dashboard", "chat", "arch"];
const PHASE_DURATIONS = {
  code: 6500,
  dashboard: 4500,
  chat: 8500,
  arch: 5000,
};
const PHASE_LABELS = {
  code: "app.jsx · building",
  dashboard: "dashboard.app · live",
  chat: "ai-assistant · online",
  arch: "system architecture",
};

/* --- Code phase --- */
const CODE_LINES = [
  [
    { c: "kw", t: "const" },
    { c: "tx", t: " " },
    { c: "fn", t: "Dashboard" },
    { c: "tx", t: " = () => {" },
  ],
  [
    { c: "tx", t: "  " },
    { c: "kw", t: "const" },
    { c: "tx", t: " [" },
    { c: "var", t: "stats" },
    { c: "tx", t: ", " },
    { c: "var", t: "setStats" },
    { c: "tx", t: "] = " },
    { c: "fn", t: "useState" },
    { c: "tx", t: "();" },
  ],
  [
    { c: "tx", t: "  " },
    { c: "fn", t: "useEffect" },
    { c: "tx", t: "(() => " },
    { c: "fn", t: "fetchStats" },
    { c: "tx", t: "(), []);" },
  ],
  [
    { c: "tx", t: "  " },
    { c: "kw", t: "return" },
    { c: "tx", t: " <" },
    { c: "tag", t: "DashboardUI" },
    { c: "tx", t: " stats={stats} />;" },
  ],
  [{ c: "tx", t: "};" }],
  [{ c: "cm", t: "// ✓ build successful — launching UI" }],
];

const CodePhase = () => {
  const [pos, setPos] = useState({ line: 0, char: 0 });

  useEffect(() => {
    let cancelled = false;
    let line = 0;
    let char = 0;
    let timer;

    const flat = CODE_LINES.map((l) => l.map((t) => t.t).join(""));

    const step = () => {
      if (cancelled) return;
      if (line >= flat.length) return;
      const len = flat[line].length;
      if (char < len) {
        char += 1;
        setPos({ line, char });
        timer = setTimeout(step, 22 + Math.random() * 28);
      } else {
        line += 1;
        char = 0;
        setPos({ line, char });
        timer = setTimeout(step, 220);
      }
    };

    step();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={styles.codeBlock}>
      {CODE_LINES.map((tokens, lineIdx) => {
        if (lineIdx > pos.line) return null;
        const fullText = tokens.map((t) => t.t).join("");
        const visibleChars =
          lineIdx < pos.line ? fullText.length : pos.char;

        const visibleSpans = [];
        let consumed = 0;
        for (let k = 0; k < tokens.length; k += 1) {
          if (consumed >= visibleChars) break;
          const tok = tokens[k];
          const sliceLen = Math.min(tok.t.length, visibleChars - consumed);
          visibleSpans.push(
            <span key={k} className={styles[`tok_${tok.c}`]}>
              {tok.t.slice(0, sliceLen)}
            </span>
          );
          consumed += sliceLen;
        }

        return (
          <div key={lineIdx} className={styles.codeRow}>
            <span className={styles.lineNum}>{lineIdx + 1}</span>
            <span className={styles.lineText}>
              {visibleSpans}
              {lineIdx === pos.line && (
                <span className={styles.codeCaret} />
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/* --- Dashboard phase (light, professional) --- */
const BAR_DATA = [
  { h: 38, label: "Jan" },
  { h: 56, label: "Feb" },
  { h: 44, label: "Mar" },
  { h: 72, label: "Apr" },
  { h: 88, label: "May" },
  { h: 64, label: "Jun" },
  { h: 80, label: "Jul" },
];

const DashboardPhase = () => {
  return (
    <div className={styles.dashboard}>
      <div className={styles.dashTop}>
        <div>
          <div className={styles.dashGreeting}>Hi, Arka 👋</div>
          <div className={styles.dashSub}>Realtime overview of your product</div>
        </div>
        <div className={styles.dashLive}>
          <span className={styles.dashLiveDot} />
          Live
        </div>
      </div>

      <div className={styles.dashHeroStat}>
        <div className={styles.dashHeroLabel}>
          <span>Annual Portfolio Growth</span>
          <span className={styles.dashHeroDelta}>+12.4%</span>
        </div>
        <div className={styles.dashHeroValue}>$48,210.92</div>
        <div className={styles.dashChart}>
          {BAR_DATA.map((b, i) => (
            <div key={i} className={styles.dashBarCol}>
              <span
                className={i === 4 ? styles.dashBar : styles.dashBarSoft}
                style={{ "--h": `${b.h}%`, "--d": `${i * 0.07}s` }}
              />
              <span className={styles.dashBarLabel}>{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.dashKpis}>
        <div className={styles.dashKpi}>
          <div className={styles.dashKpiValue}>4,488</div>
          <div className={styles.dashKpiLabel}>Active Users</div>
        </div>
        <div className={styles.dashKpi}>
          <div className={styles.dashKpiValue}>99.2%</div>
          <div className={styles.dashKpiLabel}>Accuracy</div>
        </div>
        <div className={styles.dashKpi}>
          <div className={styles.dashKpiValue}>0.3s</div>
          <div className={styles.dashKpiLabel}>Response</div>
        </div>
      </div>
    </div>
  );
};

/* --- Chat phase (light, with product / info cards) --- */
const CHAT_SCENARIOS = [
  {
    user: "I'm looking for premium sunglasses",
    aiPre: "Found a great pair for you:",
    cardType: "product",
    card: {
      image:
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=480&h=320&fit=crop",
      badge: "40% OFF",
      name: "Premium Sunglasses",
      price: "$29.99",
      original: "$199",
    },
  },
  {
    user: "Book me a doctor's appointment tomorrow at 4 PM",
    aiPre: "Confirmed ✓ here are the details:",
    cardType: "info",
    card: {
      title: "Dr. Sharma — General",
      rows: [
        ["Time", "Tomorrow · 4:00 PM"],
        ["Location", "City Clinic, Floor 3"],
        ["Token", "#A12"],
      ],
      tag: "Confirmation sent",
    },
  },
  {
    user: "Refund my order #A4582",
    aiPre: "Refund processed ✓",
    cardType: "info",
    card: {
      title: "Refund · Order #A4582",
      rows: [
        ["Amount", "$24.99"],
        ["Method", "Visa ••4291"],
        ["ETA", "3–5 business days"],
      ],
      tag: "Receipt emailed",
    },
  },
];

const scenarioCounter = { i: 0 };

const ChatPhase = () => {
  const [userTyped, setUserTyped] = useState("");
  const [aiTyped, setAiTyped] = useState("");
  const [showTyping, setShowTyping] = useState(false);
  const [userSent, setUserSent] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const scenarioRef = useRef(null);

  if (scenarioRef.current === null) {
    scenarioRef.current =
      CHAT_SCENARIOS[scenarioCounter.i % CHAT_SCENARIOS.length];
    scenarioCounter.i += 1;
  }

  useEffect(() => {
    let cancelled = false;
    const timeouts = [];
    const scenario = scenarioRef.current;

    const after = (delay, fn) => {
      const t = setTimeout(() => {
        if (!cancelled) fn();
      }, delay);
      timeouts.push(t);
    };

    const typeUser = () => {
      let i = 0;
      const tick = () => {
        if (cancelled) return;
        if (i <= scenario.user.length) {
          setUserTyped(scenario.user.slice(0, i));
          i += 1;
          timeouts.push(setTimeout(tick, 32));
        } else {
          setUserSent(true);
          after(500, () => {
            setShowTyping(true);
            after(1100, () => {
              setShowTyping(false);
              typeAi();
            });
          });
        }
      };
      tick();
    };

    const typeAi = () => {
      let j = 0;
      const tick = () => {
        if (cancelled) return;
        if (j <= scenario.aiPre.length) {
          setAiTyped(scenario.aiPre.slice(0, j));
          j += 1;
          timeouts.push(setTimeout(tick, 22));
        } else {
          after(280, () => setShowCard(true));
        }
      };
      tick();
    };

    typeUser();

    return () => {
      cancelled = true;
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, []);

  const scenario = scenarioRef.current;

  return (
    <div className={styles.chat}>
      <div className={styles.chatHeader}>
        <div className={styles.chatAvatar}>AI</div>
        <div className={styles.chatHeaderText}>
          <div className={styles.chatName}>Assistant</div>
          <div className={styles.chatStatus}>
            <span className={styles.chatStatusDot} /> online
          </div>
        </div>
      </div>

      <div className={styles.chatBody}>
        {userTyped && (
          <div className={`${styles.chatRow} ${styles.chatRowUser}`}>
            <div className={styles.chatBubbleUser}>{userTyped}</div>
          </div>
        )}

        {showTyping && (
          <div className={styles.chatTyping}>
            <span />
            <span />
            <span />
          </div>
        )}

        {aiTyped && (
          <div className={`${styles.chatRow} ${styles.chatRowAi}`}>
            <div className={styles.chatAiAvatar}>AI</div>
            <div className={styles.chatBubbleAi}>{aiTyped}</div>
          </div>
        )}

        {showCard && scenario.cardType === "product" && (
          <div className={styles.chatProductCard}>
            <div className={styles.chatProductImg}>
              <img src={scenario.card.image} alt={scenario.card.name} />
              <span className={styles.chatProductBadge}>
                {scenario.card.badge}
              </span>
            </div>
            <div className={styles.chatProductBody}>
              <div className={styles.chatProductName}>
                {scenario.card.name}
              </div>
              <div className={styles.chatProductPrice}>
                <span className={styles.chatProductPriceMain}>
                  {scenario.card.price}
                </span>
                <span className={styles.chatProductPriceOrig}>
                  {scenario.card.original}
                </span>
              </div>
            </div>
          </div>
        )}

        {showCard && scenario.cardType === "info" && (
          <div className={styles.chatInfoCard}>
            <div className={styles.chatInfoTitle}>{scenario.card.title}</div>
            {scenario.card.rows.map(([k, v]) => (
              <div key={k} className={styles.chatInfoRow}>
                <span>{k}</span>
                <strong>{v}</strong>
              </div>
            ))}
            <div className={styles.chatInfoTag}>{scenario.card.tag}</div>
          </div>
        )}
      </div>

      <div className={styles.chatInput}>
        <input
          readOnly
          placeholder="Ask anything..."
          value={userSent ? "" : userTyped}
        />
        <button type="button" className={styles.chatSend} aria-label="Send">
          ↑
        </button>
      </div>
    </div>
  );
};

/* --- Architecture phase (light diagram) --- */
const ArchPhase = () => {
  return (
    <div className={styles.arch}>
      <div className={styles.archTitle}>System Architecture</div>

      <div className={styles.archDiagram}>
        <div className={styles.archRow}>
          <div
            className={`${styles.archNode} ${styles.archNodeBlue}`}
            style={{ "--d": "0.05s" }}
          >
            <span className={styles.archIcon}>🖥️</span>
            <div>
              <div className={styles.archLabel}>Frontend</div>
              <div className={styles.archMeta}>Next.js 16</div>
            </div>
          </div>
          <span className={styles.archArrowH} style={{ "--d": "0.45s" }}>
            →
          </span>
          <div
            className={`${styles.archNode} ${styles.archNodeOrange}`}
            style={{ "--d": "0.55s" }}
          >
            <span className={styles.archIcon}>⚙️</span>
            <div>
              <div className={styles.archLabel}>API Layer</div>
              <div className={styles.archMeta}>Node.js</div>
            </div>
          </div>
          <span className={styles.archArrowH} style={{ "--d": "0.95s" }}>
            →
          </span>
          <div
            className={`${styles.archNode} ${styles.archNodeGreen}`}
            style={{ "--d": "1.05s" }}
          >
            <span className={styles.archIcon}>🗄️</span>
            <div>
              <div className={styles.archLabel}>Database</div>
              <div className={styles.archMeta}>MongoDB</div>
            </div>
          </div>
        </div>

        <span className={styles.archArrowV} style={{ "--d": "1.4s" }}>
          ↓
        </span>

        <div
          className={`${styles.archNode} ${styles.archNodePurple}`}
          style={{ "--d": "1.5s" }}
        >
          <span className={styles.archIcon}>🤖</span>
          <div>
            <div className={styles.archLabel}>AI Service</div>
            <div className={styles.archMeta}>OpenAI · Embeddings</div>
          </div>
        </div>
      </div>

      <div className={styles.archStatus}>
        ✓ All services healthy — request flowing end-to-end
      </div>
    </div>
  );
};

/* --- Main simulation card --- */
const AboutHeroSimulation = () => {
  const [phase, setPhase] = useState(PHASE_ORDER[0]);

  useEffect(() => {
    let cancelled = false;
    let i = 0;
    let timer;

    const tick = () => {
      if (cancelled) return;
      const name = PHASE_ORDER[i];
      setPhase(name);
      timer = setTimeout(() => {
        i = (i + 1) % PHASE_ORDER.length;
        tick();
      }, PHASE_DURATIONS[name]);
    };

    tick();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={styles.simCard}>
      <div className={styles.simHeader}>
        <span className={styles.simDot} style={{ background: "#ff5f56" }} />
        <span className={styles.simDot} style={{ background: "#ffbd2e" }} />
        <span className={styles.simDot} style={{ background: "#27ca40" }} />
        <span className={styles.simTitle}>{PHASE_LABELS[phase]}</span>
        <span className={styles.simStatus}>
          <span className={styles.simStatusDot} /> live
        </span>
      </div>
      <div className={styles.simStage} key={phase}>
        {phase === "code" && <CodePhase />}
        {phase === "dashboard" && <DashboardPhase />}
        {phase === "chat" && <ChatPhase />}
        {phase === "arch" && <ArchPhase />}
      </div>
    </div>
  );
};

export default AboutHeroSimulation;
