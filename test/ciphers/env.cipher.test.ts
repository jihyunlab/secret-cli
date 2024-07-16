/**
 * @jest-environment node
 */
import { CIPHER, Env, EnvHelper } from '@jihyunlab/secret';
import { EnvCipher } from '../../bin/ciphers/env.cipher';
import { copyFileSync, rmSync } from 'fs';

describe('Env cipher', () => {
  const processEnv = process.env;

  beforeEach(() => {
    console.log = jest.fn();

    process.env = {
      ...processEnv,
      JIHYUNLAB_SECRET_KEY: 'jihyunlab',
    };
  });

  afterEach(() => {
    process.env = processEnv;
  });

  test(`Positive: encrypt()`, async () => {
    const input = `${process.cwd()}/test/.env`;
    const output = `${process.cwd()}/test/.env.test_1`;

    await EnvCipher.encrypt(input, output);

    const cipher = await Env.createCipher();

    let env = await EnvHelper.read(output);
    let envKeys = Object.keys(env);

    for (let i = 0; i < envKeys.length; i++) {
      const envKey = envKeys[i];
      expect('ENV_VALUE').toEqual(await cipher.decrypt(env[envKey]));
    }

    await EnvCipher.decrypt(output);

    env = await EnvHelper.read(output);
    envKeys = Object.keys(env);

    for (let i = 0; i < envKeys.length; i++) {
      const envKey = envKeys[i];
      expect('ENV_VALUE').toEqual(env[envKey]);
    }

    rmSync(output, { force: true });
  });

  test(`Positive: encrypt()`, async () => {
    const input = `${process.cwd()}/test/.env`;
    const output = `${process.cwd()}/test/.env.test_2`;

    await EnvCipher.encrypt(input, output);

    const cipher = await Env.createCipher();

    let env = await EnvHelper.read(output);
    let envKeys = Object.keys(env);

    for (let i = 0; i < envKeys.length; i++) {
      const envKey = envKeys[i];
      expect('ENV_VALUE').toEqual(await cipher.decrypt(env[envKey]));
    }

    await EnvCipher.decrypt(output, output);

    env = await EnvHelper.read(output);
    envKeys = Object.keys(env);

    for (let i = 0; i < envKeys.length; i++) {
      const envKey = envKeys[i];
      expect('ENV_VALUE').toEqual(env[envKey]);
    }

    rmSync(output, { force: true });
  });

  test(`Positive: encrypt()`, async () => {
    const input = `${process.cwd()}/test/.env`;
    const output = `${process.cwd()}/test/.env.test_3`;

    await EnvCipher.encrypt(input, output, undefined, ['ENV_KEY_1']);

    const cipher = await Env.createCipher();

    let env = await EnvHelper.read(output);
    let envKeys = Object.keys(env);

    for (let i = 0; i < envKeys.length; i++) {
      const envKey = envKeys[i];
      let envValue: string;

      if (envKey === 'ENV_KEY_1') {
        envValue = await cipher.decrypt(env[envKey]);
      } else {
        envValue = env[envKey];
      }

      expect('ENV_VALUE').toEqual(envValue);
    }

    await EnvCipher.decrypt(output, undefined, undefined, ['ENV_KEY_1']);

    env = await EnvHelper.read(output);
    envKeys = Object.keys(env);

    for (let i = 0; i < envKeys.length; i++) {
      const envKey = envKeys[i];
      expect('ENV_VALUE').toEqual(env[envKey]);
    }

    rmSync(output, { force: true });
  });

  test(`Positive: encrypt()`, async () => {
    const input = `${process.cwd()}/test/.env`;
    const output = `${process.cwd()}/test/.env.test_4`;

    await EnvCipher.encrypt(input, output, 'secret', ['ENV_KEY_1']);

    const cipher = await Env.createCipher(CIPHER.AES_256_GCM, 'secret', {
      salt: undefined,
      iterations: undefined,
    });

    let env = await EnvHelper.read(output);
    let envKeys = Object.keys(env);

    for (let i = 0; i < envKeys.length; i++) {
      const envKey = envKeys[i];
      let envValue: string;

      if (envKey === 'ENV_KEY_1') {
        envValue = await cipher.decrypt(env[envKey]);
      } else {
        envValue = env[envKey];
      }

      expect('ENV_VALUE').toEqual(envValue);
    }

    await EnvCipher.decrypt(output, output, 'secret', ['ENV_KEY_1']);

    env = await EnvHelper.read(output);
    envKeys = Object.keys(env);

    for (let i = 0; i < envKeys.length; i++) {
      const envKey = envKeys[i];
      expect('ENV_VALUE').toEqual(env[envKey]);
    }

    rmSync(output, { force: true });
  });

  test(`Positive: encrypt()`, async () => {
    const input = `${process.cwd()}/test/.env`;
    const output = `${process.cwd()}/test/.env.test_5`;

    await EnvCipher.encrypt(
      input,
      output,
      undefined,
      ['ENV_KEY_1'],
      'salt',
      256
    );

    const cipher = await Env.createCipher(undefined, undefined, {
      salt: 'salt',
      iterations: 256,
    });

    let env = await EnvHelper.read(output);
    let envKeys = Object.keys(env);

    for (let i = 0; i < envKeys.length; i++) {
      const envKey = envKeys[i];
      let envValue: string;

      if (envKey === 'ENV_KEY_1') {
        envValue = await cipher.decrypt(env[envKey]);
      } else {
        envValue = env[envKey];
      }

      expect('ENV_VALUE').toEqual(envValue);
    }

    await EnvCipher.decrypt(
      output,
      undefined,
      undefined,
      ['ENV_KEY_1'],
      'salt',
      256
    );

    env = await EnvHelper.read(output);
    envKeys = Object.keys(env);

    for (let i = 0; i < envKeys.length; i++) {
      const envKey = envKeys[i];
      expect('ENV_VALUE').toEqual(env[envKey]);
    }

    rmSync(output, { force: true });
  });

  test(`Positive: encrypt()`, async () => {
    const input = `${process.cwd()}/test/.env`;
    const output = `${process.cwd()}/test/.env.test_6`;

    copyFileSync(input, output);

    await EnvCipher.encrypt(output);

    const cipher = await Env.createCipher();

    let env = await EnvHelper.read(output);
    let envKeys = Object.keys(env);

    for (let i = 0; i < envKeys.length; i++) {
      const envKey = envKeys[i];
      expect('ENV_VALUE').toEqual(await cipher.decrypt(env[envKey]));
    }

    await EnvCipher.decrypt(output, `${process.cwd()}/test/.env.test_7`);

    env = await EnvHelper.read(`${process.cwd()}/test/.env.test_7`);
    envKeys = Object.keys(env);

    for (let i = 0; i < envKeys.length; i++) {
      const envKey = envKeys[i];
      expect('ENV_VALUE').toEqual(env[envKey]);
    }

    rmSync(output, { force: true });
    rmSync(`${process.cwd()}/test/.env.test_7`, { force: true });
  });

  test(`Negative: encrypt() - the input file does not exist.`, async () => {
    expect(async () => {
      await EnvCipher.encrypt(`${process.cwd()}/test/.undefined`);
    }).rejects.toThrow(Error('the input file does not exist.'));
  });

  test(`Negative: encrypt() - the input path is a directory.`, async () => {
    expect(async () => {
      await EnvCipher.encrypt(`${process.cwd()}/test/ciphers`);
    }).rejects.toThrow(Error('the input path is a directory.'));
  });

  test(`Negative: decrypt() - the input file does not exist.`, async () => {
    expect(async () => {
      await EnvCipher.decrypt(`${process.cwd()}/test/.undefined`);
    }).rejects.toThrow(Error('the input file does not exist.'));
  });

  test(`Negative: decrypt() - the input path is a directory.`, async () => {
    expect(async () => {
      await EnvCipher.decrypt(`${process.cwd()}/test/ciphers`);
    }).rejects.toThrow(Error('the input path is a directory.'));
  });

  test(`Negative: encrypt() - the output path is a directory.`, async () => {
    const input = `${process.cwd()}/test/.env`;

    expect(async () => {
      await EnvCipher.encrypt(input, `${process.cwd()}/test/ciphers`);
    }).rejects.toThrow(Error('the output path is a directory.'));
  });

  test(`Negative: decrypt() - the output path is a directory.`, async () => {
    const input = `${process.cwd()}/test/.env`;

    expect(async () => {
      await EnvCipher.decrypt(input, `${process.cwd()}/test/ciphers`);
    }).rejects.toThrow(Error('the output path is a directory.'));
  });
});
