import { File as FileCrypto, LocationHelper } from '@jihyunlab/secret';
import { readFileSync, writeFileSync } from 'fs';

export const File = {
  encrypt: (input: string, output?: string, bak = false, key?: string) => {
    try {
      let locationOutput: string;

      const location = LocationHelper.toAbsolute(input);
      console.log(`input: ${LocationHelper.toRelative(location)}`);

      if (!LocationHelper.isExist(location)) {
        throw new Error('input file does not exist.');
      }

      const encrypted = FileCrypto.encrypt(location, output, key);

      if (bak) {
        writeFileSync(`${location}.bak`, readFileSync(location));
      }

      if (output) {
        locationOutput = LocationHelper.toRelative(output);
      } else {
        writeFileSync(location, encrypted);
        locationOutput = LocationHelper.toRelative(location);
      }

      console.log(`encrypted: ${locationOutput}`);
      console.log('file encryption success.');

      return locationOutput;
    } catch (error) {
      if (error instanceof Error) {
        console.log(`error: ${error.message}`);
      } else {
        console.log(error);
      }
    }
  },

  decrypt: (input: string, output?: string, bak = false, key?: string) => {
    try {
      let locationOutput: string;

      const location = LocationHelper.toAbsolute(input);
      console.log(`input: ${LocationHelper.toRelative(location)}`);

      if (!LocationHelper.isExist(location)) {
        throw new Error('input file does not exist.');
      }

      const decrypted = FileCrypto.decrypt(location, output, key);

      if (bak) {
        writeFileSync(`${location}.bak`, readFileSync(location));
      }

      if (output) {
        locationOutput = LocationHelper.toRelative(output);
      } else {
        writeFileSync(location, decrypted);
        locationOutput = LocationHelper.toRelative(location);
      }

      console.log(`decrypted: ${locationOutput}`);
      console.log('file decryption success.');

      return locationOutput;
    } catch (error) {
      if (error instanceof Error) {
        console.log(`error: ${error.message}`);
      } else {
        console.log(error);
      }
    }
  },
};
