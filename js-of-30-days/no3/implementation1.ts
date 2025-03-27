// Equal or not Equal

type ToBeOrNotTobe = {
  toBe: (val: any) => boolean
  notToBe: (val: any) => boolean
}

const expect = (val: any): ToBeOrNotTobe => {
  return {
    toBe: (val1: any): boolean => {
      if (val !== val1) {
        throw new Error('Not Equal')
      }
      return true
    },
    notToBe: (val1: any): boolean => {
      if (val === val1) {
        throw new Error('Equal')
      }
      return true
    },
  }
}
/**
 * expect(5).toBe(5); // true
 * expect(5).notToBe(5); // throws "Equal"
 */

 console.log(expect(5).toBe(5))
