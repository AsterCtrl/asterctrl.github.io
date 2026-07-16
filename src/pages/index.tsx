import type {CSSProperties} from 'react';
import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './home.module.css';

type Entry = {
  index: string;
  title: string;
  description: string;
  to: string;
  tag: string;
};

type Copy = {
  title: string;
  description: string;
  eyebrow: string;
  lead: string;
  primaryAction: string;
  secondaryAction: string;
  entryEyebrow: string;
  entryTitle: string;
  entryLead: string;
  entries: Entry[];
  architectureEyebrow: string;
  architectureTitle: string;
  architectureLead: string;
  evidenceEyebrow: string;
  evidenceTitle: string;
  evidenceLead: string;
  performanceAction: string;
  firmwareAction: string;
};

const COPY: Record<'zh' | 'en', Copy> = {
  zh: {
    title: 'XRobot Distributed Framework',
    description: '面向 MCU、Linux 与未来仿真的静态分布式机器人运行时。',
    eyebrow: 'STATIC / BOUNDED / DISTRIBUTED',
    lead: '用同一套机器人逻辑描述 F4 与 H7 双板系统，并为未来 Linux 与仿真节点保留相同的部署语义。硬件接线、节点放置和通信路由由配置与编译器决定。',
    primaryAction: '开始阅读',
    secondaryAction: '查看双板部署',
    entryEyebrow: 'DOCUMENT ENTRY MAP',
    entryTitle: '从当前任务进入',
    entryLead: '不要求先通读整套框架。选择你正在做的事情，直接进入对应的配置、代码和验证路径。',
    entries: [
      {
        index: '01',
        title: '第一次搭建环境',
        description: '准备工具链，理解 workspace，并完成首个可验证构建。',
        to: '/docs/setup',
        tag: 'START',
      },
      {
        index: '02',
        title: '开发一个 Module',
        description: '使用生命周期、端口和执行上下文编写可移植机器人模块。',
        to: '/docs/basic/module',
        tag: 'CODE',
      },
      {
        index: '03',
        title: '部署到多块板',
        description: '用 deployment.yaml 放置实例并生成本地与跨板路由。',
        to: '/docs/configuration/deployment',
        tag: 'DEPLOY',
      },
      {
        index: '04',
        title: '定位失联与故障',
        description: '检查 freshness、握手、队列水位、故障码和链路统计。',
        to: '/docs/debugging',
        tag: 'DEBUG',
      },
    ],
    architectureEyebrow: 'ARCHITECTURE BASELINE',
    architectureTitle: '一套 API，三层确定性',
    architectureLead: '应用只表达机器人行为。Runtime 保证消息与执行语义，Backend 才接触 libxr、RTOS 和具体外设。',
    evidenceEyebrow: 'VERIFIED VERTICAL SLICE',
    evidenceTitle: '以构建证据描述能力',
    evidenceLead: '首个双板纵向切片已生成并链接完整固件。软件证据与硬件验收边界分别记录，不用“理论可行”代替结果。',
    performanceAction: '查看性能与边界',
    firmwareAction: '查看固件证据',
  },
  en: {
    title: 'XRobot Distributed Framework',
    description: 'A static distributed robot runtime for MCUs, Linux, and future simulation.',
    eyebrow: 'STATIC / BOUNDED / DISTRIBUTED',
    lead: 'Describe the F4 and H7 system with one robot application while preserving the same deployment semantics for future Linux and simulation nodes. Configuration and code generation own wiring, placement, and transport routes.',
    primaryAction: 'Read the docs',
    secondaryAction: 'Inspect dual-board deployment',
    entryEyebrow: 'DOCUMENT ENTRY MAP',
    entryTitle: 'Enter from the task at hand',
    entryLead: 'You do not need to read the framework front to back. Start from the configuration, code, or verification path that matches your current task.',
    entries: [
      {
        index: '01',
        title: 'Set up the environment',
        description: 'Prepare the toolchain, understand the workspace, and complete a verified build.',
        to: '/docs/setup',
        tag: 'START',
      },
      {
        index: '02',
        title: 'Build a Module',
        description: 'Use lifecycle, ports, and execution context to write portable robot logic.',
        to: '/docs/basic/module',
        tag: 'CODE',
      },
      {
        index: '03',
        title: 'Deploy across boards',
        description: 'Place instances in deployment.yaml and generate local or cross-node routes.',
        to: '/docs/configuration/deployment',
        tag: 'DEPLOY',
      },
      {
        index: '04',
        title: 'Trace link failures',
        description: 'Inspect freshness, handshakes, queue watermarks, fault codes, and link stats.',
        to: '/docs/debugging',
        tag: 'DEBUG',
      },
    ],
    architectureEyebrow: 'ARCHITECTURE BASELINE',
    architectureTitle: 'One API, three layers of certainty',
    architectureLead: 'Applications express robot behavior. Runtime owns messaging and execution semantics. Only backends touch libxr, RTOS APIs, and concrete peripherals.',
    evidenceEyebrow: 'VERIFIED VERTICAL SLICE',
    evidenceTitle: 'Capabilities backed by build evidence',
    evidenceLead: 'The first dual-board vertical slice now produces complete linked firmware. Software evidence and hardware acceptance remain explicitly separate.',
    performanceAction: 'Performance and limits',
    firmwareAction: 'Firmware evidence',
  },
};

