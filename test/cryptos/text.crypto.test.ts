import { Text as TextCrypto } from '@jihyunlab/secret';
import { Text } from '../../bin/cryptos/text.crypto';

describe('Text', () => {
  const keyString = 'JihyunLab';
  const textString = 'Welcome to JihyunLab.';

  class CustomException {}

  beforeEach(() => {
    console.log = jest.fn();
    process.env.JIHYUNLAB_SECRET_KEY = keyString;
  });

  test('environment key()', () => {
    const encrypted = Text.encrypt(textString);
    const decrypted = Text.decrypt(String(encrypted));
    expect(decrypted).toBe(textString);
  });

  test('user key()', () => {
    const encrypted = Text.encrypt(textString, keyString);
    const decrypted = Text.decrypt(String(encrypted), keyString);
    expect(decrypted).toBe(textString);
  });

  test('encrypt(): exception(error)', () => {
    TextCrypto.encrypt = jest.fn().mockImplementationOnce(() => {
      throw new Error('error');
    });

    expect(() => {
      Text.encrypt(textString);
    }).not.toThrow(Error);
  });

  test('encrypt(): exception(custom)', () => {
    TextCrypto.encrypt = jest.fn().mockImplementationOnce(() => {
      throw new CustomException();
    });

    expect(() => {
      Text.encrypt(textString);
    }).not.toThrow(Error);
  });

  test('decrypt(): exception(error)', () => {
    TextCrypto.decrypt = jest.fn().mockImplementationOnce(() => {
      throw new Error('error');
    });

    expect(() => {
      Text.decrypt(textString);
    }).not.toThrow(Error);
  });

  test('decrypt(): exception(custom)', () => {
    TextCrypto.decrypt = jest.fn().mockImplementationOnce(() => {
      throw new CustomException();
    });

    expect(() => {
      Text.decrypt(textString);
    }).not.toThrow(Error);
  });

  test('decrypt(): exception(fail)', () => {
    expect(() => {
      Text.decrypt('');
    }).not.toThrow(Error);
  });
});
