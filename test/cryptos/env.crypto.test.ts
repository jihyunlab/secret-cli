import { Env } from '../../bin/cryptos/env.crypto';
import { Env as EnvCrypto } from '@jihyunlab/secret';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';

describe('Env', () => {
  const processEnv = process.env;

  const keyString = 'JihyunLab';

  const envKey = 'JIHYUNLAB_ENV';
  const envValue = 'WELCOME_TO_JIHYUNLAB';

  const base = 'test-env';

  const dir = join(base, 'dir');
  const subDir = join(dir, 'sub-dir');
  const subSubDir = join(subDir, 'sub-sub-dir');

  const dirEnc = join(base, 'dir-enc');
  const subDirEnc = join(dirEnc, 'sub-dir');
  const subSubDirEnc = join(subDirEnc, 'sub-sub-dir');

  const dirDec = join(base, 'dir-dec');
  const subDirDec = join(dirDec, 'sub-dir');
  const subSubDirDec = join(subDirDec, 'sub-sub-dir');

  const env = join(dir, '.env');
  const subDirEnv = join(subDir, '.env_sub_dir');
  const subSubDirEnv = join(subSubDir, '.env_sub_sub_dir');

  const envEnc = join(dirEnc, '.env');

  const envDec = join(dir, '.env');
  const subDirEnvDec = join(subDir, '.env_sub_dir');
  const subSubDirEnvDec = join(subSubDir, '.env_sub_sub_dir');

  const ignore = '.secretignore';
  const ignoreString = '.env_sub_sub_dir';

  const temporaryDir = '.secret_env_temporary';

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

    writeFileSync(env, `${envKey}=${envValue}\n`);
    writeFileSync(subDirEnv, `${envKey}=${envValue}\n`);
    writeFileSync(subSubDirEnv, `${envKey}=${envValue}\n`);
  });

  afterEach(() => {
    process.env = processEnv;

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
    const plain = readFileSync(env);

    Env.encrypt(env);
    Env.decrypt(env);

    expect(plain).toStrictEqual(readFileSync(env));
  });

  test('user key()', () => {
    const plain = readFileSync(env);

    Env.encrypt(env, undefined, undefined, keyString);
    Env.decrypt(env, undefined, undefined, keyString);

    expect(plain).toStrictEqual(readFileSync(env));
  });

  test('output()', () => {
    Env.encrypt(env, envEnc);
    Env.decrypt(envEnc, envDec);

    expect(readFileSync(env)).toStrictEqual(readFileSync(envDec));
  });

  test('bak()', () => {
    Env.encrypt(env, envEnc, true);
    Env.decrypt(envEnc, envDec, true);

    expect(readFileSync(`${env}.bak`)).toStrictEqual(readFileSync(envDec));
  });

  test('environment key(dir)', () => {
    const plain = readFileSync(env);
    const plainSubDirEnv = readFileSync(subDirEnv);

    Env.encrypt(dir);
    Env.decrypt(dir);

    expect(plain).toStrictEqual(readFileSync(env));
    expect(plainSubDirEnv).toStrictEqual(readFileSync(subDirEnv));
  });

  test('user key(dir)', () => {
    const plain = readFileSync(env);
    const plainSubDirFile = readFileSync(subDirEnv);

    Env.encrypt(dir, undefined, undefined, keyString);
    Env.decrypt(dir, undefined, undefined, keyString);

    expect(plain).toStrictEqual(readFileSync(env));
    expect(plainSubDirFile).toStrictEqual(readFileSync(subDirEnv));
  });

  test('output(dir)', () => {
    writeFileSync(join(dir, 'temp'), 'temp');
    Env.encrypt(dir, dirEnc);

    writeFileSync(join(dirEnc, 'temp'), 'temp');
    Env.decrypt(dirEnc, dirDec);

    expect(readFileSync(env)).toStrictEqual(readFileSync(envDec));
    expect(readFileSync(subDirEnv)).toStrictEqual(readFileSync(subDirEnvDec));
    expect(readFileSync(subSubDirEnv)).toStrictEqual(readFileSync(subSubDirEnvDec));
  });

  test('bak()', () => {
    Env.encrypt(dir, dirEnc, true);
    Env.decrypt(dirEnc, dirDec, true);

    expect(readFileSync(`${env}.bak`)).toStrictEqual(readFileSync(envDec));
    expect(readFileSync(`${subDirEnv}.bak`)).toStrictEqual(readFileSync(subDirEnvDec));
    expect(readFileSync(`${subSubDirEnv}.bak`)).toStrictEqual(readFileSync(subSubDirEnvDec));
  });

  test('ignore()', () => {
    const plain = readFileSync(subSubDirEnv);

    writeFileSync(ignore, ignoreString);
    writeFileSync(join(dir, ignore), ignoreString);

    Env.encrypt(dir);
    Env.decrypt(dir);

    rmSync(ignore, { recursive: true, force: true });
    expect(plain).toStrictEqual(readFileSync(subSubDirEnv));
  });

  test('temporary()', () => {
    const plain = readFileSync(env);

    mkdirSync(temporaryDir, { recursive: true });
    Env.encrypt(dir);

    rmSync(temporaryDir, { recursive: true, force: true });
    mkdirSync(temporaryDir, { recursive: true });

    Env.decrypt(dir);
    rmSync(temporaryDir, { recursive: true, force: true });

    expect(plain).toStrictEqual(readFileSync(env));
  });

  test('encrypt(): exception(not exist)', () => {
    expect(() => {
      Env.encrypt('temp');
    }).not.toThrow(Error);
  });

  test('encrypt(): exception(env)', () => {
    expect(() => {
      Env.encrypt(env);
    }).not.toThrow(Error);
  });

  test('encrypt(): exception(env output)', () => {
    expect(() => {
      Env.encrypt(dir, env);
    }).not.toThrow(Error);
  });

  test('encrypt(): exception(error)', () => {
    EnvCrypto.encrypt = jest.fn().mockImplementationOnce(() => {
      throw new Error('error');
    });

    expect(() => {
      Env.encrypt(dir);
    }).not.toThrow(Error);
  });

  test('encrypt(): exception(custom)', () => {
    EnvCrypto.encrypt = jest.fn().mockImplementationOnce(() => {
      throw new CustomException();
    });

    expect(() => {
      Env.encrypt(env);
    }).not.toThrow(CustomException);
  });

  test('decrypt(): exception(not exist)', () => {
    expect(() => {
      Env.decrypt('temp');
    }).not.toThrow(Error);
  });

  test('decrypt(): exception(env)', () => {
    expect(() => {
      Env.decrypt(env);
    }).not.toThrow(Error);
  });

  test('decrypt(): exception(env output)', () => {
    expect(() => {
      Env.decrypt(dir, env);
    }).not.toThrow(Error);
  });

  test('decrypt(): exception(error)', () => {
    EnvCrypto.decrypt = jest.fn().mockImplementationOnce(() => {
      throw new Error('error');
    });

    expect(() => {
      Env.decrypt(dir);
    }).not.toThrow(Error);
  });

  test('decrypt(): exception(custom)', () => {
    EnvCrypto.decrypt = jest.fn().mockImplementationOnce(() => {
      throw new CustomException();
    });

    expect(() => {
      Env.decrypt(env);
    }).not.toThrow(CustomException);
  });

  test('decrypt(): exception(fail)', () => {
    expect(() => {
      Env.decrypt('');
    }).not.toThrow(Error);
  });
});
