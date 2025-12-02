import { Pipe, PipeTransform } from '@angular/core';
import memo from 'memo-decorator';

export const fibonnaci = (n: number): number => {
  if (n == 1 || n == 0) {
    return 1;
  }
  return fibonnaci(n - 1) + fibonnaci(n - 2);
};

//solution Recalculation of referentially transparent expressions

@Pipe({
  name: 'fib',
  standalone: true,
})
export class FibPipe implements PipeTransform {
  @memo()
  transform(n: number): number {
    const fib = fibonnaci(n);
    console.log({ n, fib });

    return fib;
  }
}
