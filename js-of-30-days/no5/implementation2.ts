function map(arr: number[], fn: (n: number, i: number) => number): number[] {
  const newArr: number[] = []
  for (let index = 0; index < arr.length; index++) {
    newArr[index] = fn(arr[index], index)
  }
  return newArr
}
