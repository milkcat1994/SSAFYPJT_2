import React, { Component } from 'react';
import {Text, View, Dimensions, StyleSheet, ScrollView} from 'react-native';
import { theme } from 'galio-framework';
import { CombiCard } from '../index'
import Carousel from 'react-native-snap-carousel'; // Version can be specified in package.json

import { scrollInterpolator, animatedStyles } from '../../utils/animations';

const SLIDER_WIDTH = Dimensions.get('window').width - theme.SIZES.BASE*2;
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
const ITEM_HEIGHT = Math.round(ITEM_WIDTH * 3 / 4);

export default class ImageCarousel extends Component {

    state = {
        index: 0
    }

    listItems = []

    constructor(props) {
        super(props);
        this._renderItem = this._renderItem.bind(this)
    }

    _renderItem({ item, idx}) {
        return (
            <View >
                {item}
            </View>

        );
    }

    //axios 추가하여 통신하면 될듯
    _rendList(){
        // console.log("캐러셀에서 axios 요청")
    }

    render() {
        this._rendList();
        const {searchText} = this.props;
        return (
            <View>
                <Carousel
                    ref={(c) => this.carousel = c}
                    data={
                        this.props.items.map(data => (
                            <CombiCard item={data} ctaRight />
                        ))}
                    renderItem={this._renderItem}
                    sliderWidth={SLIDER_WIDTH}
                    itemWidth={ITEM_WIDTH}
                    containerCustomStyle={styles.carouselContainer}
                    inactiveSlideShift={0}
                    onSnapToItem={(index) => this.setState({ index })}
                    scrollInterpolator={scrollInterpolator}
                    slideInterpolatedStyle={animatedStyles}
                    useScrollView={true}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    carouselContainer: {
        // marginTop: 40
    },
    itemContainer: {
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'dodgerblue'
    },
    itemLabel: {
        color: 'white',
        fontSize: 24
    },
    counter: {
        marginTop: 25,
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});
