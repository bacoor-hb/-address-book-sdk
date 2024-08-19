import { welcome } from '../src';

describe('Test', () => {
  describe('@address-book/sdk', () => {
    it('should return a string containing the message', () => {
      const message = 'Welcome to Address Book!';

      const result = welcome();

      expect(result).toMatch(message);
    });
  });
});
