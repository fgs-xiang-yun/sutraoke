import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from "react";

export const ColorTheme = {
  Black: {
    everyoneColor: "text-blue-500",
    nunOnlyColor: "text-red-500",
    baseTextColor: "text-white",
    background: "bg-black",
  },
  White: {
    everyoneColor: "text-green-500",
    nunOnlyColor: "text-yellow-500",
    baseTextColor: "text-black",
    background: "bg-white",
  },
} as const;

export type ColorKey = keyof typeof ColorTheme;

type Theme = {
  everyoneColor: string;
  nunOnlyColor: string;
  baseTextColor: string;
  background: string;
};

type ThemeContext = Theme & {
  setColorTheme: (colorKey: ColorKey) => void;
};

const colorThemeContext = createContext<ThemeContext>({
  everyoneColor: "",
  nunOnlyColor: "",
  baseTextColor: "",
  background: "",
  setColorTheme: () => undefined,
});

export const useColorTheme = () => useContext(colorThemeContext);

export const ColorProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [colorTheme, setColorTheme] = useState<Theme>({
    ...ColorTheme["Black"],
  });

  return (
    <colorThemeContext.Provider
      value={{
        ...colorTheme,
        setColorTheme: (key) => setColorTheme(ColorTheme[key]),
      }}>
      {children}
    </colorThemeContext.Provider>
  );
};
