import { CIPHER, Env, EnvHelper } from '@jihyunlab/secret';
import { LocationHelper } from '../helpers/location.helper';

export const EnvCipher = {
  encrypt: async (
    input: string,
    output?: string,
    secret?: string,
    keys?: string[],
    salt?: string,
    iter?: number
  ) => {
    const inputLocation = LocationHelper.toAbsolute(input);
    const outputLocation = LocationHelper.toAbsolute(output || input);

    console.log(`Input: ${LocationHelper.toRelative(inputLocation)}`);
    console.log(`Output: ${LocationHelper.toRelative(outputLocation)}`);
    console.log('');

    console.log('Encryption process:');

    if (!secret) {
      console.log('- Using JIHYUNLAB_SECRET_KEY');
    } else {
      console.log('- Using input secret');
    }

    if (!LocationHelper.isExist(inputLocation)) {
      throw new Error('the input file does not exist.');
    }

    if (LocationHelper.isDirectory(inputLocation)) {
      throw new Error('the input path is a directory.');
    }

    if (LocationHelper.isDirectory(outputLocation)) {
      throw new Error('the output path is a directory.');
    }

    let set: Set<string> | undefined = undefined;

    if (keys && keys.length !== 0) {
      set = new Set<string>();

      for (let i = 0; i < keys.length; i++) {
        set.add(keys[i]);
      }
    }

    const cipher = await Env.createCipher(CIPHER.AES_256_GCM, secret, {
      salt: salt,
      iterations: iter,
    });

    const env = await EnvHelper.read(input);
    const envKeys = Object.keys(env);

    for (let i = 0; i < envKeys.length; i++) {
      const envKey = envKeys[i];

      if (!set) {
        env[envKey] = await cipher.encrypt(env[envKey]);
        console.log(`- ${envKey} ... [OK]`);
      } else {
        if (set.has(envKey)) {
          env[envKey] = await cipher.encrypt(env[envKey]);
          console.log(`- ${envKey} ... [OK]`);
        } else {
          console.log(`- ${envKey} ... [Skipped]`);
        }
      }
    }

    let overwriting = false;

    if (LocationHelper.isExist(outputLocation)) {
      overwriting = true;
    }

    await EnvHelper.write(outputLocation, env);
    console.log('- Encryption completed successfully');
    console.log('');

    console.log('Summary:');

    if (!secret) {
      console.log('- Using JIHYUNLAB_SECRET_KEY');
    } else {
      console.log('- Using input secret');
    }

    if (overwriting) {
      console.log('- Overwriting existing file');
    } else {
      console.log('- Writing to output file');
    }

    console.log(
      `- ${LocationHelper.toRelative(inputLocation)} encrypted to ${LocationHelper.toRelative(outputLocation)}`
    );
  },

  decrypt: async (
    input: string,
    output?: string,
    secret?: string,
    keys?: string[],
    salt?: string,
    iter?: number
  ) => {
    const inputLocation = LocationHelper.toAbsolute(input);
    const outputLocation = LocationHelper.toAbsolute(output || input);

    console.log(`Input: ${LocationHelper.toRelative(inputLocation)}`);
    console.log(`Output: ${LocationHelper.toRelative(outputLocation)}`);
    console.log('');

    console.log('Decryption process:');

    if (!secret) {
      console.log('- Using JIHYUNLAB_SECRET_KEY');
    } else {
      console.log('- Using input secret');
    }

    if (!LocationHelper.isExist(inputLocation)) {
      throw new Error('the input file does not exist.');
    }

    if (LocationHelper.isDirectory(inputLocation)) {
      throw new Error('the input path is a directory.');
    }

    if (LocationHelper.isDirectory(outputLocation)) {
      throw new Error('the output path is a directory.');
    }

    let set: Set<string> | undefined = undefined;

    if (keys && keys.length !== 0) {
      set = new Set<string>();

      for (let i = 0; i < keys.length; i++) {
        set.add(keys[i]);
      }
    }

    const cipher = await Env.createCipher(CIPHER.AES_256_GCM, secret, {
      salt: salt,
      iterations: iter,
    });

    const env = await EnvHelper.read(input);
    const envKeys = Object.keys(env);

    for (let i = 0; i < envKeys.length; i++) {
      const envKey = envKeys[i];

      if (!set) {
        env[envKey] = await cipher.decrypt(env[envKey]);
        console.log(`- ${envKey} ... [OK]`);
      } else {
        if (set.has(envKey)) {
          env[envKey] = await cipher.decrypt(env[envKey]);
          console.log(`- ${envKey} ... [OK]`);
        } else {
          console.log(`- ${envKey} ... [Skipped]`);
        }
      }
    }

    let overwriting = false;

    if (LocationHelper.isExist(outputLocation)) {
      overwriting = true;
    }

    await EnvHelper.write(outputLocation, env);
    console.log('- Decryption completed successfully');
    console.log('');

    console.log('Summary:');

    if (!secret) {
      console.log('- Using JIHYUNLAB_SECRET_KEY');
    } else {
      console.log('- Using input secret');
    }

    if (overwriting) {
      console.log('- Overwriting existing file');
    } else {
      console.log('- Writing to output file');
    }

    console.log(
      `- ${LocationHelper.toRelative(inputLocation)} decrypted to ${LocationHelper.toRelative(outputLocation)}`
    );
  },
};
