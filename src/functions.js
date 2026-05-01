import {
  pipe,
  filter,
  replace,
  split,
  toLower,
  startsWith,
  map,
} from "lodash/fp";

export const formatLyrics = (str) => str.replace(/[^a-zA-Z0-9]/g, "");
export const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

export const getJsonFromResponse = async (req) => (await req).json();

const cyrillicToLatin = {
  а: "a", е: "e", о: "o", р: "p", с: "c", х: "x", у: "y", і: "i",
  А: "A", Е: "E", О: "O", Р: "P", С: "C", Х: "X", У: "Y", І: "I",
};

const normalizeChars = (str) =>
  String(str)
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[аеорсхуіАЕОРСХУІ]/g, (ch) => cyrillicToLatin[ch] ?? ch);

export const formatLyricsForDisplay = pipe(
  replace(/\[.+?]/g, ""),
  split(/\s+/),
  filter(Boolean),
  map((word) => ({ word, isVisible: false }))
);

export const formatWord = (word) =>
  normalizeChars(word).toLowerCase().replace(/[^a-z0-9]/g, "");

export const isWordGuessed = (guess, currWord) =>
  pipe(toLower, startsWith(formatWord(currWord)))(formatWord(guess));

export const mapIndexed = map.convert({
  cap: false,
  curry: true,
  immutable: true,
  fixed: true,
  rearg: true,
});
