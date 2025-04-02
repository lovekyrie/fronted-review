// eslint.config.mjs
import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'no-console': 'off',
  },
}, {
  files: ['js/**/*.js'],
  rules: {
    'no-unused-vars': 'off',
    'unused-imports/no-unused-vars': 'off',
  },
})