const LAYERS = {
  zh: [
    {
      label: 'APPLICATION',
      title: '机器人行为',
      items: ['Module', 'Topic', 'Service', 'Action'],
      description: '只依赖稳定能力与消息契约，不暴露 HAL、FreeRTOS 或 libxr 类型。',
    },
    {
      label: 'RUNTIME',
      title: '执行与通信语义',
      items: ['Schema', 'Executor', 'QoS', 'Freshness'],
      description: '静态资源、有界队列、生命周期、失联策略与部署握手集中在这一层。',
    },
    {
      label: 'BACKEND',
      title: '平台与设备适配',
      items: ['libxr', 'BSP', 'CAN', 'UART / USB'],
      description: '板级资源、驱动和 RTOS 细节留在边界内，可随目标板替换。',
    },
  ],
  en: [
    {
      label: 'APPLICATION',
      title: 'Robot behavior',
      items: ['Module', 'Topic', 'Service', 'Action'],
      description: 'Depends on stable capabilities and contracts, with no HAL, FreeRTOS, or libxr types.',
    },
    {
      label: 'RUNTIME',
      title: 'Execution and transport semantics',
      items: ['Schema', 'Executor', 'QoS', 'Freshness'],
      description: 'Static resources, bounded queues, lifecycle, stale policy, and handshakes live here.',
    },
    {
      label: 'BACKEND',
      title: 'Platform and device adaptation',
      items: ['libxr', 'BSP', 'CAN', 'UART / USB'],
      description: 'Board resources, drivers, and RTOS details stay inside replaceable platform boundaries.',
    },
  ],
};

const EVIDENCE = {
  zh: [
    {value: '2', label: '已链接 MCU 固件'},
    {value: '24', label: '已锁定独立仓库'},
    {value: '0', label: 'ELF 未解析符号'},
    {value: '60.563%', label: '最坏情况 CAN 预算'},
  ],
  en: [
    {value: '2', label: 'linked MCU firmware'},
    {value: '24', label: 'locked package repositories'},
    {value: '0', label: 'undefined ELF symbols'},
    {value: '60.563%', label: 'worst-case CAN budget'},
  ],
};

