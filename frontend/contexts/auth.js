import React, { Component, createContext } from 'react';
const Context = createContext(); // Context 를 만듭니다.
const config = {
    androidClientId: '353554414055-t90knqget6a0ak7qtj2hn0rh19k9863r.apps.googleusercontent.com',
  };

// Context 안에는 Provider 와 Consumer 라는게 존재합니다.
// 이 둘은, Context 를 이용하기 위해 필요한 컴포넌트들입니다.
// Consumer 는 나중에 내보내줄 때 편하도록 AuthConsumer 라고 부르도록 설정했습니다.
const { Provider, Consumer: AuthConsumer } = Context;

// Provider 에서 state 를 사용하기 위해서 컴포넌트를 새로 만들어줍니다.
class AuthProvider extends Component {
    state = {
        // uid: '5ab05b99-530e-468e-9f07-5a72e5637e0c',
        uid: '',
        nickname:'',
        accountType:'',
        img:'',
        // isLoggedIn:true,
        isLoggedIn:false,
        dishChanged:true,        
    }

    // 여기서 actions 라는 객체는 우리가 임의로 설정하는 객체입니다.
    // 나중에 변화를 일으키는 함수들을 전달해줄때, 함수 하나하나 일일히 전달하는 것이 아니라,
    // 객체 하나로 한꺼번에 전달하기 위함입니다.
    actions = {
        login: (value) => {
            this.setState({
                uid: value.uid,
                nickname:value.nickname,
                accountType:value.accountType,
                img:value.img,
                isLoggedIn:true,
            });
            console.log("login>>");
            console.log(this.state);
        },
        logout: () => {
            this.setState({
                uid: '',
                nickname: '',
                accountType: '',
                img:'',
                isLoggedIn: false,
            });
            console.log("logout>>");
            console.log(this.state);
        },
        addDish: () => {
            this.setState({
                dishChanged: !this.dishChanged
            })

        }
    }

    render() {
        const { state, actions } = this;
        // Provider 내에서 사용할 값은, "value" 라고 부릅니다.
        // 현재 컴포넌트의 state 와 actions 객체를 넣은 객체를 만들어서,
        // Provider 의 value 값으로 사용하겠습니다.
        const value = { state, actions };
        return (
            <Provider value={value}>
                {this.props.children}
            </Provider>
        )
    }
}

// 내보내줍니다.
export {
    AuthProvider,
    AuthConsumer,
    Context
};
