import React, { FC, ReactNode, useEffect, useState } from "react";
import "./App.css";
import { Sutra } from "./Sutra";

const tokenize = (raw: string) => {
  const syllableRegex =
    /[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi;

  const syllabify = (words: string) => {
    let syllables = words.match(syllableRegex) ?? [];
    return syllables;
  };
  return syllabify(raw);
};

function Header() {
  return (
    <header>
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <a
            href="https://www.ibps-austin.org/en/"
            className="flex items-center">
            <img
              src="data:image/png;base64,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"
              className="mr-3 h-6 sm:h-9"
              alt="Flowbite Logo"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              Fo Guang Shan Xiang Yun
            </span>
          </a>
          <div
            className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
            id="mobile-menu-2">
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <button
                  // onClick={changeSutra("sutra 1")}
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">
                  Heart Sutra
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

const Footer = () => {
  return (
    <footer className=" bg-white rounded-lg shadow m-4 dark:bg-gray-800 absolute inset-x-0 bottom-0">
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
            <a href="#" className="mr-4 hover:underline md:mr-6 ">
              About
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

type SutraLineProps = { lines: string[][]; offset: number; index: number };
const SutraLine: FC<SutraLineProps> = ({ lines, offset, index }) => {
  let runningSyllableSum = 0;

  const wordElements = lines.map((line, lineIndex) => {
    if (!line) return [];
    let lineSyllableElements: ReactNode[] = [];

    if (lineIndex % 2 === offset) {
      if (lineIndex !== 0) {
        const prev_line_syllables = lines[lineIndex - 1]
          .map((word) => tokenize(word).length)
          .reduce((acc, l) => acc + l, 0);
        runningSyllableSum += prev_line_syllables;
      }
      for (let wordIndex = 0; wordIndex < line.length; wordIndex++) {
        let syllables = tokenize(line[wordIndex]);
        if (wordIndex !== 0) {
          lineSyllableElements.push(
            <p className="text-white text-xl"> ◯ &nbsp;&nbsp; </p>
          );
        }

        for (const syllable of syllables) {
          const isHighlighted = runningSyllableSum <= index;
          const isNextWord = runningSyllableSum === index + 1;
          lineSyllableElements.push(
            <div
              id={`${lineIndex}-${wordIndex}`}
              className={`text-8xl ${isNextWord ? "text-blue-500" : ""} ${
                isHighlighted ? "text-gray-500 font-outline-2" : "text-white"
              } `}>
              {syllable}{" "}
            </div>
          );
          lineSyllableElements.push(<span className="w-5">&nbsp;</span>);
          runningSyllableSum += 1;
        }
      }
    }
    if (runningSyllableSum <= index + 1) {
      return null;
    }

    return (
      <div className="flex flex-row items-center">{lineSyllableElements}</div>
    );
  });

  return (
    <div className="h-[9rem] overflow-hidden mt-20">
      <div className="flex flex-wrap mt-10">{wordElements}</div>
    </div>
  );
};

function App() {
  const [index, setIndex] = useState(-1);
  const [sutraName, setSelectedSutraName] = useState<Sutra>("Heart Sutra");

  const max_letter_count = 27;

  const sutra = Sutra[sutraName];
  const lines: string[][] = [];

  let curr_letter_count = 0;
  let line: string[] = [];

  for (const word of sutra
    .replace("\n", " ")
    .split(" ")
    .filter((x) => x.trim() !== "")) {
    if (word.length + curr_letter_count < max_letter_count) {
      line.push(word);
      curr_letter_count += word.length;
    } else {
      lines.push(line);
      line = [];
      line.push(word);
      curr_letter_count = word.length;
    }
  }

  if (line) {
    lines.push(line);
  }

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      // Key List: https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#navigation_keys
      const nextKeys = ["ArrowDown", "ArrowRight"];
      const prevKeys = ["ArrowUp", "ArrowLeft"];

      if (nextKeys.includes(event.key)) {
        setIndex((p) => p + 1);
      } else if (prevKeys.includes(event.key)) {
        setIndex((p) => p - 1);
      } else {
        // Go next for any key
        setIndex((p) => p + 1);
      }
    };
    window.addEventListener("keydown", handler, false);
    return () => {
      window.removeEventListener("keydown", handler, false);
    };
  }, []);

  return (
    <div className="h-screen bg-black flex flex-col">
      <Header />
      <div className="px-20 flex flex-col">
        <div className="text-7xl text-white mt-10">{sutraName}</div>
        <SutraLine lines={lines} offset={0} index={index} />
        <SutraLine lines={lines} offset={1} index={index} />
      </div>
      <Footer />
    </div>
  );
}

export default App;
