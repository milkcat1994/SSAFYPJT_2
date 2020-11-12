import React from 'react';
import http from "../utils/http-common";
import Svg, { G, Path } from "react-native-svg"
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard, Alert
} from 'react-native';
import Toast from 'react-native-simple-toast';
import { Block, Checkbox, Text, Button as GaButton, theme } from 'galio-framework';
import * as GoogleSignIn from 'expo-google-sign-in';
import * as Google from 'expo-google-app-auth';
import { Button, Icon, Input } from '../components';
import { Images, nowTheme } from '../constants';

import {AuthConsumer, Context} from '../contexts/auth';
import { color } from 'react-native-reanimated';

const { width, height } = Dimensions.get('screen');

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);

function GoogleSvgComponent(props: React.SVGProps<SVGSVGElement>) {
  return (
      <Svg width={40} height={40} viewBox="0 0 36 36" {...props}>
        <G fill="none" fillRule="evenodd">
          <Path
              d="M34.437 18.602c0-1.15-.106-2.258-.301-3.32H18.549v6.28h8.907c-.384 2.029-1.55 3.748-3.302 4.9v4.072h5.348c3.13-2.826 4.935-6.988 4.935-11.932z"
              fill="#4285F4"
          />
          <Path
              d="M18.55 34.467c4.468 0 8.214-1.453 10.952-3.933l-5.348-4.073c-1.482.974-3.378 1.55-5.605 1.55-4.31 0-7.958-2.855-9.26-6.693H3.76v4.206c2.723 5.306 8.32 8.943 14.79 8.943z"
              fill="#34A853"
          />
          <Path
              d="M9.29 21.318a9.591 9.591 0 01-.52-3.084c0-1.07.188-2.11.52-3.085v-4.206H3.76a15.98 15.98 0 000 14.581l5.53-4.206z"
              fill="#FBBC05"
          />
          <Path
              d="M18.55 8.456c2.43 0 4.61.82 6.326 2.428l4.747-4.656C26.756 3.608 23.01 2 18.549 2 12.08 2 6.483 5.638 3.76 10.943l5.53 4.206c1.3-3.837 4.95-6.693 9.26-6.693z"
              fill="#EA4335"
          />
        </G>
      </Svg>
  )
}

function KakaoSvgComponent(props: React.SVGProps<SVGSVGElement>) {
  return (
      <Svg height={50} viewBox="0 0 24 24" width={50} {...props}>
        <Path
            d="M12 1C5.373 1 0 5.208 0 10.399c0 3.356 2.246 6.301 5.625 7.963-1.678 5.749-2.664 6.123 4.244 1.287.692.097 1.404.148 2.131.148 6.627 0 12-4.208 12-9.399C24 5.208 18.627 1 12 1z"
            fill="#3e2723"
        />
        <G fill="#ffeb3b">
          <Path d="M10.384 8.27a.97.97 0 00-1.845-.001c-.984 3.052-2.302 4.935-1.492 5.306 1.078.489 1.101-.611 1.359-1.1h2.111c.257.487.282 1.588 1.359 1.1.813-.371-.489-2.195-1.492-5.305zM8.77 11.257l.692-1.951.691 1.951zM5.365 13.68c-1.198 0-.49-1.657-.692-4.742-.429-.074-1.76.297-1.76-.673 0-.371.305-.673.679-.673 2.518.18 4.224-.47 4.224.673 0 .987-1.275.59-1.76.673-.2 3.075.505 4.742-.691 4.742zM13.154 13.579c-1.159 0-.454-1.565-.663-5.301 0-.91 1.413-.909 1.413 0v4.04c.669.089 2.135-.33 2.135.63-.001 1.007-1.576.503-2.885.631zM19.556 13.38l-1.624-2.137-.24.239v1.5a.69.69 0 01-.693.688c-1.203 0-.482-1.732-.692-5.392a.69.69 0 01.692-.688c1.045 0 .594 1.478.692 2.166 1.96-1.873 1.913-2.072 2.316-2.072.556 0 .897.691.527 1.058l-1.578 1.567 1.704 2.243c.556.725-.555 1.556-1.104.828z" />
        </G>
      </Svg>
  )
}

class Login extends React.Component {

  constructor(props, context){
    super(props, context)

    this.state = {
      email : "dolong@naver.com",
      password : "asdf1234",
      uid:'',
      nickname:'',
      accountType: '',
      loginFail:false,
      loginFailText:'',
    }
    this.onPress = this.onPress.bind(this)    
    this.Login = this.Login.bind(this)
  }

  componentDidMount() {
    
  }

