import React from 'react';
import { StatusBar, View } from 'react-native';
import { AppLoading } from 'expo'; // Um sinal de carregamento do APP 
import {Ubuntu_700Bold, useFonts} from '@expo-google-fonts/ubuntu';
import {Roboto_400Regular, Roboto_500Medium} from '@expo-google-fonts/roboto';

import Routes from './src/routes';

export default function App() {
  const [fontsLoaded] = useFonts({
    Ubuntu_700Bold,
    Roboto_400Regular,
    Roboto_500Medium
  })

  if(!fontsLoaded) {
      return <AppLoading />
  }
  // Não se pode dentro do react fazer um retorn, retornando 2 componentes ao mesmo tempo para isso pode colocar eles dentro de um VIew
  // ou utilizar um fragment é uma div que não produz resultado <> </>
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent/>
      <Routes />
    </>
  );
}

