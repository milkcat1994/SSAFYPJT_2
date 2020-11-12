import React from 'react';
import { withNavigation } from '@react-navigation/compat';
import PropTypes from 'prop-types';
import {StyleSheet, Image, TouchableWithoutFeedback, View} from 'react-native';
import { Block, Text, theme } from 'galio-framework';

import { nowTheme } from '../constants';
import {SearchConsumer} from '../contexts/search';

class TwoImgCard extends React.Component {
    render() {
        const {
            navigation,
            item,
            type,
            horizontal,
            full,
            style,
            ctaColor,
            imageStyle,
            ctaRight,
            titleStyle
        } = this.props;

        const imageStyles = [full ? styles.fullImage : styles.horizontalImage, imageStyle];
        const titleStyles = [styles.cardTitle, titleStyle];
        const cardContainer = [styles.card, styles.shadow, style];
        const imgContainer = [
            styles.imageContainer,
            horizontal ? styles.horizontalStyles : styles.verticalStyles,
            styles.shadow
        ];

        return (
            <SearchConsumer>
                {({state}) => (
            <Block row={horizontal} card flex style={cardContainer}>
                <TouchableWithoutFeedback onPress={() => navigation.navigate('궁합상세',{
                    type: type,
                    mainFood: item.foodA,
                    combiFood: item.foodB,
                    id: item.id,
                })}>
                    <Block flex style={imgContainer}>
                        <View style={{flex:1}}>
                            <Image resizeMode="cover" source={{uri:item.image1}} style={imageStyles} />
                        </View>
                        <View style={{flex:1}}>
                            <Image resizeMode="cover" source={{uri:item.image2}} style={imageStyles} />
                        </View>
                    </Block>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => navigation.navigate('궁합상세',{
                    type: type,
                    mainFood: item.foodA,
                    combiFood: item.foodB,
                    id: item.id,
                })}>
                    <Block flex space="between" style={styles.cardDescription}>
                        <Block flex right>
                            <Text
                                style={{ fontFamily: 'montserrat-regular' }}
                                size={14}
                                style={titleStyles}
                                color={nowTheme.COLORS.PRIMARY}
                            >
                                {item.title}
                            </Text>
                            {item.subtitle ? (
                                <Block flex center>
                                    <Text
                                        style={{ fontFamily: 'montserrat-regular' }}
                                        size={32}
                                        color={nowTheme.COLORS.BLACK}
                                    >
                                        {item.subtitle}
                                    </Text>
                                </Block>
                            ) : (
                                <Block />
                            )}
                            {item.description ? (
                                <Block flex center>
                                    <Text
                                        style={{ fontFamily: 'montserrat-regular', textAlign: 'center', padding: 15 }}
                                        size={14}
                                        color={"#9A9A9A"}
                                    >
                                        {item.description}
                                    </Text>
                                </Block>
                            ) : (
                                <Block />
                            )}
                            {item.body ? (
                                <Block flex left>
                                    <Text
                                        style={{ fontFamily: 'montserrat-regular' }}
                                        size={12}
                                        color={nowTheme.COLORS.TEXT}
                                    >
                                        {item.body}
                                    </Text>
                                </Block>
                            ) : (
                                <Block />
                            )}
                        </Block>
                        {/*<Block right={ctaRight ? true : false}>*/}
                        {/*    <Text*/}
                        {/*        style={styles.articleButton}*/}
                        {/*        size={12}*/}
                        {/*        muted={!ctaColor}*/}
                        {/*        color={ctaColor || nowTheme.COLORS.ACTIVE}*/}
                        {/*        bold*/}
                        {/*    >*/}
                        {/*        {item.cta}*/}
                        {/*    </Text>*/}
                        {/*</Block>*/}
                    </Block>
                </TouchableWithoutFeedback>
            </Block>
                )
                }
            </SearchConsumer>
        );
    }
}

TwoImgCard.propTypes = {
    item: PropTypes.object,
    horizontal: PropTypes.bool,
    full: PropTypes.bool,
    ctaColor: PropTypes.string,
    imageStyle: PropTypes.any,
    ctaRight: PropTypes.bool,
    titleStyle: PropTypes.any,
    textBodyStyle: PropTypes.any
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.COLORS.WHITE,
        marginVertical: theme.SIZES.BASE,
        borderWidth: 0,
        minHeight: 114,
        marginBottom: 4,
        // paddingLeft:10,
        // paddingRight:10
    },
    cardTitle: {
        paddingHorizontal: 9,
        paddingTop: 7,
        paddingBottom: 15
    },
    cardDescription: {
        padding: theme.SIZES.BASE / 2
    },
    imageContainer: {
        borderRadius: 3,
        elevation: 1,
        overflow: 'hidden',
        flexDirection:'row',
    },
    image: {
        // borderRadius: 3,
    },
    horizontalImage: {
        height: 122,
        width: 'auto'
    },
    horizontalStyles: {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0
    },
    verticalStyles: {
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0
    },
    fullImage: {
        height: 215
    },
    shadow: {
        shadowColor: '#8898AA',
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 6,
        shadowOpacity: 0.1,
        elevation: 2
    },
    articleButton: {
        fontFamily: 'montserrat-bold',
        paddingHorizontal: 9,
        paddingVertical: 7
    }
});

export default withNavigation(TwoImgCard);
