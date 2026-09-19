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
  releaseLabel: string;
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
    description: '原生运行于 Zephyr 与 Linux 的确定性控制框架。',
    lead: 'Module 描述控制行为，runtime.yaml 选择 Linux 上的实例和运行策略。跨节点或 Zephyr 部署再增加 deployment.yaml；同一份业务源码按目标平台重新编译。',
    releaseLabel: 'v0.2.0-alpha.1 · LINUX HOST / COMPILE-ONLY ZEPHYR',
    primaryAction: '开始使用',
    secondaryAction: '理解架构',
    entryTitle: '按任务进入文档',
    entryLead: '从 Module 开发、Runtime 配置、部署准备或调试开始，不需要先理解全部实现。',
    entries: [
      {index: '01', title: '搭建 Workspace', description: '安装工具，解析 Package，并完成首个 Host 构建。', to: '/docs/setup', tag: 'START'},
      {index: '02', title: '开发 Module', description: '使用生命周期、Topic/RPC 和 Executor 编写可移植逻辑。', to: '/docs/module', tag: 'CODE'},
      {index: '03', title: '配置与部署', description: '先用 runtime.yaml 启动 Linux；跨节点和 Zephyr 路径正在实现。', to: '/docs/deployment', tag: 'DEPLOY'},
      {index: '04', title: '分析运行状态', description: '检查消息年龄、deadline、队列水位和链路统计。', to: '/docs/debugging', tag: 'DEBUG'},
    ],
    architectureTitle: '配置、部署与平台各自独立',
    architectureLead: 'runtime.yaml 负责 Linux 实例；deployment.yaml 只在跨节点或 Zephyr 时描述放置。Module 和消息契约不随目标平台改变。',
    graphTitle: 'Runtime 配置',
    compileTitle: 'Aster 解析',
    targetTitle: '目标平台',
    boundaryTitle: '小而明确的框架核心',
    boundaryLead: 'AsterCtrl 不内置某一种被控对象。领域能力以独立 Package 组合，核心只提供可移植运行语义与生成工具。',
    boundaryItems: [
      {title: 'Runtime', description: '生命周期、Executor、参数、诊断与有界资源。'},
      {title: 'Contracts', description: 'Channel、RPC、bounded Protobuf 与 TypeSupport。'},
      {title: 'Deployment', description: '跨节点实例放置、Topic/RPC 契约与平台策略。'},
      {title: 'Adapters', description: 'Linux、Zephyr、Clock 与 Transport 的具体实现。'},
    ],
    repositoryTitle: '两个官方代码仓库',
    repositoryLead: 'Runtime、CLI、协议和 Transport 在核心单仓中原子演进；官方 Zephyr board 独立发布。',
    repositoryAction: '查看仓库',
    repositories: [
      {
        name: 'AsterCtrl',
        role: '核心框架单仓',
        description: '包含 C++20 Runtime、aster CLI、bounded Protobuf、Transport 回归实现、示例与技术文档。',
        technology: 'C++20 · PYTHON',
        href: 'https://github.com/AsterCtrl/AsterCtrl',
      },
      {
        name: 'asterctrl-boards',
        role: '官方 Zephyr 板卡',
        description: '提供 dev_c 与 mc02 的 Zephyr board、Devicetree、qualification 固件和可校验证据记录。',
        technology: 'ZEPHYR · DTS',
        href: 'https://github.com/AsterCtrl/asterctrl-boards',
      },
    ],
  },
  en: {
    description: 'A deterministic control framework native to Zephyr and Linux.',
    lead: 'Modules describe control behavior; runtime.yaml selects Linux instances and policies. Cross-node or Zephyr deployment adds deployment.yaml, while the same business source is rebuilt for each target.',
    releaseLabel: 'v0.2.0-alpha.1 · LINUX HOST / COMPILE-ONLY ZEPHYR',
    primaryAction: 'Get started',
    secondaryAction: 'Understand the architecture',
    entryTitle: 'Enter by task',
    entryLead: 'Start with Module development, Runtime configuration, deployment preparation, or debugging without reading every implementation detail first.',
    entries: [
      {index: '01', title: 'Set up a Workspace', description: 'Install the tools, resolve Packages, and complete a Host build.', to: '/docs/setup', tag: 'START'},
      {index: '02', title: 'Develop a Module', description: 'Write portable logic with lifecycle, Topic/RPC, and Executors.', to: '/docs/module', tag: 'CODE'},
      {index: '03', title: 'Configure and deploy', description: 'Run Linux with runtime.yaml; cross-node and Zephyr paths are in progress.', to: '/docs/deployment', tag: 'DEPLOY'},
      {index: '04', title: 'Inspect runtime state', description: 'Trace message age, deadlines, queue watermarks, and link metrics.', to: '/docs/debugging', tag: 'DEBUG'},
    ],
    architectureTitle: 'Configuration, deployment, and platform stay separate',
    architectureLead: 'runtime.yaml owns Linux instances; deployment.yaml adds placement for cross-node or Zephyr targets. Modules and message contracts remain stable across platforms.',
    graphTitle: 'Runtime config',
    compileTitle: 'Aster resolver',
    targetTitle: 'Target platforms',
    boundaryTitle: 'A small, explicit framework core',
    boundaryLead: 'AsterCtrl does not embed one control architecture. Domain capabilities are composed as Packages; the core provides portable runtime semantics and generation tools.',
    boundaryItems: [
      {title: 'Runtime', description: 'Lifecycle, Executors, parameters, diagnostics, and bounded resources.'},
      {title: 'Contracts', description: 'Channel, RPC, bounded Protobuf, and TypeSupport.'},
      {title: 'Deployment', description: 'Placement, Topic/RPC contracts, and platform policy.'},
      {title: 'Adapters', description: 'Linux, Zephyr, Clock, and Transport implementations.'},
    ],
    repositoryTitle: 'Two official repositories',
    repositoryLead: 'Runtime, CLI, protocol, and Transports evolve atomically in the core monorepo; official Zephyr boards are released separately.',
    repositoryAction: 'View repository',
    repositories: [
      {
        name: 'AsterCtrl',
        role: 'Core framework monorepo',
        description: 'C++20 Runtime, aster CLI, bounded Protobuf, Transport regressions, examples, and technical documentation.',
        technology: 'C++20 · PYTHON',
        href: 'https://github.com/AsterCtrl/AsterCtrl',
      },
      {
        name: 'asterctrl-boards',
        role: 'Official Zephyr boards',
        description: 'Zephyr board definitions, qualification firmware, and verifiable evidence records for dev_c and mc02.',
        technology: 'ZEPHYR · DTS',
        href: 'https://github.com/AsterCtrl/asterctrl-boards',
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
              <a
                className={styles.releaseTag}
                href="https://github.com/AsterCtrl/AsterCtrl/releases/tag/v0.2.0-alpha.1"
                rel="noopener noreferrer"
                target="_blank">
                {copy.releaseLabel}<span aria-hidden="true">↗</span>
              </a>
              <h1>AsterCtrl</h1>
              <p>{copy.lead}</p>
              <div className={styles.heroActions}>
                <Link className={styles.primaryAction} to="/docs/">{copy.primaryAction}</Link>
                <Link className={styles.secondaryAction} to="/docs/architecture">{copy.secondaryAction}</Link>
              </div>
              <dl className={styles.heroFacts}>
                <div><dt>INTERFACE</dt><dd>Channel · RPC</dd></div>
                <div><dt>EXECUTION</dt><dd>Static · bounded</dd></div>
                <div><dt>TARGETS</dt><dd>Zephyr · Linux · Sim</dd></div>
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
                <code>runtime + deployment</code>
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
              <div><span>01</span><strong>Runtime YAML</strong><code>instances + policies</code></div>
              <i aria-hidden="true">→</i>
              <div><span>02</span><strong>Deployment</strong><code>placement + QoS</code></div>
              <i aria-hidden="true">→</i>
              <div><span>03</span><strong>Platform Adapters</strong><code>board + OS + links</code></div>
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
