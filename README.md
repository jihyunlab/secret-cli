# @jihyunlab/secret-cli

[![Version](https://img.shields.io/npm/v/@jihyunlab/secret-cli.svg?style=flat-square)](https://www.npmjs.com/package/@jihyunlab/secret-cli?activeTab=versions) [![Downloads](https://img.shields.io/npm/dt/@jihyunlab/secret-cli.svg?style=flat-square)](https://www.npmjs.com/package/@jihyunlab/secret-cli) [![Last commit](https://img.shields.io/github/last-commit/jihyunlab/secret-cli.svg?style=flat-square)](https://github.com/jihyunlab/secret-cli/graphs/commit-activity) [![License](https://img.shields.io/github/license/jihyunlab/secret-cli.svg?style=flat-square)](https://github.com/jihyunlab/secret-cli/blob/master/LICENSE) [![Linter](https://img.shields.io/badge/linter-eslint-blue?style=flat-square)](https://eslint.org) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)\
[![Build](https://github.com/jihyunlab/secret-cli/actions/workflows/build.yml/badge.svg)](https://github.com/jihyunlab/secret-cli/actions/workflows/build.yml) [![Lint](https://github.com/jihyunlab/secret-cli/actions/workflows/lint.yml/badge.svg)](https://github.com/jihyunlab/secret-cli/actions/workflows/lint.yml) [![codecov](https://codecov.io/gh/jihyunlab/secret-cli/graph/badge.svg?token=6J20G3LCG3)](https://codecov.io/gh/jihyunlab/secret-cli)

@jihyunlab/secret-cli is a command-line interface tool developed for encrypting .env files.

@jihyunlab/secret-cli encrypts .env files, which can be decrypted by @jihyunlab/secret and @jihyunlab/web-secret depending on the runtime environment.

The encryption function is implemented with [@jihyunlab/secret](https://www.npmjs.com/package/@jihyunlab/secret) and provides encryption for AES 256 GCM.

## Installation

```bash
npm i -g @jihyunlab/secret-cli
```

## Encryption key

If you register JIHYUNLAB_SECRET_KEY in system or user environment variables, it will be used as the encryption key during encryption.

If you prefer to manage the encryption key separately, you can directly input the encryption key to encrypt or decrypt the .env file.

```bash
export JIHYUNLAB_SECRET_KEY=YourSecretKey
```

## Usage

```bash
secret --help
```

```
Usage: secret [options] [command]

JihyunLab Secret CLI

Options:
  -V, --version                output the version number
  -h, --help                   display help for command

Commands:
  encrypt|e [options] <input>  encrypt a file
  decrypt|d [options] <input>  decrypt a file
  help [command]               display help for command

Usage (help):
  secret encrypt --help
  secret decrypt --help

Usage (.env encryption):
  secret encrypt --env .env --out .env.enc
  secret encrypt --env .env --key ENV_KEY --out .env.enc

Usage (.env decryption):
  secret decrypt --env .env.enc --out .env.dec
  secret decrypt --env .env.enc --key ENV_KEY --out .env.dec
```

## Encrypting .env file

Encryption of .env files is based on the following .env file.

```
ENV_KEY=ENV_VALUE
ENV_KEY_1=ENV_VALUE_1
ENV_KEY_2=ENV_VALUE_2
```

### Encrypting all keys

Encrypt all key values in the .env file.

```bash
secret encrypt --env .env --out .env.enc
```

```
Input: .env
Output: .env.enc

Encryption process:
- Using JIHYUNLAB_SECRET_KEY
- ENV_KEY ... [OK]
- ENV_KEY_1 ... [OK]
- ENV_KEY_2 ... [OK]
- Encryption completed successfully

Summary:
- Using JIHYUNLAB_SECRET_KEY
- Overwriting existing file
- .env encrypted to .env.enc
```

```
ENV_KEY=8c22dbcce705a1b95df2c7841f6735eba5d91bcecf1c1132ec35fd5a976dd8556763649075
ENV_KEY_1=17022b50356a3da6bad09e8012830a7078058796fcd75c594a180802320b009385761c7ce66208
ENV_KEY_2=f4d96b31dbbace4bd769c30a430da7f142c4fa058c565a80d2fb3e101cca29c0f8bfc106076aaa
```

### Encrypting a specific key

Encrypt specific key values in the .env file.

```bash
secret encrypt --env .env --key ENV_KEY --out .env.enc
```

```
Input: .env
Output: .env.enc

Encryption process:
- Using JIHYUNLAB_SECRET_KEY
- ENV_KEY ... [OK]
- ENV_KEY_1 ... [Skipped]
- ENV_KEY_2 ... [Skipped]
- Encryption completed successfully

Summary:
- Using JIHYUNLAB_SECRET_KEY
- Overwriting existing file
- .env encrypted to .env.enc
```

```
ENV_KEY=f175768a27461c527f5ae24b728906f8ce77fc8f82109184a5c2528a5e77ed4159066862e7
ENV_KEY_1=ENV_VALUE_1
ENV_KEY_2=ENV_VALUE_2
```

You can encrypt multiple specific key values at once.

```bash
secret encrypt --env .env --key ENV_KEY_1 --key ENV_KEY_2 --out .env.enc
```

```
Input: .env
Output: .env.enc

Encryption process:
- Using JIHYUNLAB_SECRET_KEY
- ENV_KEY ... [Skipped]
- ENV_KEY_1 ... [OK]
- ENV_KEY_2 ... [OK]
- Encryption completed successfully

Summary:
- Using JIHYUNLAB_SECRET_KEY
- Overwriting existing file
- .env encrypted to .env.enc
```

```
ENV_KEY=ENV_VALUE
ENV_KEY_1=deb8ec8c77e3e1c4a473f63924cc550179283294fb5d933299ecfcbc3673c79e6c19ef218c0a86
ENV_KEY_2=c11a9a4dfd7d9ed5553b072b1bf491e37c1b3233cb521c113f7fc3d96bb282f2579678c4417cc4
```

### Entering encryption key directly

You can encrypt using a separately managed encryption key by entering it directly.

```bash
secret encrypt --env .env --secret YourSecretKey --out .env.enc
```

```
Input: .env
Output: .env.enc

Encryption process:
- Using input secret
- ENV_KEY ... [OK]
- ENV_KEY_1 ... [OK]
- ENV_KEY_2 ... [OK]
- Encryption completed successfully

Summary:
- Using input secret
- Overwriting existing file
- .env encrypted to .env.enc
```

```
ENV_KEY=5b47faa38e6a9cb2fd65b34dff0a9befc67d77bc6a4a352c28534fed195dfd9ca1f9917af8
ENV_KEY_1=d37f8e719afed09d28c19f7b29c42398f5b942623e23082532cd5bc6bcf75625bf73a4104e38a7
ENV_KEY_2=3e49f6218bb1220e10d3d4165ef60a0ad43499371ba7d1142d2f65b142c5b96d3dc3a2f0b97244
```

### Decryption

You can decrypt the encrypted .env file using the same method as encryption.

```bash
secret decrypt --env .env.enc --key ENV_KEY --out .env.dec
```

```
Input: .env.enc
Output: .env.dec

Decryption process:
- Using JIHYUNLAB_SECRET_KEY
- ENV_KEY ... [OK]
- ENV_KEY_1 ... [Skipped]
- ENV_KEY_2 ... [Skipped]
- Decryption completed successfully

Summary:
- Using JIHYUNLAB_SECRET_KEY
- Overwriting existing file
- .env.enc decrypted to .env.dec
```

```
ENV_KEY=ENV_VALUE
ENV_KEY_1=ENV_VALUE_1
ENV_KEY_2=ENV_VALUE_2
```

## @jihyunlab/secret

[@jihyunlab/secret](https://www.jihyunlab.com/library/npm/secret) implements the .env decryption functionality for Node.js applications.

To decrypt the encrypted .env file from @jihyunlab/secret-cli in a Node.js application, you can install and use @jihyunlab/secret.

```bash
npm i @jihyunlab/secret
```

```
import { Env } from '@jihyunlab/secret';

const cipher = await Env.createCipher();
const value = await cipher.decrypt(process.env.ENV_KEY);
```

## @jihyunlab/web-secret

[@jihyunlab/web-secret](https://www.jihyunlab.com/library/npm/web-secret) implements the .env decryption functionality for web applications.

To decrypt the encrypted .env file from @jihyunlab/secret-cli in a web application, you can install and use @jihyunlab/web-secret.

```bash
npm i @jihyunlab/web-secret
```

```
import { Env } from '@jihyunlab/web-secret';

const cipher = await Env.createCipher();
const value = await cipher.decrypt(process.env.ENV_KEY);
```

## Credits

Authored and maintained by JihyunLab <<info@jihyunlab.com>>

## License

Open source [licensed as MIT](https://github.com/jihyunlab/secret-cli/blob/master/LICENSE).
