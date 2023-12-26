import { File } from '../../bin/cryptos/file.crypto';
import { File as FileCrypto, LocationHelper } from '@jihyunlab/secret';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';

describe('File', () => {
  const processEnv = process.env;

  const keyString = 'JihyunLab';
  const textString = 'Welcome to JihyunLab.';

  const base = 'test-file';

  const dir = join(base, 'dir');
  const file = join(base, 'plain.txt');
  const fileEnc = join(base, 'plain_enc.txt');
  const fileDec = join(base, 'plain_dec.txt');

  class CustomException {}

  beforeAll(() => {
    mkdirSync(base, { recursive: true });
    mkdirSync(dir, { recursive: true });
  });

  afterAll(() => {
    rmSync(dir, { recursive: true, force: true });
    rmSync(base, { recursive: true, force: true });
  });

  beforeEach(() => {
    console.log = jest.fn();

    process.env = {
      ...processEnv,
      JIHYUNLAB_SECRET_KEY: keyString,
    };

    writeFileSync(file, textString);
  });

  afterEach(() => {
    process.env = processEnv;

    rmSync(file, { force: true });
  });

  test('environment key()', () => {
    const encrypted = File.encrypt(file);
    const decrypted = File.decrypt(file);

    expect(encrypted).toBe(LocationHelper.toRelative(file));
    expect(decrypted).toBe(LocationHelper.toRelative(file));
  });

  test('user key()', () => {
    const encrypted = File.encrypt(file, undefined, false, keyString);
    const decrypted = File.decrypt(file, undefined, false, keyString);

    expect(encrypted).toBe(LocationHelper.toRelative(file));
    expect(decrypted).toBe(LocationHelper.toRelative(file));
  });

  test('output()', () => {
    const encrypted = File.encrypt(file, fileEnc);
    const decrypted = File.decrypt(fileEnc, fileDec);

    expect(encrypted).toBe(LocationHelper.toRelative(fileEnc));
    expect(decrypted).toBe(LocationHelper.toRelative(fileDec));
    expect(readFileSync(file)).toStrictEqual(readFileSync(fileDec));
  });

  test('bak()', () => {
    const encrypted = File.encrypt(file, fileEnc, true);
    const decrypted = File.decrypt(fileEnc, fileDec, true);

    expect(encrypted).toBe(LocationHelper.toRelative(fileEnc));
    expect(decrypted).toBe(LocationHelper.toRelative(fileDec));
    expect(readFileSync(file)).toStrictEqual(readFileSync(`${file}.bak`));
    expect(readFileSync(fileEnc)).toStrictEqual(readFileSync(`${fileEnc}.bak`));
  });

  test('encrypt(): exception(not exist)', () => {
    expect(() => {
      File.encrypt('temp');
    }).not.toThrow(Error);
  });

  test('encrypt(): exception(error)', () => {
    FileCrypto.encrypt = jest.fn().mockImplementationOnce(() => {
      throw new Error('error');
    });

    expect(() => {
      File.encrypt(file);
    }).not.toThrow(Error);
  });

  test('encrypt(): exception(custom)', () => {
    FileCrypto.encrypt = jest.fn().mockImplementationOnce(() => {
      throw new CustomException();
    });

    expect(() => {
      File.encrypt(file);
    }).not.toThrow(CustomException);
  });

  test('decrypt(): exception(not exist)', () => {
    expect(() => {
      File.decrypt('temp');
    }).not.toThrow(Error);
  });

  test('decrypt(): exception(error)', () => {
    FileCrypto.decrypt = jest.fn().mockImplementationOnce(() => {
      throw new Error('error');
    });

    expect(() => {
      File.decrypt(fileEnc);
    }).not.toThrow(Error);
  });

  test('decrypt(): exception(custom)', () => {
    FileCrypto.decrypt = jest.fn().mockImplementationOnce(() => {
      throw new CustomException();
    });

    expect(() => {
      File.decrypt(fileEnc);
    }).not.toThrow(CustomException);
  });

  test('decrypt(): exception(fail)', () => {
    expect(() => {
      File.decrypt('');
    }).not.toThrow(Error);
  });
});
