// eslint.config.mjs
import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'no-console': 'off',
  },
}, {
  files: ['js/**/*.js', 'js-of-30-days/**/*.js', 'hand-write/**/*.js', 'algorithm/**/*.js'],
  rules: {
    'no-unused-vars': 'off',
    'unused-imports/no-unused-vars': 'off',
    'no-undef': 'off',
  },
})
