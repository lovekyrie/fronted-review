// eslint.config.mjs
import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'no-console': 'off',
  },
  ignores: ['interview/**/*.md'],
}, {
  files: ['js/**/*.js', 'js-of-30-days/**/*.js', 'hand-write/**/*.js', 'algorithm/**/*.js', 'js-questions/**/*.js', 'js-questions/nowcoder/**/*.js'],
  rules: {
    'no-unused-vars': 'off',
    'unused-imports/no-unused-vars': 'off',
    'no-undef': 'off',
    'regexp/no-unused-capturing-group': 'off',
  },
})
