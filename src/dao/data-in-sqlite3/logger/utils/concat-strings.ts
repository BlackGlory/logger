export function concatStrings(strings: TemplateStringsArray, ...values: any[]): string {
  const result: string[] = []
  for (let i = 0; i < values.length; i++) {
    result.push(strings[i])
    if (typeof values[i] === 'string') result.push(values[i])
  }
  result.push(last(strings))
  return result.join('')
}

function last<T>(xs: ArrayLike<T>): T {
  return xs[xs.length - 1]
}
