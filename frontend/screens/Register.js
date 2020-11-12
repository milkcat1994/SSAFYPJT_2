import React from 'react';
import http from "../utils/http-common";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { Block, Checkbox, Text, Button as GaButton, theme } from 'galio-framework';
import { AntDesign } from '@expo/vector-icons';
import { Button, Icon, Input } from '../components';
import { Images, nowTheme } from '../constants';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { SimpleLineIcons } from '@expo/vector-icons';
const { width, height } = Dimensions.get('screen');

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);

class Register extends React.Component {
  constructor(){
    super()
    this.state={
      email : 'ptoooool@naver.com',
      nickname : '호로루22',
      password : 'asdf1234',
      auth : false,
      authInput : '',
      checkAuth : '',
      joinBtnCheck : false,
      emailCheck : false,
      nicknameCheck : false,
      passwordCheck : false
    }
  }
  Register () {
    alert("오키");
    this.goMainScreen();;
    http
        .post(`/user`, {
          email:this.state.email,
          pw:this.state.password,
          nickname:this.state.nickname
        })
        .then(({data}) => {
          console.dir(data);
          console.log("회원가입 성공");
          alert("회원가입 성공");
          this.goBeforeScreen();
          return;
        })
        .catch(e => {
          alert("실패");
          console.error(e);
        });
  }
  EmailSender(email){
    this.setState({
      auth:true
    })
    http
    .post(`/email`, {
      email:this.state.email,
    })
    .then(({data}) => {
      alert("이메일 전송 완료");
      this.state.checkAuth = data.object
      return;
    })
    .catch(e => {
      alert("실패");
      console.error(e);
    });
  }
  CheckAuth(){
    if(this.state.checkAuth == this.state.authInput){
      this.setState({
        joinBtnCheck:true
      })
      console.log
      alert("인증완료")
    }else{
      alert("인증번호 불일치");
    }
  }
  goBeforeScreen(){
    // 바로 이전 화면으로 이동
    this.props.navigation.goBack();
  }

