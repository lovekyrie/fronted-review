/* eslint-disable prefer-rest-params */
'use strict'
function func(a) {
  console.log(a === arguments[0])
  a = 2
  console.log(a === arguments[0])
};
func(1)
