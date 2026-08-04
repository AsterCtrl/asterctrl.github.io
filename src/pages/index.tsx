import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './home.module.css';

type Entry = {
  index: string;
  title: string;
  description: string;
  to: string;
  tag: string;
};

type Repository = {
  name: string;
  role: string;
  description: string;
  technology: string;
  href: string;
};

type Copy = {
  description: string;
  lead: string;
  primaryAction: string;
  secondaryAction: string;
  entryTitle: string;
  entryLead: string;
  entries: Entry[];
  architectureTitle: string;
  architectureLead: string;
  graphTitle: string;
  compileTitle: string;
  targetTitle: string;
  boundaryTitle: string;
  boundaryLead: string;
  boundaryItems: Array<{title: string; description: string}>;
  repositoryTitle: string;
  repositoryLead: string;
  repositoryAction: string;
  repositories: Repository[];
};

const COPY: Record<'zh' | 'en', Copy> = {
  zh: {
    description: '面向 MCU、Linux 与仿真的跨平台分布式控制框架。',
    lead: '应用描述控制行为，部署描述运行位置。AsterCtrl 在构建期组合 Module、生成静态路由并绑定平台能力，让同一套上层逻辑跨硬件与操作系统部署。',
    primaryAction: '开始使用',
    secondaryAction: '理解架构',
    entryTitle: '按任务进入文档',
    entryLead: '从 Module 开发、整机配置、部署编译或链路诊断开始，不需要先理解全部实现。',
    entries: [
      {index: '01', title: '搭建 Workspace', description: '安装工具，解析 Package，并完成首个 Host 构建。', to: '/docs/setup', tag: 'START'},
      {index: '02', title: '开发 Module', description: '使用生命周期、端口和 Executor 编写可移植逻辑。', to: '/docs/basic/module', tag: 'CODE'},
      {index: '03', title: '编译部署图', description: '将逻辑实例放到目标节点，自动生成本地与跨节点路由。', to: '/docs/configuration/deployment', tag: 'DEPLOY'},
      {index: '04', title: '分析运行状态', description: '检查消息年龄、deadline、队列水位和链路统计。', to: '/docs/debugging', tag: 'DEBUG'},
    ],
    architectureTitle: '逻辑、部署与平台各自独立',
    architectureLead: 'Node 是逻辑运行身份，不是板卡型号。替换硬件、RTOS、进程或传输后端时，Module 和消息契约保持不变。',
    graphTitle: '应用图',
    compileTitle: '部署编译器',
    targetTitle: '目标节点',
    boundaryTitle: '小而明确的框架核心',
    boundaryLead: 'AsterCtrl 不内置某一种被控对象。领域能力以独立 Package 组合，核心只提供可移植运行语义与生成工具。',
    boundaryItems: [
      {title: 'Runtime', description: '生命周期、Executor、参数、诊断与有界资源。'},
      {title: 'Contracts', description: 'Topic、Service、Action、Schema 与 TypeSupport。'},
      {title: 'Deployment', description: '实例放置、QoS、静态路由、预算与版本锁定。'},
      {title: 'Backends', description: 'libxr、裸机、RTOS、Linux、仿真与传输适配。'},
    ],
    repositoryTitle: '核心代码仓库',
    repositoryLead: '框架按职责拆分为独立 Package 仓库。Workspace 锁定版本并组合依赖，应用工程不需要复制或修改框架源码。',
    repositoryAction: '查看仓库',
    repositories: [
      {
        name: 'aster-runtime',
        role: '可移植运行时',
        description: '定义 Module 生命周期、Executor、消息通信、参数与诊断，是不依赖具体平台的框架核心。',
        technology: 'C++20 · PORTABLE',
        href: 'https://github.com/AsterCtrl/aster-runtime',
      },
      {
        name: 'aster-tools',
        role: '部署编译工具',
        description: '负责 Schema 校验、Package 解析、部署规划与确定性代码生成，提供 aster 命令行入口。',
        technology: 'PYTHON · CLI',
        href: 'https://github.com/AsterCtrl/aster-tools',
      },
      {
        name: 'aster-transports',
        role: '有界传输层',
        description: '实现 Channel 与内部 RPC 的有界传输后端，包含构建期编译的经典 CAN 数据面与控制面。',
        technology: 'C++20 · TRANSPORT',
        href: 'https://github.com/AsterCtrl/aster-transports',
      },
      {
        name: 'aster-libxr-backend',
        role: 'libxr 平台适配',
        description: '将 Runtime 与传输接口连接到 libxr 的时钟、I/O、队列、任务和诊断能力。',
        technology: 'C++20 · BACKEND',
        href: 'https://github.com/AsterCtrl/aster-libxr-backend',
      },
    ],
  },
  en: {
    description: 'A cross-platform distributed control framework for MCUs, Linux, and simulation.',
    lead: 'Applications describe control behavior; deployments describe where it runs. AsterCtrl composes Modules, generates static routes, and binds platform capabilities at build time so the same logic can move across hardware and operating systems.',
    primaryAction: 'Get started',
    secondaryAction: 'Understand the architecture',
    entryTitle: 'Enter by task',
    entryLead: 'Start with Module development, system configuration, deployment compilation, or link diagnostics without reading every implementation detail first.',
    entries: [
      {index: '01', title: 'Set up a Workspace', description: 'Install the tools, resolve Packages, and complete a Host build.', to: '/docs/setup', tag: 'START'},
      {index: '02', title: 'Develop a Module', description: 'Write portable logic with lifecycle, ports, and Executors.', to: '/docs/basic/module', tag: 'CODE'},
      {index: '03', title: 'Compile a deployment', description: 'Place logical instances and generate local or remote routes.', to: '/docs/configuration/deployment', tag: 'DEPLOY'},
      {index: '04', title: 'Inspect runtime state', description: 'Trace message age, deadlines, queue watermarks, and link metrics.', to: '/docs/debugging', tag: 'DEBUG'},
    ],
    architectureTitle: 'Logic, deployment, and platform stay separate',
    architectureLead: 'A Node is a logical runtime identity, not a board model. Modules and message contracts remain stable when hardware, RTOS, process, or transport backends change.',
    graphTitle: 'Application graph',
    compileTitle: 'Deployment compiler',
    targetTitle: 'Target nodes',
    boundaryTitle: 'A small, explicit framework core',
    boundaryLead: 'AsterCtrl does not embed one control architecture. Domain capabilities are composed as Packages; the core provides portable runtime semantics and generation tools.',
    boundaryItems: [
      {title: 'Runtime', description: 'Lifecycle, Executors, parameters, diagnostics, and bounded resources.'},
      {title: 'Contracts', description: 'Topic, Service, Action, Schema, and TypeSupport.'},
      {title: 'Deployment', description: 'Placement, QoS, static routes, budgets, and version locks.'},
      {title: 'Backends', description: 'libxr, bare metal, RTOS, Linux, simulation, and transport adapters.'},
    ],
    repositoryTitle: 'Core repositories',
    repositoryLead: 'The framework is split into independently versioned Package repositories by responsibility. Workspaces lock and compose them without copying framework source into applications.',
    repositoryAction: 'View repository',
    repositories: [
      {
        name: 'aster-runtime',
        role: 'Portable runtime',
        description: 'Defines Module lifecycle, Executors, messaging, parameters, and diagnostics without depending on a specific platform.',
        technology: 'C++20 · PORTABLE',
        href: 'https://github.com/AsterCtrl/aster-runtime',
      },
      {
        name: 'aster-tools',
        role: 'Deployment compiler',
        description: 'Validates schemas, resolves Packages, plans deployments, and generates deterministic code through the aster CLI.',
        technology: 'PYTHON · CLI',
        href: 'https://github.com/AsterCtrl/aster-tools',
      },
      {
        name: 'aster-transports',
        role: 'Bounded transports',
        description: 'Provides bounded Channel and internal RPC transports, including the deployment-compiled classic CAN data plane.',
        technology: 'C++20 · TRANSPORT',
        href: 'https://github.com/AsterCtrl/aster-transports',
      },
      {
        name: 'aster-libxr-backend',
        role: 'libxr integration',
        description: 'Connects Runtime and transport contracts to libxr clocks, I/O, queues, tasks, and diagnostics.',
        technology: 'C++20 · BACKEND',
        href: 'https://github.com/AsterCtrl/aster-libxr-backend',
      },
    ],
  },
};

