// ESLint v9 flat config using Next's official flat preset
import next from 'eslint-config-next';

export default [
  // Ignore generated artifacts
  { ignores: ['graphql/types/**'] },
  ...next,
  {
    rules: {
      // Preserve intentional mount-flag pattern used in components/ScrollToTop
      'react-hooks/set-state-in-effect': 'off',
      // Keep flat config file simple and quiet
      'import/no-anonymous-default-export': 'off',
    },
  },
];
