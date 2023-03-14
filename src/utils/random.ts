// https://github.com/sindresorhus/crypto-random-string/blob/master/index.js
import * as crypto from 'crypto';

const urlSafeCharacters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~'.split('');
const numericCharacters = '0123456789'.split('');
const distinguishableCharacters = 'CDEHKMPRTUWXY012458'.split('');

// tslint:disable-next-line max-line-length
const asciiPrintableCharacters = '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'.split('');
const alphanumericCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');
const upperCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const lowerCharacters = 'abcdefghijklmnopqrstuvwxyz'.split('');
const upperAlphanumericCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
const lowerAlphanumericCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');

const generateForCustomCharacters = (length: number, characters: string[]) => {
  // Generating entropy is faster than complex math operations, so we use the simplest way
  const characterCount = characters.length;
  // Using values above this will ruin distribution when using modular division
  const maxValidSelector = (Math.floor(0x10000 / characterCount) * characterCount) - 1;
  // Generating a bit more than required so chances we need more than one pass will be really low
  const entropyLength = 2 * Math.ceil(1.1 * length);
  let string = '';
  let stringLength = 0;

  // In case we had many bad values, which may happen for character sets of size above 0x8000 but close to it
  while (stringLength < length) {
    const entropy = crypto.randomBytes(entropyLength);
    let entropyPosition = 0;

    while (entropyPosition < entropyLength && stringLength < length) {
      const entropyValue = entropy.readUInt16LE(entropyPosition);
      entropyPosition += 2;
      if (entropyValue > maxValidSelector) { // Skip values which will ruin distribution when using modular division
        continue;
      }

      string += characters[entropyValue % characterCount];
      stringLength++;
    }
  }

  return string;
};

// tslint:disable-next-line max-line-length
const generateRandomBytes = (byteLength: number, type: any, length: number) => crypto.randomBytes(byteLength).toString(type).slice(0, length);

type allowedTypes =
  'hex' |
  'base64' |
  'url-safe' |
  'numeric' |
  'distinguishable' |
  'ascii-printable' |
  'alphanumeric' |
  'upper' |
  'lower' |
  'upper-alphanumeric' |
  'lower-alphanumeric';

const createGenerator = (generateForCustomCharacters: Function, generateRandomBytes: Function) =>
  ({
    length,
    type,
    characters,
  }: {
    length: number
    type?: allowedTypes
    characters?: string,
  }) => {
    if (!(length >= 0 && Number.isFinite(length))) {
      throw new TypeError('Expected a `length` to be a non-negative finite number');
    }

    if (type === undefined && characters === undefined) {
      // tslint:disable-next-line no-parameter-reassignment
      type = 'hex';
    }

    if (type === 'hex' || (type === undefined && characters === undefined)) {
      return generateRandomBytes(Math.ceil(length * 0.5), 'hex', length); // Need 0.5 byte entropy per character
    }

    if (type === 'base64') {
      return generateRandomBytes(Math.ceil(length * 0.75), 'base64', length); // Need 0.75 byte of entropy per character
    }

    if (type === 'url-safe') {
      return generateForCustomCharacters(length, urlSafeCharacters);
    }

    if (type === 'numeric') {
      return generateForCustomCharacters(length, numericCharacters);
    }

    if (type === 'distinguishable') {
      return generateForCustomCharacters(length, distinguishableCharacters);
    }

    if (type === 'ascii-printable') {
      return generateForCustomCharacters(length, asciiPrintableCharacters);
    }

    if (type === 'alphanumeric') {
      return generateForCustomCharacters(length, alphanumericCharacters);
    }

    if (type === 'upper') {
      return generateForCustomCharacters(length, upperCharacters);
    }

    if (type === 'lower') {
      return generateForCustomCharacters(length, lowerCharacters);
    }

    if (type === 'upper-alphanumeric') {
      return generateForCustomCharacters(length, upperAlphanumericCharacters);
    }

    if (type === 'lower-alphanumeric') {
      return generateForCustomCharacters(length, lowerAlphanumericCharacters);
    }

    if (characters.length === 0) {
      throw new TypeError('Expected `characters` string length to be greater than or equal to 1');
    }

    if (characters.length > 0x10000) {
      throw new TypeError('Expected `characters` string length to be less or equal to 65536');
    }

    return generateForCustomCharacters(length, characters.split(''));
  };

export const cryptoRandomString = createGenerator(generateForCustomCharacters, generateRandomBytes);
