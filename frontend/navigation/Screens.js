import React from 'react';
import {Block, Text, theme} from 'galio-framework';
import {Easing, Animated, Dimensions, View} from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {SearchConsumer} from '../contexts/search';
import {AuthConsumer} from '../contexts/auth'

// screens
import Home from '../screens/Home';
import Pro from '../screens/Pro';
import Profile from '../screens/Profile';
import NutritionCalendar from '../screens/NutritionCalendar'
import NutritionAnalysis from '../screens/NutritionAnalysis'
import Register from '../screens/Register';
import Login from '../screens/Login';
import FavoriteMap from '../screens/FavoriteMap';
import Components from '../screens/Components';
import SearchResult from '../screens/SearchResult';
import CombiSearch from '../screens/CombiSearch';
import DiseasesSearch from '../screens/DiseasesSearch';
import CombiDetail from '../screens/CombiDetail';
import Onboarding from '../screens/Onboarding';
import SettingsScreen from '../screens/Settings';
// drawer
import CustomDrawerContent from "./Menu";
// header for screens
import { Header, Icon} from '../components';
import { nowTheme, tabs } from "../constants";

const { width } = Dimensions.get("screen");

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function FavoriteMapStack(props) {
  return (
    <AuthConsumer>
        {({state, actions}) => (
          <Stack.Navigator initialRouteName="FavoriteMap" mode="card" headerMode="screen">
            <Stack.Screen
            name="취향지도"
            options={{
              header:({ navigation, scene }) => (
                <Header
                  title="취향지도"
                  navigation={navigation}
                  scene={scene}
                />
              ),
              cardStyle: { backgroundColor: "#FFFFFF" },
            }}>
            {(props) =>
                <FavoriteMap {...props} uid={state.uid} dishChanged={state.dishChanged}/>}
              </Stack.Screen>
          </Stack.Navigator>
        )
      }
    </AuthConsumer>
  );
}

function ArticlesStack(props) {
  return (
    <Stack.Navigator initialRouteName="Articles" mode="card" headerMode="screen">
      <Stack.Screen name="Articles" component={SearchResult} options={{
        header: ({ navigation, scene }) => (<Header title="커뮤니티" navigation={navigation} scene={scene} />),
        backgroundColor: '#FFFFFF'
      }} />
    </Stack.Navigator>
  );
}

function LoginStack(props) {
    return (
        <Stack.Navigator initialRouteName="Login" mode="card" headerMode="screen">
            <Stack.Screen
                name="Login"
                component={Login}
                options={{
                    header: ({ navigation, scene }) => (
                        <Header
                            back
                            transparent
                            title="로그인"
                            navigation={navigation}
                            scene={scene}
                        />
                    ),
                    headerTransparent: true
                }}
            />
        </Stack.Navigator>
    );
}

function RegisterStack(props){
  return (
    <Stack.Navigator initialRouteName="Register" mode="card" headerMode="screen">
        <Stack.Screen
            name="Register"
            component={Register}
            options={{
                header: ({ navigation, scene }) => (
                    <Header
                        transparent
                        title="회원가입"
                        navigation={navigation}
                        scene={scene}
                    />
                ),
                headerTransparent: true
            }}
        />
    </Stack.Navigator>
  );
}

function ProfileStack(props) {
  return (
    <AuthConsumer>
        {({state, actions}) => (
          <Stack.Navigator initialRouteName="Profile" mode="card" headerMode="screen">
            <Stack.Screen
              name="Profile"
              // component={Profile}
              options={{
                header: ({ navigation, scene }) => (
                  <Header
                    title="프로필"
                    navigation={navigation}
                    scene={scene}
                  />
                ),
                cardStyle: { backgroundColor: "#FFFFFF" },
                // headerTransparent: true
              }}
            >
            {(props) =>
                <Profile {...props} uid={state.uid} />}
              </Stack.Screen>
          </Stack.Navigator>
        )
      }
    </AuthConsumer>
  );
}

function NutritionDetailStack(props) {
  let dayTitle = props.route.params.date
  let date = props.route.params.date
  let day = props.route.params.day
  return (
    <AuthConsumer>
        {({state, actions}) => (
          <Stack.Navigator initialRouteName="Profile" mode="card" headerMode="screen">
            <Stack.Screen
              name="영양상세"
              // component={NutritionAnalysis}
              options={{
                header: ({ navigation, scene }) => (
                  <Header
                    back
                    title={dayTitle}
                    navigation={navigation}
                    scene={scene}
                  />
                ),
                cardStyle: { backgroundColor: "#FFFFFF" },
                // headerTransparent: true
              }}
            >
            {(props) =>
                <NutritionAnalysis {...props}  day={day} date={date}/>}
          </Stack.Screen>
          </Stack.Navigator>
        )
      }
    </AuthConsumer>
  );
}

function NutritionCalendarStack(props) {
  // let mainFood = props.route.params.mainFood
  return (
    <AuthConsumer>
        {({state, actions}) => (
          <Stack.Navigator initialRouteName="Profile" mode="card" headerMode="screen">
            <Stack.Screen
              name="영양관리"
              // component={NutritionCalendar}
              options={{
                header: ({ navigation, scene }) => (
                  <Header
                    title="영양관리"
                    navigation={navigation}
                    scene={scene}
                  />
                ),
                cardStyle: { backgroundColor: "#FFFFFF" },
                // headerTransparent: true
              }}
            >
              {(props) =>
                  <NutritionCalendar {...props} dishChanged={state.dishChanged}/>}
            </Stack.Screen>
          </Stack.Navigator>
        )
      }
    </AuthConsumer>
  );
}

