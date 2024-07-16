#!/usr/bin/env node
import { Command } from 'commander';
import { EnvCipher } from './ciphers/env.cipher';
import { setMaxListeners } from 'events';

setMaxListeners(36);

const program = new Command('secret')
  .description('JihyunLab Secret CLI')
  .addHelpText('after', ' ')
  .addHelpText('after', 'Usage (help):')
  .addHelpText('after', '  secret encrypt --help')
  .addHelpText('after', '  secret decrypt --help')
  .addHelpText('after', ' ')
  .addHelpText('after', 'Usage (.env encryption):')
  .addHelpText('after', '  secret encrypt --env .env --out .env.enc')
  .addHelpText(
    'after',
    '  secret encrypt --env .env --key ENV_KEY --out .env.enc'
  )
  .addHelpText('after', ' ')
  .addHelpText('after', 'Usage (.env decryption):')
  .addHelpText('after', '  secret decrypt --env .env.enc --out .env.dec')
  .addHelpText(
    'after',
    '  secret decrypt --env .env.enc --key ENV_KEY --out .env.dec'
  )
  .version('2.0.0');

function parseOptions(json: Object): {
  mode?: string;
  out?: string;
  secret?: string;
  keys?: string[];
  salt?: string;
  iter?: number;
  error?: string;
} {
  const options = JSON.parse(JSON.stringify(json));

  let mode = '';
  let exclusiveOptionCount = 0;

  if (options['env']) {
    mode = 'env';
    exclusiveOptionCount++;
  }

  if (exclusiveOptionCount !== 1) {
    return {
      error: 'for encrypting an env, the option needed is -e.',
    };
  }

  let iter: number | undefined = undefined;

  if (options['iter']) {
    iter = Number(options['iter']);

    if (isNaN(iter) || iter < 1) {
      return {
        error: 'iter must be undefined or a number greater than 0.',
      };
    }
  }

  return {
    mode: mode,
    out: options['out'],
    secret: options['secret'],
    keys: options['key'],
    salt: options['salt'],
    iter: iter,
  };
}

program
  .command('encrypt')
  .alias('e')
  .argument('<input>', 'path to the .env file.')
  .description('encrypt a file')
  .option(
    '-e, --env',
    'encrypts the values of environment variables defined in the .env file.'
  )
  .option(
    '-s, --secret <secret>',
    'encryption key. if not provided, uses the system environment variable JIHYUNLAB_SECRET_KEY.'
  )
  .option(
    '-k, --key <keys...>',
    'keys of values to encrypt in the .env file. if not present, encrypts all values.'
  )
  .option(
    '-o, --out <file>',
    'output path for the encrypted file. if not provided, overwrites the original file.'
  )
  .option(
    '-sa, --salt <salt>',
    'salt value used when generating encryption keys.'
  )
  .option(
    '-it, --iter <iterations>',
    'iterations value used when generating encryption keys.'
  )
  .action(async (arg: string, json: Object) => {
    const input = arg;

    if (!input) {
      console.log('the input file to be encrypted does not exist.');
      return;
    }

    const options = parseOptions(json);

    if (options.error) {
      console.log(options.error);
      return;
    }

    if (!options['mode']) {
      return;
    }

    if (options['mode'] === 'env') {
      await EnvCipher.encrypt(
        input,
        options['out'],
        options['secret'],
        options['keys'],
        options['salt'],
        options['iter']
      );
      return;
    }

    return;
  });

program
  .command('decrypt')
  .alias('d')
  .argument('<input>', 'path to the .env file.')
  .description('decrypt a file')
  .option(
    '-e, --env',
    'decrypts the values of environment variables defined in the .env file.'
  )
  .option(
    '-s, --secret <secret>',
    'decryption key. if not provided, uses the system environment variable JIHYUNLAB_SECRET_KEY.'
  )
  .option(
    '-k, --key <keys...>',
    'keys of values to decrypt in the .env file. if not present, decrypts all values.'
  )
  .option(
    '-o, --out <file>',
    'output path for the decrypted file. if not provided, overwrites the original file.'
  )
  .option(
    '-sa, --salt <salt>',
    'salt value used when generating decryption keys.'
  )
  .option(
    '-it, --iter <iterations>',
    'iterations value used when generating decryption keys.'
  )
  .action(async (arg: string, json: Object) => {
    const input = arg;

    if (!input) {
      console.log('the input file to be decrypted does not exist.');
      return;
    }

    const options = parseOptions(json);

    if (options.error) {
      console.log(options.error);
      return;
    }

    if (!options['mode']) {
      return;
    }

    if (options['mode'] === 'env') {
      await EnvCipher.decrypt(
        input,
        options['out'],
        options['secret'],
        options['keys'],
        options['salt'],
        options['iter']
      );
      return;
    }

    return;
  });

program.parse();
