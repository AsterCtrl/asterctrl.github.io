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
          routeBasePath: '/',
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
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'XRobot Framework',
      items: [
        {to: '/', label: '文档', position: 'left'},
        {to: '/roadmap', label: '路线图', position: 'left'},
        {type: 'localeDropdown', position: 'right'},
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © ${new Date().getFullYear()} SHU RoboMaster`,
    },
  },
};

module.exports = config;
