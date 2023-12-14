# @jihyunlab/secret-cli

[![Version](https://img.shields.io/npm/v/@jihyunlab/secret-cli.svg?style=flat-square)](https://www.npmjs.com/package/@jihyunlab/secret-cli?activeTab=versions) [![Downloads](https://img.shields.io/npm/dt/@jihyunlab/secret-cli.svg?style=flat-square)](https://www.npmjs.com/package/@jihyunlab/secret-cli) [![Last commit](https://img.shields.io/github/last-commit/jihyunlab/secret-cli.svg?style=flat-square)](https://github.com/jihyunlab/secret-cli/graphs/commit-activity) [![License](https://img.shields.io/github/license/jihyunlab/secret-cli.svg?style=flat-square)](https://github.com/jihyunlab/secret-cli/blob/master/LICENSE)

@jihyunlab/secret-cli is the command line interface tool for [@jihyunlab/secret](https://www.npmjs.com/package/@jihyunlab/secret).\
@jihyunlab/secret-cli provides the ability to encrypt not only text and files, but also all files within a directory, or only all .env files within a directory.\
Encrypted .env files are decrypted by [@jihyunlab/secret](https://www.npmjs.com/package/@jihyunlab/secret) when loaded by dotenv at runtime.

## Requirements

Node.js

## Setup

```bash
npm i -g @jihyunlab/secret-cli
```

## Encryption key

If you register JIHYUNLAB_SECRET_KEY in a system or user environment variable, that environment variable will be used as the encryption key during encryption.

```bash
export JIHYUNLAB_SECRET_KEY=YourKey
```

## Usage

```bash
$ secret help

Usage: secret [options] [command]

JihyunLab secret cli

Options:
  -V, --version                 output the version number
  -h, --help                    display help for command

Commands:
  encrypt|e [options] <target>
  decrypt|d [options] <target>
  help [command]                display help for command

Usage examples(help):
  secret encrypt -h
  secret decrypt -h

Usage examples(text):
  secret encrypt -t text
  secret decrypt -t text

Usage examples(file):
  secret encrypt -f file.txt
  secret decrypt -f file.txt
  secret encrypt -k key -f file.txt -o file_enc.txt -b

Usage examples(dir):
  secret encrypt -d dir
  secret decrypt -d dir
  secret encrypt -k key -d dir -o dir_enc -b

Usage examples(.env):
  secret encrypt -e .env
  secret encrypt -e dir
  secret encrypt -k key -e dir -o dir_enc -b
```

## Text encryption

Text encryption encrypts the input text and returns an encrypted hex string.

```bash
$ secret encrypt -t string

text: string
encrypted: 4c6b76bdcb643c8536f9ba6f39c29d2126b2a551eac324145a2bf09409fbc4724169
text encryption success.
```

Instead of using an encryption key from an environment variable, you can input the key directly.

```bash
$ secret encrypt -k key -t string

text: string
encrypted: d00853715358ebc3ab657820b7510d02e88a38d3ac5e7c2f3578f5ef52903853d96b
text encryption success.
```

Text encrypted with the encrypt command are decrypted with the decrypt command.

```bash
$ secret decrypt -t 4c6b76bdcb643c8536f9ba6f39c29d2126b2a551eac324145a2bf09409fbc4724169

text: 4c6b76bdcb643c8536f9ba6f39c29d2126b2a551eac324145a2bf09409fbc4724169
decrypted: string
text decryption success.
```

## File encryption

When encrypting or decrypting files, you can specify which files to export.

```bash
$ secret encrypt -f file -o file_enc

input: file
encrypted: file_enc
file encryption success.
```

If you do not specify which files to export when encrypting them, the encrypted results will overwrite the existing files.

```bash
$ secret encrypt -f file

input: file
encrypted: file
file encryption success.
```

Files, directories, and .env files encrypted with the encrypt command are decrypted with the decrypt command.

```bash
$ secret decrypt -f file_enc

input: file_enc
decrypted: file_enc
file decryption success.
```

## Directory encryption

When encrypting or decrypting a directory, you can specify which directory to export.

```bash
$ secret encrypt -d dir -o dir_enc

input: dir
encrypted: dir\.env
encrypted: dir\file
directory encryption success.
```

If you encrypt the directory containing the .env with directory encryption, the entire .env file will be encrypted. Dotenv cannot properly recognize .env files if the entire file is encrypted.\
@jihyunlab/secret-cli provides a separate .env encryption option.

If you do not specify a directory to export to when encrypting, the existing directory will be overwritten with the encrypted results.

```bash
$ secret encrypt -d dir

input: dir
encrypted: dir\.env
encrypted: dir\file
directory encryption success.
```

## .env encryption

Encrypting the .env file encrypts only the values, not the key, ensuring correct operation of dotenv when run.\
.env encryption works differently than file or directory encryption.

Encrypt the .env file. However, the file name must start with .env.

```bash
$ secret encrypt -e .env

input: .env
encrypted: .env
.env file encryption success.
```

```.env
KEY=98623ca99db8846ef65d23e4508ea26d132d98b4d0e2f4241a8f95194e6fb30b1f
```

Encrypts all .env files within a directory. If you enter a directory, all files starting with .env within that directory will be encrypted.

```bash
$ secret encrypt -e dir

input: dir
encrypted: dir\.env
.env directory encryption success.
```

For more information about using encrypted .env files, see the [@jihyunlab/secret](https://www.npmjs.com/package/@jihyunlab/secret) documentation.

## .secretignore

When encrypting a directory, you can create a .secretignore file to specify files or directories that should not be encrypted.

```.secretignore
/.git
/node_modules
/dist
.DS_Store
LICENSE
README.md
package.json
```

Run the command from the directory where .secretignore is located.

```bash
$ secret encrypt -d .
```

## Credits

Authored and maintained by JihyunLab <<info@jihyunlab.com>>

## License

Open source [licensed as MIT](https://github.com/jihyunlab/secret-cli/blob/master/LICENSE).
