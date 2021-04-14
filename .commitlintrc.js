const types = {
  feat: {
    description: 'A new feature',
    title: 'Features',
  },
  fix: {
    description: 'A bug fix',
    title: 'Bug Fixes',
  },
  docs: {
    description: 'Documentation only changes',
    title: 'Documentation',
  },
  style: {
    description:
      'Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)',
    title: 'Styles',
  },
  refactor: {
    description: 'A code change that neither fixes a bug nor adds a feature',
    title: 'Code Refactoring',
  },
  perf: {
    description: 'A code change that improves performance',
    title: 'Performance Improvements',
  },
  test: {
    description: 'Adding missing tests or correcting existing tests',
    title: 'Tests',
  },
  build: {
    description:
      'Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)',
    title: 'Builds',
  },
  ci: {
    description:
      'Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)',
    title: 'Continuous Integrations',
  },
  chore: {
    description: "Other changes that don't modify src or test files",
    title: 'Chores',
  },
  revert: {
    description: 'Reverts a previous commit',
    title: 'Reverts',
  },
};

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Follow the commit-types used by commitizen (https://git.io/Je4pr).
    'type-enum': [2, 'always', Object.keys(types)],
    // Blow lines are optional.
    'header-max-length': [2, 'always', 100],
    'body-max-line-length': [2, 'always', 100],
    'footer-max-line-length': [2, 'always', 100],
  },
};
