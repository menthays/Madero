import Logger from '../src'
import { Level } from '../src/Logger';

describe('Unit Test', () => {
  it('Basic Test', () => {
    console.log = jest.fn();
    const logger = new Logger({
      level: Level.debug,
      label: 'hello',
    })
    logger.info('world')
    expect(console.log).toHaveBeenCalledWith('hello', 'info', 'world');
  })
})