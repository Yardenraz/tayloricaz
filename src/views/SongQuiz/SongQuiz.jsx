import { useEffect, useMemo, useRef, useState } from "react";
import classes from "./SongQuiz.module.css";
import {
  formatLyricsForDisplay,
  formatWord,
  getRandomInt,
  isWordGuessed,
  mapIndexed,
} from "../../functions";
import { WordCell } from "./WordCell";
import { equals, filter, map, overSome, pipe, prop, find } from "lodash/fp";
import { useLocation, useNavigate } from "react-router";
import taylorHoldingCats from "../../assets/images/taylorHoldingCats.png";
import loverHouse from "../../assets/images/loverHouse.jpg";
import { PurpleButton } from "../../components/PurpleButton";
import { ErrorInFetchingSong } from "../../components/ErrorInFetchingSong";
import { Timer } from "../../components/Timer";
import { Link } from "react-router-dom";
import allLyrics from "../../lyrics.json";

export const SongQuiz = () => {
  const { state } = useLocation();
  const [wordGuess, setWordGuess] = useState("");
  const initialSong = find(pipe(prop("song_id"), equals(state.songNum)), allLyrics);
  const [songTitle, setSongTitle] = useState(initialSong?.song_title);
  const [lyricsProps, setLyricsProps] = useState(
    formatLyricsForDisplay(initialSong?.lyrics)
  );
  const [gaveUp, setGaveUp] = useState(false);
  const [showBlanks, seShowBlanks] = useState(false);
  const [restartTimer, setRestartTimer] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef();
  const lyricsGuessed = filter(
    overSome(prop("isVisible"), !prop("losingWord")),
    lyricsProps
  )?.length;

  const titleWords = useMemo(
    () =>
      (songTitle ?? "")
        .replace(/\(.*?\)/g, "")
        .split(/\s+/)
        .map(formatWord)
        .filter(Boolean),
    [songTitle]
  );

  const titleGuessed = useMemo(
    () =>
      titleWords.length > 0 &&
      titleWords.every((tw) =>
        lyricsProps.some(
          (lp) => lp.isVisible && !lp.losingWord && formatWord(lp.word) === tw
        )
      ),
    [titleWords, lyricsProps]
  );
  const updateWordDisplay = (event) => setWordGuess(event.target.value);

  const revealWord = (index) => {
    setLyricsProps((prev) =>
      prev.map((wp, i) => i === index ? { ...wp, isVisible: true, losingWord: true } : wp)
    );
  };

  const wordsTable = useMemo(() =>
      mapIndexed((lyricProps, index) => <WordCell key={index} {...lyricProps} onReveal={() => revealWord(index)} />, lyricsProps),
    [lyricsProps]
  );

  useEffect(() => inputRef?.current?.focus(), []);
  
  useEffect(() => {
    setLyricsProps((prevValue) =>
      map(({ word, isVisible, losingWord }) => {
        if (!isVisible && isWordGuessed(wordGuess, word)) {
          setWordGuess("");
          return { word, isVisible: true, losingWord: false };
        } else {
          return { word, isVisible, losingWord };
        }
      }, prevValue)
    );
  }, [wordGuess]);

  const regenerateSong = () => {
    const newSongNum = getRandomInt(state.numOfSongs);
    const newSong = find(pipe(prop("song_id"), equals(newSongNum)), allLyrics);
    setLyricsProps(formatLyricsForDisplay(newSong?.lyrics));
    setSongTitle(newSong?.song_title);
    setWordGuess("");
    setGaveUp(false);
    seShowBlanks(false);
    setRestartTimer((prevValue) => !prevValue);
    navigate(`/songquiz`, {state: {songNum: newSongNum, numOfSongs: state.numOfSongs}, replace: true});
  };

  const lose = () => {
    setGaveUp(true);
    setLyricsProps(map((wordProps) =>
        !wordProps.isVisible
          ? { ...wordProps, isVisible: true, losingWord: true }
          : { ...wordProps }
      )
    );
  };
  
  const toggleBlanks = () => {
    seShowBlanks(prevValue => !prevValue)
    setLyricsProps(map((wordProps) =>
        !wordProps.isVisible
          ? { ...wordProps, losingWord: !showBlanks }
          : { ...wordProps }
      )
    );
  }

  return (
    <div className={classes.App}>
      <Link to="/">
        <img
          className="fixed top-1 left-1 w-16" src={loverHouse} alt="lover house"
        />
      </Link>
      <input
        onChange={updateWordDisplay} value={wordGuess} ref={inputRef}
        className="bg-gray-50 border border-gray-300 w-[50vw] sticky top-12 rounded disabled:opacity-75 p-4 focus:ring-violet-300"
        type="text" placeholder="put a word in bitch!"
      ></input>
      <div className="self-start w-2/4 mt-12">
        <Timer stopTimer={gaveUp || lyricsGuessed === lyricsProps?.length}
          restartTimer={restartTimer}
        />
      </div>
      {lyricsProps?.length ? (
        lyricsGuessed !== lyricsProps?.length || gaveUp ? (
          <>
            {titleGuessed && (
              <div className="font-playfair text-3xl font-bold tracking-wide mt-2 mb-1 animate-appear">
                {songTitle}
              </div>
            )}
            <div className="font-playfair">
              you guessed {lyricsGuessed} lyrics out of {lyricsProps?.length}
            </div>
            <button onClick={toggleBlanks}>{!showBlanks ? "show" : "hide"} blanks</button>
            <div className="h-4/6 flex-col flex flex-wrap gap-x-3 justify-start items-stretch content-center">
              {wordsTable}
            </div>
            <button onClick={lose}>give up? :(</button>
          </>
        ) : (
          <div>
            YOU WON
            <img src="https://gifdb.com/images/high/taylor-swift-happy-dance-0sukpoogfw30zukw.gif" alt="taylor dance"/>
          </div>
        )
      ) : (
        <ErrorInFetchingSong />
      )}
      <div className="fixed bottom-0 right-0 flex items-center">
        <PurpleButton onClick={regenerateSong}>regenerate song</PurpleButton>
        <img className="h-24 " src={taylorHoldingCats} alt="taylor-with-cats" />
      </div>
    </div>
  );
};