export default function Home(): React.ReactElement {
  const {i18n} = useDocusaurusContext();
  const copy = COPY[i18n.currentLocale === 'en' ? 'en' : 'zh'];

  return (
    <Layout title="AsterCtrl" description={copy.description}>
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={`container ${styles.heroInner}`}>
            <div className={styles.heroCopy}>
              <div className={styles.eyebrow}><span /> STATIC / BOUNDED / DISTRIBUTED</div>
              <h1>AsterCtrl</h1>
              <p>{copy.lead}</p>
              <div className={styles.heroActions}>
                <Link className={styles.primaryAction} to="/docs/">{copy.primaryAction}</Link>
                <Link className={styles.secondaryAction} to="/docs/architecture">{copy.secondaryAction}</Link>
              </div>
              <dl className={styles.heroFacts}>
                <div><dt>API</dt><dd>Topic · Service · Action</dd></div>
                <div><dt>EXECUTION</dt><dd>Static · bounded</dd></div>
                <div><dt>TARGETS</dt><dd>MCU · Linux · Sim</dd></div>
              </dl>
            </div>

            <div className={styles.heroDiagram} aria-label={copy.architectureTitle}>
              <div className={styles.diagramColumn}>
                <span>{copy.graphTitle}</span>
                <div className={styles.diagramNode}><strong>acquisition</strong><small>Module</small></div>
                <div className={styles.diagramNode}><strong>control_loop</strong><small>Module</small></div>
                <div className={styles.diagramNode}><strong>safety</strong><small>Module</small></div>
              </div>
              <div className={styles.compilerBlock}>
                <span>ASTER</span>
                <strong>{copy.compileTitle}</strong>
                <code>graph + profiles</code>
              </div>
              <div className={styles.diagramColumn}>
                <span>{copy.targetTitle}</span>
                <div className={`${styles.diagramNode} ${styles.targetNode}`}><strong>realtime_control</strong><small>MCU target</small></div>
                <div className={`${styles.diagramNode} ${styles.targetNode}`}><strong>supervisory_compute</strong><small>Linux target</small></div>
                <div className={`${styles.diagramNode} ${styles.targetNode}`}><strong>simulation</strong><small>Host target</small></div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.entryBand}>
          <div className="container">
            <div className={styles.sectionHeading}>
              <div><span>DOCUMENTATION</span><h2>{copy.entryTitle}</h2></div>
              <p>{copy.entryLead}</p>
            </div>
            <div className={styles.entryGrid}>
              {copy.entries.map((entry) => (
                <Link className={styles.entryCard} to={entry.to} key={entry.index}>
                  <div className={styles.entryMeta}><span>{entry.index}</span><span>{entry.tag}</span></div>
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
              <div><span>PORTABLE BY CONSTRUCTION</span><h2>{copy.architectureTitle}</h2></div>
              <p>{copy.architectureLead}</p>
            </div>
            <div className={styles.deploymentFlow}>
              <div><span>01</span><strong>Application</strong><code>instances + ports</code></div>
              <i aria-hidden="true">→</i>
              <div><span>02</span><strong>Deployment</strong><code>placement + QoS</code></div>
              <i aria-hidden="true">→</i>
              <div><span>03</span><strong>Target Profiles</strong><code>BSP + OS + links</code></div>
              <i aria-hidden="true">→</i>
              <div><span>04</span><strong>Generated Runtime</strong><code>composition + routes</code></div>
            </div>
          </div>
        </section>

        <section className={styles.boundaryBand}>
          <div className="container">
            <div className={styles.sectionHeading}>
              <div><span>CORE BOUNDARY</span><h2>{copy.boundaryTitle}</h2></div>
              <p>{copy.boundaryLead}</p>
            </div>
            <div className={styles.boundaryGrid}>
              {copy.boundaryItems.map((item, index) => (
                <article key={item.title}>
                  <span>0{index + 1}</span><h3>{item.title}</h3><p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.repositoryBand} id="repositories">
          <div className="container">
            <div className={styles.sectionHeading}>
              <div><span>OPEN SOURCE</span><h2>{copy.repositoryTitle}</h2></div>
              <p>{copy.repositoryLead}</p>
            </div>
            <div className={styles.repositoryGrid}>
              {copy.repositories.map((repository, index) => (
                <a
                  className={styles.repositoryCard}
                  href={repository.href}
                  key={repository.name}
                  rel="noopener noreferrer"
                  target="_blank">
                  <div className={styles.repositoryMeta}>
                    <span>0{index + 1}</span>
                    <span>{repository.technology}</span>
                  </div>
                  <h3>{repository.name}</h3>
                  <strong>{repository.role}</strong>
                  <p>{repository.description}</p>
                  <span className={styles.repositoryLink}>{copy.repositoryAction}<span aria-hidden="true">↗</span></span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
