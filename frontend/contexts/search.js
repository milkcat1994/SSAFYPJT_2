import React, { Component, createContext } from 'react';
import http from '../utils/http-common';

const Context = createContext(); // Context 를 만듭니다.

// Context 안에는 Provider 와 Consumer 라는게 존재합니다.
// 이 둘은, Context 를 이용하기 위해 필요한 컴포넌트들입니다.
// Consumer 는 나중에 내보내줄 때 편하도록 SearchConsumer 라고 부르도록 설정했습니다.
const { Provider, Consumer: SearchConsumer } = Context;

// Provider 에서 state 를 사용하기 위해서 컴포넌트를 새로 만들어줍니다.
class SearchProvider extends Component {

    constructor() {
        super();
        this.state = {
            combiSearchText:'',
            combiSearchKey: null,
            searchType: null,
            diseasesSearchText:'',
            diseasesSearchKey: null,
            searchText: '',
        }
    }
    // 최초 구동 한번만 실행 되는듯.
    componentDidMount(){
        http
            .get("/searchword")
            .then(({data}) => {
                let searchItemsList = []
                // items: [
                //     { key: 1, section: true, label: "음식" },
                //     { key: 2, label: "돼지고기" },
                let len = 1;
                searchItemsList.push({ key: len++, section: true, label: "음식" });
                data.compList.forEach((e) =>{
                    searchItemsList.push({key: len++, label: e})
                })
                this.setState({categoryIdx: len})

                searchItemsList.push({ key: len++, section: true, label: "질병" });
                data.diesaseList.forEach((e) =>{
                    searchItemsList.push({key: len++, label: e})
                })

                this.setState({searchItemsList: searchItemsList})
                console.log("음식, 질병 이름 가져오기 성공");
                return;
            })
            .catch(e => {
                console.log(e);
            });

            http
            .get("/profile/diet")
            .then(({data}) => {
                let dietList = []
                let len = 1
                
                data.forEach((e) =>{
                    dietList.push({key: len++, label: e.food})
                })
                
                this.setState({dietList: dietList})
                // console.log(dietList)
                console.log("프로필 음식 카테고리 가져오기 성공");
                return;
            })
            .catch(e => {
                console.log(e);
            });

        http
            .post("/recommend/category")
            .then(({data}) => {
                let categoryList = []
                let len = 1
                data.forEach((e) =>{
                    categoryList.push({key: len++, label: e})
                })
                
                this.setState({categoryList: categoryList})
                console.log("음식점 카테고리 가져오기 성공");
                return;
            })
            .catch(e => {
                console.log(e);
                console.log("음식점 카테고리 가져오기 실패");
            });

        //캐러셀 지우고 리스트로, 클릭시 favMap으로 검색
        // 식단 등록시 사용할 음식이름
        // http
        // .get("/profile/diet")
        // .then(({data}) => {
        //     let dishFoodList = []
        //     let len = 1
        //     data.forEach((e) =>{
        //         dishFoodList.push({
        //             key: len++,
        //             id: e.id,
        //             label: e.food,
        //             energy: e.energy,
        //             protein: e.protein,
        //             fat: e.fat,
        //             carbohidrate: e.carbohidrate,
        //             sodium: e.sodium,
        //             cholesterol: e.cholesterol,
        //             fiber: e.fiber,
        //         })
        //     })

        //     this.setState({dishFoodList: dishFoodList})
        //     console.log("식단등록 사용할 음식이름 가져오기 성공");
        //     return;
        // })
        // .catch(e => {
        //     console.log(e);
        // });
    }
    // 여기서 actions 라는 객체는 우리가 임의로 설정하는 객체입니다.
    // 나중에 변화를 일으키는 함수들을 전달해줄때, 함수 하나하나 일일히 전달하는 것이 아니라,
    // 객체 하나로 한꺼번에 전달하기 위함입니다.
    actions = {
        searchC: (value) => {
            this.setState({
                combiSearchText: value.searchText,
                combiSearchKey: value.searchKey,
                searchType: "C",
                searchText: value.searchText,
            });
        },
        searchD: (value) => {
            this.setState({
                diseasesSearchText: value.searchText,
                diseasesSearchKey: value.searchKey,
                searchType: "D",
                searchText: value.searchText,
            });
        },
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
    SearchProvider,
    SearchConsumer,
    Context,
};
