// @ts-check

const config = {
  title: 'AsterCtrl',
  tagline: 'Portable Modules for Linux and Zephyr targets.',
  url: 'https://asterctrl.github.io',
  baseUrl: '/',
  organizationName: 'AsterCtrl',
  projectName: 'asterctrl.github.io',
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
  i18n: {
    defaultLocale: 'zh-Hans',
    // Keep one honest locale until an actual English translation tree exists.
    locales: ['zh-Hans'],
    localeConfigs: {
      'zh-Hans': {label: '简体中文', htmlLang: 'zh-CN'},
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
      title: 'AsterCtrl',
      items: [
        {to: '/docs/', label: '文档', position: 'left'},
        {to: '/docs/graphs', label: '配置与部署', position: 'left'},
        {to: '/docs/architecture', label: '架构', position: 'left'},
        {to: '/docs/deployment', label: '部署', position: 'left'},
        {to: '/docs/transports', label: '通信', position: 'left'},
        {href: 'https://github.com/AsterCtrl/AsterCtrl/releases/tag/v0.2.0-alpha.1', label: 'v0.2.0-alpha.1', position: 'right'},
        {href: 'https://github.com/AsterCtrl', label: 'GitHub', position: 'right'},
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
            {label: '基础编程', to: '/docs/module'},
          ],
        },
        {
          title: '工程',
          items: [
            {label: '配置、通信与部署', to: '/docs/graphs'},
            {label: '配置与部署', to: '/docs/deployment'},
            {label: 'Zephyr 板卡', to: '/docs/zephyr'},
          ],
        },
        {
          title: '验证',
          items: [
            {label: '通信与资源', to: '/docs/transports'},
            {label: '调试', to: '/docs/debugging'},
            {label: '路线图', to: '/docs/roadmap'},
          ],
        },
        {
          title: '生态',
          items: [
            {label: 'AsterCtrl GitHub', href: 'https://github.com/AsterCtrl'},
            {label: 'AsterCtrl Core', href: 'https://github.com/AsterCtrl/AsterCtrl'},
            {label: 'Zephyr Boards', href: 'https://github.com/AsterCtrl/asterctrl-boards'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} AsterCtrl contributors`,
    },
  },
};

module.exports = config;
