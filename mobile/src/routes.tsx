import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './pages/Home';
import Points from './pages/Points';
import Detail from './pages/Detail';

// Ele q vai funcionar como roteamento da aplicação
const AppStack = createStackNavigator();

const Routes = () => {
    return(
        <NavigationContainer>
            <AppStack.Navigator
            headerMode="none"
            // primeira chave indica código javascript a segunda que é um objeto
            screenOptions={{
                cardStyle: {
                    backgroundColor: '#f0f0f5'
                }
            }}>
                {/* name da rota, component = componente exibido em tela quando o componente estiver ativo */}
                <AppStack.Screen name="Home" component={Home}/>
                <AppStack.Screen name="Points" component={Points}/>
                <AppStack.Screen name="Detail" component={Detail}/>

            </AppStack.Navigator>
        </NavigationContainer>
    )
}

export default Routes;