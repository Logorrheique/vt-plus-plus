import { useEffect, useState } from 'react';
import { NextUIProvider, createTheme } from '@nextui-org/react';
import { NavbarComp } from './components/NavbarComp';
import { EDT } from './components/EDT';
import { InputCode } from './components/InputCode';
import { useLocalStorage } from './hooks/useLocalstorage';
import { createGlobalStyle } from 'styled-components';
import { ClassNameDisplay, ClassHour } from './components/Edt-part';

const lightTheme = createTheme({
  type: 'light'
  // theme: {
  //   fontSizes: {
  //     base: '1.4vh'
  //   }
  // }
});

const darkTheme = createTheme({
  type: 'dark'
});

const GlobalStyle = createGlobalStyle`
  @media screen and (max-height: 1200px) {
    ${ClassHour} {
      font-size: 8px;
    }

    ${ClassNameDisplay} {
      font-size: 9px;
    }
  }
`;
/**
 * UI si height écran plus petite ?
 * Gérer si les cours sont trop petit
 */
function App() {
  const [codeStorage, setCodeStorage] = useLocalStorage('code', '');
  const [code, setCode] = useState(codeStorage);
  const [isLightMode, setLightMode] = useState(true);
  const changeTheme = () => setLightMode(mode => !mode);

  const updateCode = (newCode: string, remember: boolean) => {
    setCode(newCode);
    if (remember) setCodeStorage(newCode);
  };

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setLightMode(false);
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      setLightMode(!event.matches);
    });
  }, []);

  return (
    <NextUIProvider theme={isLightMode ? lightTheme : darkTheme}>
      <GlobalStyle />
      <NavbarComp
        changeTheme={changeTheme}
        code={code}
        deleteCode={updateCode}
        isLight={isLightMode}
      />
      {code !== '' && <EDT code={code} />}
      {code === '' && <InputCode setCode={updateCode} />}
    </NextUIProvider>
  );
}

export default App;