function HomeStack(props) {
  return (
    <AuthConsumer>
        {({state, actions}) => (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="Home"
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="메인화면"
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#FFFFFF" }
        }}
      >
      {(props) =>
          <Home {...props}  uid={state.uid} isLoggedIn={state.isLoggedIn} dishChanged={state.dishChanged}/>}
        </Stack.Screen>
    </Stack.Navigator>
        )
      }
    </AuthConsumer>
  );
}

function CombiSearchStack(props) {
    let mainFood = props.route.params.mainFood
    return (
        <SearchConsumer>
            {({state, actions}) => (
              <Stack.Navigator mode="card" headerMode="screen">
                  <Stack.Screen
                      name="궁합검색"
                      // component={CombiSearch}
                      options={{
                          header: ({ navigation, scene }) => (
                              <Header
                                  title="뭐랑 먹지?"
                                  navigation={navigation}
                                  scene={scene}
                              />
                          ),
                          cardStyle: { backgroundColor: "#FFFFFF" }
                      }}
                  >
                      {(props) =>
                          <CombiSearch {...props} mainFood={mainFood} />}
                  </Stack.Screen>
              </Stack.Navigator>
          )
        }
    </SearchConsumer>
    );
}

function DiseasesSearchStack(props) {
    let mainDisease = props.route.params.mainDisease
    return (
        <SearchConsumer>
            {({state, actions}) => (
        <Stack.Navigator mode="card" headerMode="screen">
            <Stack.Screen
                name="질병검색"
                // component={DiseasesSearch}
                options={{
                    header: ({ navigation, scene }) => (
                        <Header
                            title="왜 아프지?"
                            navigation={navigation}
                            scene={scene}
                        />
                    ),
                    cardStyle: { backgroundColor: "#FFFFFF" }
                }}
            >
                {(props) =>
                    <DiseasesSearch {...props} mainDisease={mainDisease} />}
            </Stack.Screen>
        </Stack.Navigator>
            )
            }
        </SearchConsumer>
    );
}


function CombiDetailStack(props) {
    let mainFood = props.route.params.mainFood
    let targetFood = props.route.params.combiFood
    let targetId = props.route.params.id
    let type = props.route.params.type
    return (
        <SearchConsumer>
            {({state, actions}) => (
            <Stack.Navigator initialRouteName="Login" mode="card" headerMode="screen">
              <Stack.Screen
                  name="궁합상세"
                  // component={CombiDetail}
                  options={{
                      header: ({ navigation, scene }) => (
                          <Header back
                                  title={mainFood + " & " + targetFood}
                                  targetFood={targetFood}
                                  navigation={navigation}
                                  scene={scene}/>
                      ),
                      cardStyle: { backgroundColor: "#FFFFFF" }
                  }}
              >
                  {(props) =>
                      <CombiDetail {...props} mainFood={mainFood} targetFood={targetFood} type={type} targetId={targetId} />}
              </Stack.Screen>
            </Stack.Navigator>
            )
          }
        </SearchConsumer>
    );
}


function SettingStack(props) {
  return (
    <Stack.Navigator mode="card" headerMode="screen">
      <Stack.Screen
        name="설정"
        component={SettingsScreen}
        options={{
          header: ({ navigation, scene }) => (
            <Header
              title="설정"
              navigation={navigation}
              scene={scene}
            />
          ),
          cardStyle: { backgroundColor: "#FFFFFF" }
        }}
      />
    </Stack.Navigator>
  );
}

function AppStack(props) {
  return (
    <Drawer.Navigator
      style={{ flex: 1 }}
      drawerContent={props => <CustomDrawerContent {...props} />}
      drawerStyle={{
        backgroundColor: nowTheme.COLORS.PRIMARY,
        width: width * 0.8
      }}
      drawerContentOptions={{
        activeTintcolor: nowTheme.COLORS.WHITE,
        inactiveTintColor: nowTheme.COLORS.WHITE,
        activeBackgroundColor: "transparent",
        itemStyle: {
          width: width * 0.75,
          backgroundColor: "transparent",
          paddingVertical: 16,
          paddingHorizonal: 12,
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          overflow: "hidden"
        },
        labelStyle: {
          fontSize: 18,
          marginLeft: 12,
          fontWeight: "normal"
        }
      }}
      initialRouteName="Home"
    >
      {/*  아래 각 컴포넌트들을 이제 각각 연결 해주어야 한다. */}
      <Drawer.Screen name="메인화면" component={HomeStack} />
      <Drawer.Screen name="취향지도" component={FavoriteMapStack} />
      {/* <Drawer.Screen name="커뮤니티" component={FavoriteMapStack} /> */}
      <Drawer.Screen name="영양관리" component={NutritionCalendarStack} />
      <Drawer.Screen name="프로필" component={ProfileStack} />
      <Drawer.Screen name="로그인" component={LoginStack} />
      {/* <Drawer.Screen name="회원가입" component={RegisterStack} /> */}

      <Drawer.Screen name="궁합검색" component={CombiSearchStack} />
      <Drawer.Screen name="질병검색" component={DiseasesSearchStack} />

    </Drawer.Navigator>
  );
}

export default function OnboardingStack(props) {
  return (
      <Stack.Navigator mode="card" headerMode="none">
        <Stack.Screen name="App" component={AppStack} />
        <Stack.Screen name="영양상세" component={NutritionDetailStack} />
        <Stack.Screen name="궁합상세" component={CombiDetailStack} />
        <Stack.Screen name="설정" component={SettingStack} />
      </Stack.Navigator>

  );
}

