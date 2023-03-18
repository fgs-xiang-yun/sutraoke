import React, { FC, ReactNode, useEffect, useState } from "react";
import "./App.css";
import { SutraName, Sutra } from "./Sutra";
import { useColorTheme } from "./ColorTheme";

const tokenize = (raw: string) => {
  return raw.split("*");
};

const Header: FC = () => {
  const { baseTextColor, setColorTheme, headerFooterColor } = useColorTheme();
  return (
    <header>
      <div className={`navbar ${headerFooterColor}`}>
        <div className="navbar-start">
          <a
            href="https://www.ibps-austin.org/en/"
            className="flex items-center"
          >
            <img
              src="/sutraoke/lotus.png"
              className="mr-3 h-6 sm:h-9"
              alt="Lotus Logo"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              佛光山 Sutraoke
            </span>
          </a>
        </div>
        <div className="navbar-end hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <button
                // onClick={changeSutra("sutra 1")}
                className="font-bold px-5 block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
              >
                Heart Sutra
              </button>
            </li>
            <li tabIndex={0} className="ml-10">
              <a>
                Theme
                <svg
                  className="fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                </svg>
              </a>
              <ul className="p-2">
                <li>
                  <button
                    className={baseTextColor}
                    onClick={() => setColorTheme("Black")}
                  >
                    Black
                  </button>
                </li>
                <li>
                  <button
                    className={baseTextColor}
                    onClick={() => setColorTheme("Cream")}
                  >
                    Cream
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

const Footer = () => {
  const { headerFooterColor } = useColorTheme();
  return (
    <footer
      className={`rounded-lg shadow m-4 dark:bg-gray-800 absolute inset-x-0 bottom-0 ${headerFooterColor}`}
    >
      <div className="w-full mx-auto container md:p-6 p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2023{" "}
          <a href="https://www.ibps-austin.org/en/" className="hover:underline">
            Fo Guang Shan Xiang Yun
          </a>
          . All Rights Reserved.
        </span>
        <ul className="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
          <li>
            <a
              href="https://www.ibps-austin.org/en/austin/index.php"
              className="mr-4 hover:underline md:mr-6 "
            >
              About
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

type SyllableProps = {
  syllable: string;
  isNunOnly: boolean;
  isHighlighted: boolean;
  isNext: boolean;
};

const Syllable: FC<SyllableProps> = ({
  isNunOnly,
  isHighlighted,
  isNext,
  syllable,
}) => {
  const {
    everyoneHighlightColor,
    nunOnlyHighlightColor,
    nunOnlyColor,
    everyoneColor,
    baseTextColor,
  } = useColorTheme();

  const textColor = isNext
    ? isNunOnly
      ? nunOnlyColor
      : everyoneColor
    : baseTextColor;
  const highlight = isHighlighted
    ? isNunOnly
      ? nunOnlyHighlightColor
      : everyoneHighlightColor
    : "";

  return (
    <div className={`text-8xl  ${textColor} ${highlight}`}>{syllable}</div>
  );
};

type SutraLineProps = {
  lines: string[][];
  offset: number;
  index: number;
};
const SutraLine: FC<SutraLineProps> = ({ lines, offset, index }) => {
  let runningSyllableSum = 0;
  const { baseTextColor } = useColorTheme();

  const lineElements = lines
    .map((line, lineIndex) => {
      if (!line) return [];
      let lineSyllableElements: ReactNode[] = [];

      if (lineIndex % 2 !== offset) {
        return null;
      }

      if (lineIndex !== 0) {
        const prev_line_syllables = lines[lineIndex - 1]
          .map((word) => tokenize(word).length)
          .reduce((acc, l) => acc + l, 0);
        runningSyllableSum += prev_line_syllables;
      }

      for (let wordIndex = 0; wordIndex < line.length; wordIndex++) {
        let word = line[wordIndex];
        let isNunOnly = word.startsWith("$");
        if (isNunOnly) {
          word = word.slice(1);
        }
        let syllables = tokenize(word);
        if (wordIndex !== 0) {
          lineSyllableElements.push(
            <p className={`${baseTextColor} text-xl mx-3`}>◯</p>
          );
        }

        for (const syllable of syllables) {
          const isHighlighted = runningSyllableSum <= index;
          const isNextSyllable = runningSyllableSum === index + 1;
          const syllableKey = `${lineIndex}-${wordIndex}-${syllable}`;

          lineSyllableElements.push(
            <Syllable
              syllable={syllable}
              isNunOnly={isNunOnly}
              isHighlighted={isHighlighted}
              isNext={isNextSyllable}
            />
          );
          lineSyllableElements.push(<span className="w-5">&nbsp;</span>);
          runningSyllableSum += 1;
        }
      }

      if (runningSyllableSum <= index) {
        return null;
      }

      return lineSyllableElements;
    })
    .filter((el) => el);

  return (
    <div className="h-[9rem] overflow-hidden mt-20">
      <div className="flex flex-wrap mt-10 items-center">{lineElements[0]}</div>
    </div>
  );
};

function App() {
  const queryParameters = new URLSearchParams(window.location.search);
  const initialSutra = (queryParameters.get("sutra") ??
    "Heart Sutra") as SutraName;
  const [sutraName, setSelectedSutraName] = useState<SutraName>(initialSutra);

  const { backgroundColor, baseTextColor } = useColorTheme();
  const [index, setIndex] = useState(-1);

  const max_letter_count = 23;

  const sutra = Sutra[sutraName];
  const lines: string[][] = [];

  let curr_letter_count = 0;
  let line: string[] = [];

  const cleanSutra = sutra
    .replace(/\n/g, " ")
    .split(" ")
    .filter((x) => x.trim() !== "");

  for (const word of cleanSutra) {
    const cleanWord = word.replace(/[$*]/, "");
    if (cleanWord.length + curr_letter_count < max_letter_count) {
      line.push(word);
      curr_letter_count += cleanWord.length;
    } else {
      lines.push(line);
      line = [];
      line.push(word);
      curr_letter_count = cleanWord.length;
    }
  }

  if (line) {
    lines.push(line);
  }

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      // Key List: https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#navigation_keys
      const nextKeys = ["ArrowDown", " ", "ArrowRight"];
      const prevKeys = ["ArrowUp", "ArrowLeft"];

      if (nextKeys.includes(event.key)) {
        setIndex((p) => p + 1);
      } else if (prevKeys.includes(event.key)) {
        setIndex((p) => Math.max(p - 1, -1));
      }
    };
    window.addEventListener("keydown", handler, false);
    return () => {
      window.removeEventListener("keydown", handler, false);
    };
  }, []);

  return (
    <div className={`h-screen flex flex-col ${backgroundColor}`}>
      <Header />
      <div className="px-20 flex flex-col">
        <SutraLine lines={lines} offset={0} index={index} />
        <SutraLine lines={lines} offset={1} index={index} />
        <Footer />
      </div>
    </div>
  );
}

export default App;