  signInWithGoogleAsync = async (state, actions) => {
    try {
      const {type, accessToken, user} = await Google.logInAsync({
        androidClientId: '353554414055-t90knqget6a0ak7qtj2hn0rh19k9863r.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });
  
      if (type === 'success') {
        let userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        /*
          "email": "",
          "familyName": "",
          "givenName": "",
          "id": "",
          "name": "",
          "photoUrl": "",
        */
        // console.log(user)
        // 동기적 로그인 처리
        if(userInfoResponse = 'success')
          await this.Login(user, state, actions)

        return userInfoResponse;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      Alert.alert(
        'Alert Title',
        e,
        [
          {
            text: 'Ask me later',
            onPress: () => console.log('Ask me later pressed')
          },
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          },
          { text: 'OK', onPress: () => console.log('OK Pressed') }
        ],
        { cancelable: false }
      );
      return { error: true };
    }
  }

  onPress = async (state, actions) => {
    if (this.state.user) {
      this.signOutAsync();
    } else {
      let test = await this.signInWithGoogleAsync(state, actions);
      //main으로 redirect
      if(test === 'success')
        this.goMainScreen();
    }
  };

  handleChangeEmail = (newEmail) => {
    this.setState({email: newEmail});
  }

  handleChangePassword = (newPw) => {
    this.setState({password: newPw});
  }

  Login(user, state, actions) {
    console.log(user)
    http
        .post("/user/Google",{
          gEmail:user.email,
          gNickname:user.name,
          img:user.photoUrl,
        })
        .then(({data}) => {
          console.dir(data);
          actions.login({
            uid: data.uid,
            nickname: data.nickname,
            accountType: data.accountType,
            img:user.photoUrl,
          })
          console.log("로그인 성공");
          return;
        })
        .catch(e => {
          (Toast.show('이메일 또는 비밀번호가 틀렸습니다.', Toast.SHORT))
          this.setState({
            loginFail:true,
            loginFailText:'이메일 또는 비밀번호가 틀렸습니다.'
          });
          console.log(e);
        });
    console.log("끝")
  }

  goMainScreen(){
    // 바로 이전 화면으로 이동
    this.props.navigation.navigate("메인화면");
  }

  render() {
    return (
      <DismissKeyboard>
        <Block flex middle>
          <ImageBackground
            source={Images.RegisterBackground}
            style={styles.imageBackgroundContainer}
            imageStyle={styles.imageBackground}
          >
          <AuthConsumer>
            {({state, actions}) => (
            <Block flex middle>
              <Block style={styles.registerContainer}>
                <Block flex space="evenly">
                  <Block flex={0.4} middle style={styles.socialConnect}>
                    <Block flex={0.5} middle>
                      <Text
                        style={{
                          fontFamily: 'montserrat-regular',
                          textAlign: 'center'
                        }}
                        color="#333"
                        size={24}
                      >
                        푸드 메이트
                      </Text>
                    </Block>

                    <TouchableOpacity
                      onPress={() => this.onPress(state, actions)}>
                      <Block row middle space="between" style={styles.googleContainer }>
                        <GoogleSvgComponent
                        style={[styles.social, styles.shadow]}/>
                        <Text
                          style={{
                            fontFamily: 'montserrat-regular',
                          }}
                          size={18}
                        >
                          구글로 로그인 하기
                        </Text>
                      </Block>
                    </TouchableOpacity>
                  </Block>
                </Block>
              </Block>
            </Block>
                                )
                            }
                        </AuthConsumer>
          </ImageBackground>
        </Block>
      </DismissKeyboard>
    );
  }
}

const styles = StyleSheet.create({
  imageBackgroundContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1
  },
  imageBackground: {
    width: width,
    height: height,
  },
  registerContainer: {
    // marginTop: 55,
    // width: width * 0.9,
    // height: height < 812 ? height * 0.8 : height * 0.8,
    // backgroundColor: nowTheme.COLORS.WHITE,
    // borderRadius: 4,
    // shadowColor: nowTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: 'hidden'
  },
  socialConnect: {
    // backgroundColor: nowTheme.COLORS.WHITE
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // borderColor: "rgba(136, 152, 170, 0.3)"
  },
  googleContainer:{
    // marginBottom: 18,
    paddingHorizontal:20,
    paddingVertical:10,
    borderRadius:30,
    backgroundColor: nowTheme.COLORS.WHITE,
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: '#fff',
    shadowColor: nowTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1
  },
  socialTextButtons: {
    color: nowTheme.COLORS.PRIMARY,
    fontWeight: '800',
    fontSize: 14
  },
  inputIcons: {
    marginRight: 12,
    color: nowTheme.COLORS.ICON_INPUT
  },
  inputs: {
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 21.5
  },
  loginFail:{
    // flexDirection:'row',
    // alignItems:'flex-end',
    textAlign:'right',
    color: nowTheme.COLORS.INPUT_ERROR
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25,
    marginBottom: 40
  },
  social: {
    // width: theme.SIZES.BASE * 3.5,
    // height: theme.SIZES.BASE * 3.5,
    // borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: 'center',
    marginRight:10,
    // marginHorizontal: 30
  }
});

export default Login;
