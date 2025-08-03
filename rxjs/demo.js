import { filter, map, of } from 'rxjs'

of(1, 2, 3)
  .pipe(
    map(x => x * x),
    filter(x => x % 2 !== 0),
  )
  .subscribe(x => console.log(`value: ${x}`))