  render() {
    let bgColor = this.state.joinBtnCheck ? "white" : "rgba(227,226,226, 0.5)"
    return (
      <DismissKeyboard>
        <Block flex middle>
          <ImageBackground
            source={Images.RegisterBackground}
            style={styles.imageBackgroundContainer}
            imageStyle={styles.imageBackground}
          >
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
                        회원가입
                      </Text>
                    </Block>

                    <Block flex={0.5} row middle space="between" style={{ marginBottom: 18 }}>
                      <GaButton
                        round
                        onlyIcon
                        shadowless
                        icon="twitter"
                        iconFamily="Font-Awesome"
                        iconColor={theme.COLORS.WHITE}
                        iconSize={theme.SIZES.BASE * 1.625}
                        color={nowTheme.COLORS.TWITTER}
                        style={[styles.social, styles.shadow]}
                      />

                      <GaButton
                        round
                        onlyIcon
                        shadowless
                        icon="dribbble"
                        iconFamily="Font-Awesome"
                        iconColor={theme.COLORS.WHITE}
                        iconSize={theme.SIZES.BASE * 1.625}
                        color={nowTheme.COLORS.DRIBBBLE}
                        style={[styles.social, styles.shadow]}
                      />
                      <GaButton
                        round
                        onlyIcon
                        shadowless
                        icon="facebook"
                        iconFamily="Font-Awesome"
                        iconColor={theme.COLORS.WHITE}
                        iconSize={theme.SIZES.BASE * 1.625}
                        color={nowTheme.COLORS.FACEBOOK}
                        style={[styles.social, styles.shadow]}
                      />
                    </Block>
                  </Block>
                  <Block flex={0.1} middle>
                    <Text
                      style={{
                        fontFamily: 'montserrat-regular',
                        textAlign: 'center'
                      }}
                      muted
                      size={16}
                    >
                      or be classical
                    </Text>
                  </Block>
                  <Block flex={1} middle space="between">
                    <Block center flex={0.9}>
                      <Block flex space="between">
                        <Block>
                        <Block width={width * 0.8}>
                            <Input
                              placeholder="Email"
                              value={this.state.email}
                              style={styles.inputs}
                              onChangeText={(text) => { this.setState({ email: text})}}
                              iconContent={
                                <MaterialCommunityIcons name="email-outline" size={24} color="black" style={{marginRight : 10}}/>
                              }
                            />
                            <Button color="white" round style={styles.emailButton}
                            onPress={() => this.EmailSender(this.state.email)}>
                              <Text
                                style={{ fontFamily: 'montserrat-bold' }}
                                size={14}
                                color="black"
                              >
                                인증
                              </Text>
                            </Button>
                            <Block style={{flexDirection: 'row'}}>
                              {
                                this.state.auth?
                                <Input
                                  placeholder="인증번호"
                                  value={this.state.authInput}
                                  style={styles.authInput}
                                  onChangeText={(text) => { this.setState({ authInput: text})}}
                                  name="authInput"
                                />
                                :null
                              }
                              {
                                this.state.auth?
                                <Button
                                  onPress={() => this.CheckAuth()}
                                  style={styles.authButton}
                                  color="white"
                                >
                                <Text
                                size={14}
                                color="black">
                                확인
                                </Text>
                                </Button>
                                :null
                              }
                            </Block>
                          </Block>
                          <Block width={width * 0.8} style={{ marginBottom: 5 }}>
                            <Input
                              placeholder="Nick Name"
                              style={styles.inputs}
                              value={this.state.nickname}
                              onChangeText={(text) => { this.setState({ nickname: text})}}
                              iconContent={
                                <SimpleLineIcons name="user" size={24} color="black" style={{marginRight : 10}}/>
                              }
                            />
                          </Block>
                          <Block width={width * 0.8} style={{ marginBottom: 5 }}>
                            <Input
                              placeholder="Password"
                              secureTextEntry={true}
                              value={this.state.password}
                              style={styles.inputs}
                              onChangeText={(text) => { this.setState({ password: text})}}
                              iconContent={
                                <SimpleLineIcons name="lock-open" size={24} color="black" style={{marginRight : 10}}/>
                                
                              }
                            />
                          </Block>
                          
                          <Block
                            style={{ marginVertical: theme.SIZES.BASE, marginLeft: 15}}
                            row
                            width={width * 0.75}
                          >
                            <Checkbox
                              checkboxStyle={{
                                borderWidth: 1,
                                borderRadius: 2,
                                borderColor: '#E3E3E3'
                              }}
                              color={nowTheme.COLORS.PRIMARY}
                              labelStyle={{
                                color: nowTheme.COLORS.HEADER,
                                fontFamily: 'montserrat-regular'
                              }}
                              label="I agree to the terms and conditions."
                            />
                          </Block>
                        </Block>
                        <Block center>
                        
                          <Button color="primary" round style={styles.createButton}
                          onPress={() => this.Register()}
                          disabled={!this.state.joinBtnCheck}
                          >
                            <Text
                              style={{ fontFamily: 'montserrat-bold' , color : bgColor}}
                              size={14}
                            >
                              회원가입
                            </Text>
                          </Button>
                        </Block>
                      </Block>
                    </Block>
                  </Block>
                </Block>
              </Block>
            </Block>
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
    height: height
  },
  registerContainer: {
    marginTop: 55,
    width: width * 0.9,
    height: height < 812 ? height * 0.8 : height * 0.8,
    backgroundColor: nowTheme.COLORS.WHITE,
    borderRadius: 4,
    shadowColor: nowTheme.COLORS.BLACK,
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
    backgroundColor: nowTheme.COLORS.WHITE
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // borderColor: "rgba(136, 152, 170, 0.3)"
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
  authInput:{
    width : width * 0.4,
  },
  passwordCheck: {
    paddingLeft: 2,
    paddingTop: 6,
    paddingBottom: 15
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25,
    marginBottom: 40
  },
  
  emailButton:{
    width : width * 0.15,
    height: theme.SIZES.BASE * 2,
    borderColor: '#E3E3E3',
  },
  authButton:{
    width : width * 0.15,
    height: theme.SIZES.BASE * 2.5,
    borderColor: '#E3E3E3',
    marginTop : 10, 
    marginLeft : 10
  },
  social: {
    width: theme.SIZES.BASE * 3.5,
    height: theme.SIZES.BASE * 3.5,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: 'center',
    marginHorizontal: 10
  }
});

export default Register;
