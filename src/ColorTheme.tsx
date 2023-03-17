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
    backgroundColor: "bg-black",
    headerFooterColor: "bg-white",
    everyoneHighlightColor: "text-gray-600 font-outline-2",
    nunOnlyHighlightColor: "text-gray-600 font-outline-2-red",
  },
  Cream: {
    everyoneColor: "text-[#9D3C72]",
    nunOnlyColor: "text-[#A84448]",
    baseTextColor: "text-gray-700",
    backgroundColor: "bg-[#F6E1C3]",
    headerFooterColor: "bg-[#E9A178]",
    everyoneHighlightColor: "text-white font-outline-2-orange",
    nunOnlyHighlightColor: "text-white font-outline-2-orange",
  },
} as const;

export type ColorKey = keyof typeof ColorTheme;

type Theme = {
  everyoneColor: string;
  nunOnlyColor: string;
  baseTextColor: string;
  backgroundColor: string;
  headerFooterColor: string;
  everyoneHighlightColor: string;
  nunOnlyHighlightColor: string;
};

type ThemeContext = Theme & {
  setColorTheme: (colorKey: ColorKey) => void;
};

const colorThemeContext = createContext<ThemeContext>({
  everyoneColor: "",
  nunOnlyColor: "",
  baseTextColor: "",
  backgroundColor: "",
  headerFooterColor: "",
  everyoneHighlightColor: "",
  nunOnlyHighlightColor: "",
  setColorTheme: () => undefined,
});

export const useColorTheme = () => useContext(colorThemeContext);

export const ColorProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const queryParameters = new URLSearchParams(window.location.search);

  const initialTheme = (queryParameters.get("theme") ?? "Cream") as ColorKey;
  const [colorTheme, setColorTheme] = useState<Theme>({
    ...ColorTheme[initialTheme],
  });

  return (
    <colorThemeContext.Provider
      value={{
        ...colorTheme,
        setColorTheme: (key) => setColorTheme(ColorTheme[key]),
      }}
    >
      {children}
    </colorThemeContext.Provider>
  );
};
