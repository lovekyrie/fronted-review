// eslint.config.mjs
import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'no-console': 'off',
  },
  ignores: ['interview/**/*.md'],
}, {
  files: ['js/**/*.js', 'js-of-30-days/**/*.js', 'hand-write/**/*.js', 'algorithm/**/*.js', 'js-questions/**/*.js', 'js-questions/nowcoder/**/*.js', 'js-utils/**/*.js'],
  rules: {
    'no-unused-vars': 'off',
    'unused-imports/no-unused-vars': 'off',
    'no-undef': 'off',
    'regexp/no-unused-capturing-group': 'off',
    'regexp/no-super-linear-backtracking': 'off',
    'regexp/no-dupe-disjunctions': 'off',
    'regexp/optimal-quantifier-concatenation': 'off',
  },
})
