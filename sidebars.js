// @ts-check

module.exports = {
  docs: [
    'intro',
    'concept',
    'architecture',
    'performance',
    'setup',
    'workspace',
    {
      type: 'category',
      label: '配置与部署',
      items: [
        'configuration/overview',
        'configuration/packages',
        'configuration/deployment',
      ],
    },
    {
      type: 'category',
      label: '基础编程',
      items: [
        'basic/module',
        'basic/messaging',
        'basic/executor-parameters',
      ],
    },
    'libxr-backend',
    'schema-typesupport',
    'can-transport',
    {
      type: 'category',
      label: '高级开发',
      items: [
        'advanced/backends',
        'advanced/faults',
        'advanced/legacy',
      ],
    },
    'debugging',
    'migration',
    'api',
    'contributing',
    'roadmap',
  ],
};
