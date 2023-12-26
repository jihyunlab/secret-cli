import { Directory } from '../../bin/cryptos/directory.crypto';
import { File as FileCrypto } from '@jihyunlab/secret';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';

describe('Directory', () => {
  const processEnv = process.env;

  const keyString = 'JihyunLab';
  const textString = 'Welcome to JihyunLab.';

  const base = 'test-location';

  const dir = join(base, 'dir');
  const subDir = join(dir, 'sub-dir');
  const subSubDir = join(subDir, 'sub-sub-dir');

  const dirEnc = join(base, 'dir-enc');
  const subDirEnc = join(dirEnc, 'sub-dir');
  const subSubDirEnc = join(subDirEnc, 'sub-sub-dir');

  const dirDec = join(base, 'dir-dec');
  const subDirDec = join(dirDec, 'sub-dir');
  const subSubDirDec = join(subDirDec, 'sub-sub-dir');

  const file = join(dir, 'file.txt');
  const subDirFile = join(subDir, 'sub_dir_file.txt');
  const subSubDirFile = join(subSubDir, 'sub_sub_dir_file.txt');

  const fileDec = join(dirDec, 'file.txt');
  const subDirFileDec = join(subDirDec, 'sub_dir_file.txt');
  const subSubDirFileDec = join(subSubDirDec, 'sub_sub_dir_file.txt');

  const ignore = '.secretignore';
  const ignoreString = 'sub_sub_dir_file.txt';

  const temporaryDir = '.secret_directory_temporary';

  class CustomException {}

  beforeEach(() => {
    console.log = jest.fn();

    process.env = {
      ...processEnv,
      JIHYUNLAB_SECRET_KEY: keyString,
    };

    mkdirSync(base, { recursive: true });
    mkdirSync(dir, { recursive: true });
    mkdirSync(subDir, { recursive: true });
    mkdirSync(subSubDir, { recursive: true });

    writeFileSync(file, textString);
    writeFileSync(subDirFile, textString);
    writeFileSync(subSubDirFile, textString);
  });

  afterEach(() => {
    process.env = processEnv;

    rmSync(ignore, { recursive: true, force: true });
    rmSync(temporaryDir, { recursive: true, force: true });

    rmSync(subSubDirEnc, { recursive: true, force: true });
    rmSync(subDirEnc, { recursive: true, force: true });
    rmSync(dirEnc, { recursive: true, force: true });
    rmSync(subSubDirDec, { recursive: true, force: true });
    rmSync(subDirDec, { recursive: true, force: true });
    rmSync(dirDec, { recursive: true, force: true });
    rmSync(subSubDir, { recursive: true, force: true });
    rmSync(subDir, { recursive: true, force: true });
    rmSync(dir, { recursive: true, force: true });
    rmSync(base, { recursive: true, force: true });
  });

  test('environment key()', () => {
    const plain = readFileSync(file);
    const plainSubDirFile = readFileSync(subDirFile);

    Directory.encrypt(dir);
    Directory.decrypt(dir);

    expect(plain).toStrictEqual(readFileSync(file));
    expect(plainSubDirFile).toStrictEqual(readFileSync(subDirFile));
  });

  test('user key()', () => {
    const plain = readFileSync(file);
    const plainSubDirFile = readFileSync(subDirFile);

    Directory.encrypt(dir, undefined, undefined, keyString);
    Directory.decrypt(dir, undefined, undefined, keyString);

    expect(plain).toStrictEqual(readFileSync(file));
    expect(plainSubDirFile).toStrictEqual(readFileSync(subDirFile));
  });

  test('output()', () => {
    Directory.encrypt(dir, dirEnc);
    Directory.decrypt(dirEnc, dirDec);

    expect(readFileSync(file)).toStrictEqual(readFileSync(fileDec));
    expect(readFileSync(subDirFile)).toStrictEqual(readFileSync(subDirFileDec));
    expect(readFileSync(subSubDirFile)).toStrictEqual(readFileSync(subSubDirFileDec));
  });

  test('bak()', () => {
    Directory.encrypt(dir, dirEnc, true);
    Directory.decrypt(dirEnc, dirDec, true);

    expect(readFileSync(`${file}.bak`)).toStrictEqual(readFileSync(fileDec));
    expect(readFileSync(`${subDirFile}.bak`)).toStrictEqual(readFileSync(subDirFileDec));
    expect(readFileSync(`${subSubDirFile}.bak`)).toStrictEqual(readFileSync(subSubDirFileDec));
  });

  test('ignore()', () => {
    writeFileSync(ignore, ignoreString);
    writeFileSync(join(dir, ignore), ignoreString);

    const plain = readFileSync(subSubDirFile);

    Directory.encrypt(dir);
    Directory.decrypt(dir);

    expect(plain).toStrictEqual(readFileSync(subSubDirFile));
  });

  test('temporary()', () => {
    const plain = readFileSync(file);

    mkdirSync(temporaryDir, { recursive: true });
    Directory.encrypt(dir);

    rmSync(temporaryDir, { recursive: true, force: true });
    mkdirSync(temporaryDir, { recursive: true });

    Directory.decrypt(dir);
    rmSync(temporaryDir, { recursive: true, force: true });

    expect(plain).toStrictEqual(readFileSync(file));
  });

  test('encrypt(): exception(not exist)', () => {
    expect(() => {
      Directory.encrypt('temp');
    }).not.toThrow(Error);
  });

  test('encrypt(): exception(file)', () => {
    expect(() => {
      Directory.encrypt(file);
    }).not.toThrow(Error);
  });

  test('encrypt(): exception(file output)', () => {
    expect(() => {
      Directory.encrypt(dir, file);
    }).not.toThrow(Error);
  });

  test('encrypt(): exception(error)', () => {
    FileCrypto.encrypt = jest.fn().mockImplementationOnce(() => {
      throw new Error('error');
    });

    expect(() => {
      Directory.encrypt(dir);
    }).not.toThrow(Error);
  });

  test('encrypt(): exception(custom)', () => {
    FileCrypto.encrypt = jest.fn().mockImplementationOnce(() => {
      throw new CustomException();
    });

    expect(() => {
      Directory.encrypt(dir);
    }).not.toThrow(CustomException);
  });

  test('decrypt(): exception(not exist)', () => {
    expect(() => {
      Directory.decrypt('temp');
    }).not.toThrow(Error);
  });

  test('decrypt(): exception(file)', () => {
    expect(() => {
      Directory.decrypt(file);
    }).not.toThrow(Error);
  });

  test('decrypt(): exception(file output)', () => {
    expect(() => {
      Directory.decrypt(dir, file);
    }).not.toThrow(Error);
  });

  test('decrypt(): exception(error)', () => {
    FileCrypto.decrypt = jest.fn().mockImplementationOnce(() => {
      throw new Error('error');
    });

    expect(() => {
      Directory.decrypt(dir);
    }).not.toThrow(Error);
  });

  test('decrypt(): exception(custom)', () => {
    FileCrypto.decrypt = jest.fn().mockImplementationOnce(() => {
      throw new CustomException();
    });

    expect(() => {
      Directory.decrypt(dir);
    }).not.toThrow(CustomException);
  });

  test('decrypt(): exception(fail)', () => {
    expect(() => {
      Directory.decrypt('');
    }).not.toThrow(Error);
  });
});
