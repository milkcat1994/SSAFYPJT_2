import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
//galio
import { Block, Text, theme } from 'galio-framework';

import { articles, nowTheme } from '../constants/';
import {Card, CombiCard} from '../components/';
const imageHeight = window.width/3;
class SearchResult extends React.Component {

  constructor(props) {
    super(props);
    this.renderCards = this.renderCards.bind(this)
  }

  renderCards = () => {
    const brochuresView = this.props.items;
    let brochuresRow = [];
    let set = [];
    let setCounter = 0;

    for(let i = 0; i < brochuresView.length; i++) {
      set.push(brochuresView[i]);
      if((i + 1) % 2 == 0 || (i + 1) >= brochuresView.length) {
        setCounter++;
        brochuresRow.push(set);
        set = [];
      }
    }
    // console.log(brochuresRow)

    return (
        <View style={[this.props.style, {width:this.props.width}]}>
        {brochuresRow.map((row, i) => (
            <View key={i} style={styles.container}>
              {row.map((brochure, ii) => (
                  <View key={ii} style={styles.items}>
                    <Card
                        style={{marginHorizontal:5}}
                        item={brochure}
                        type={this.props.type}
                    />
                  </View>
              ))}
            </View>
        ))}
        </View>
    );
  };

  render() {
    return (
      <Block flex>
        {this.renderCards()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
  },
  items: {
      // width: 150 // is 50% of container width
    width: "50%" // is 50% of container width
    // flex:1
  },
  title: {
    fontFamily: 'montserrat-bold',
    paddingBottom: theme.SIZES.BASE,
    marginTop: 44,
    color: nowTheme.COLORS.HEADER
  },
  // container: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   flexWrap: 'wrap',
  //   alignItems: 'flex-start' // if you want to fill rows left to right
  // },
  // title: {
  //   fontFamily: 'montserrat-bold',
  //   paddingBottom: theme.SIZES.BASE,
  //   marginTop: 44,
  //   color: nowTheme.COLORS.HEADER
  // },
  // item: {
  //   width: '50%' // is 50% of container width
  // }
});

export default SearchResult;
