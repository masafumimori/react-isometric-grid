import { extend } from '../../../src/utils/misc'

describe('index.ts', () => {
  test('should create object', () => {
    const obj = extend({}, { name: 'test', age: 99 })
    expect(obj).toEqual({ name: 'test', age: 99 })
  })
})
