// With the import keyword, all imported modules are pre-parsed.
console.log("running index.js")
import {sum} from "./sum.mjs"
console.log(sum(1,2))