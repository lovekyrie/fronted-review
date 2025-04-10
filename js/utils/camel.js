/**
 * 1. foo Bar => fooBar
 * 2. foo-bar---- => fooBar
 * 3. foo_bar__ => fooBar
 */

function camelCase(string) {
  const camelCaseRegex = /[-_\s]+(.)?/g

  return string.replace(camelCaseRegex, (match, char) => {
    return char ? char.toUpperCase() : ''
  })
}

const str = 'foo Bar'
camelCase(str)