export default function Home(): React.ReactElement {
  const {i18n} = useDocusaurusContext();
  const locale = i18n.currentLocale === 'en' ? 'en' : 'zh';
  const copy = COPY[locale];
  const layers = LAYERS[locale];
  const evidence = EVIDENCE[locale];
  const heroLight = useBaseUrl('/img/framework-hero-light.png');
  const heroDark = useBaseUrl('/img/framework-hero-dark.png');
  const heroStyle = {
    '--home-hero-light': `url("${heroLight}")`,
    '--home-hero-dark': `url("${heroDark}")`,
  } as CSSProperties;

  return (
    <Layout title={copy.title} description={copy.description}>
      <main className={styles.page}>
        <section className={styles.hero} style={heroStyle}>
          <div className={`container ${styles.heroInner}`}>
            <div className={styles.heroCopy}>
              <div className={styles.eyebrow}>
                <span className={styles.liveDot} aria-hidden="true" />
                {copy.eyebrow}
              </div>
              <h1>{copy.title}</h1>
              <p>{copy.lead}</p>
              <div className={styles.heroActions}>
                <Link className={styles.primaryAction} to="/docs/">
                  {copy.primaryAction}
                </Link>
                <Link className={styles.secondaryAction} to="/docs/configuration/deployment">
                  {copy.secondaryAction}
                </Link>
              </div>
              <dl className={styles.heroFacts}>
                <div>
                  <dt>MCU</dt>
                  <dd>STM32 F4 / H7</dd>
                </div>
                <div>
                  <dt>RUNTIME</dt>
                  <dd>Static + bounded</dd>
                </div>
                <div>
                  <dt>LINK</dt>
                  <dd>Compact CAN</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className={styles.entryBand}>
          <div className="container">
            <div className={styles.sectionHeading}>
              <div>
                <span>{copy.entryEyebrow}</span>
                <h2>{copy.entryTitle}</h2>
              </div>
              <p>{copy.entryLead}</p>
            </div>
            <div className={styles.entryGrid}>
              {copy.entries.map((entry) => (
                <Link className={styles.entryCard} to={entry.to} key={entry.index}>
                  <div className={styles.entryMeta}>
                    <span>{entry.index}</span>
                    <span>{entry.tag}</span>
                  </div>
                  <h3>{entry.title}</h3>
                  <p>{entry.description}</p>
                  <span className={styles.entryArrow} aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.architectureBand}>
          <div className="container">
            <div className={`${styles.sectionHeading} ${styles.sectionHeadingDark}`}>
              <div>
                <span>{copy.architectureEyebrow}</span>
                <h2>{copy.architectureTitle}</h2>
              </div>
              <p>{copy.architectureLead}</p>
            </div>
            <div className={styles.layerGrid}>
              {layers.map((layer, index) => (
                <article className={styles.layer} key={layer.label}>
                  <div className={styles.layerIndex}>0{index + 1}</div>
                  <span className={styles.layerLabel}>{layer.label}</span>
                  <h3>{layer.title}</h3>
                  <div className={styles.layerItems}>
                    {layer.items.map((item) => <code key={item}>{item}</code>)}
                  </div>
                  <p>{layer.description}</p>
                </article>
              ))}
            </div>
            <div className={styles.deploymentRail} aria-label="Generated deployment topology">
              <span>F4 / GIMBAL</span>
              <i aria-hidden="true" />
              <strong>GENERATED ROUTES</strong>
              <i aria-hidden="true" />
              <span>H7 / CHASSIS</span>
              <i aria-hidden="true" />
              <span className={styles.futureNode}>LINUX / SIM (FUTURE)</span>
            </div>
          </div>
        </section>

        <section className={styles.evidenceBand}>
          <div className={`container ${styles.evidenceLayout}`}>
            <div className={styles.evidenceCopy}>
              <span>{copy.evidenceEyebrow}</span>
              <h2>{copy.evidenceTitle}</h2>
              <p>{copy.evidenceLead}</p>
              <div className={styles.evidenceActions}>
                <Link to="/docs/performance">{copy.performanceAction} →</Link>
                <Link to="/docs/configuration/firmware">{copy.firmwareAction} →</Link>
              </div>
            </div>
            <dl className={styles.evidenceGrid}>
              {evidence.map((item) => (
                <div key={item.label}>
                  <dt>{item.value}</dt>
                  <dd>{item.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>
    </Layout>
  );
}
