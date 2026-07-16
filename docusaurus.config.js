// @ts-check

const config = {
  title: 'XRobot Distributed Framework',
  tagline: 'Static, bounded, cross-platform robot runtime',
  favicon: 'img/favicon.svg',
  url: 'https://shu-robomaster.github.io',
  baseUrl: '/xrobot-docs/',
  organizationName: 'shu-robomaster',
  projectName: 'xrobot-docs',
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans', 'en'],
    localeConfigs: {
      'zh-Hans': {label: '简体中文', htmlLang: 'zh-CN'},
      en: {label: 'English', htmlLang: 'en'},
    },
  },
  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/docs',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: undefined,
          showLastUpdateTime: false,
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'XRobot Distributed',
      logo: {
        alt: 'XRobot Distributed Framework',
        src: 'img/favicon.svg',
      },
      items: [
        {to: '/docs/', label: '文档', position: 'left'},
        {to: '/docs/concept', label: '设计思想', position: 'left'},
        {to: '/docs/architecture', label: '架构', position: 'left'},
        {to: '/docs/configuration/deployment', label: '部署', position: 'left'},
        {to: '/docs/performance', label: '性能', position: 'left'},
        {type: 'localeDropdown', position: 'right'},
        {
          href: 'https://github.com/xrobot-org/XRobot',
          label: '上游 XRobot',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '开始',
          items: [
            {label: '框架概览', to: '/docs/'},
            {label: '环境搭建', to: '/docs/setup'},
            {label: '基础编程', to: '/docs/basic/module'},
          ],
        },
        {
          title: '工程',
          items: [
            {label: 'Workspace', to: '/docs/workspace'},
            {label: '配置与部署', to: '/docs/configuration/overview'},
            {label: '固件生成', to: '/docs/configuration/firmware'},
          ],
        },
        {
          title: '验证',
          items: [
            {label: '性能与资源', to: '/docs/performance'},
            {label: '调试', to: '/docs/debugging'},
            {label: '路线图', to: '/docs/roadmap'},
          ],
        },
        {
          title: '生态',
          items: [
            {label: 'XRobot', href: 'https://github.com/xrobot-org/XRobot'},
            {label: 'libxr', href: 'https://github.com/Jiu-xiao/libxr'},
            {label: 'AimRT', href: 'https://github.com/AimRT/AimRT'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} SHU RoboMaster`,
    },
  },
};

module.exports = config;
