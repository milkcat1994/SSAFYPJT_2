import React from 'react';
import { StyleSheet, View } from 'react-native';
//galio
import { Block, theme } from 'galio-framework';

import nowTheme from '../constants/Theme';
import TwoImgCard from '../components/TwoImgCard';
const imageHeight = window.width / 3;
class DiseaseSearchResult extends React.Component {
  constructor(props) {
    super(props);
    this.renderCards = this.renderCards.bind(this);
  }

  renderCards = () => {
    const brochuresView = this.props.items;
    let brochuresRow = [];
    let set = [];
    let setCounter = 0;

    for (let i = 0; i < brochuresView.length; i++) {
      set.push(brochuresView[i]);
      if ((i + 1) % 2 == 0 || i + 1 >= brochuresView.length) {
        setCounter++;
        brochuresRow.push(set);
        set = [];
      }
    }
    // console.log(brochuresRow)

    return (
      <View style={[this.props.style, { width: this.props.width }]}>
        {brochuresRow.map((row, i) => (
          <View key={i} style={styles.container}>
            {row.map((brochure, ii) => (
              <View key={ii} style={styles.items}>
                <TwoImgCard
                  style={{ marginHorizontal: 5 }}
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
    return <Block flex>{this.renderCards()}</Block>;
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
  },
  items: {
    width: '50%', // is 50% of container width
  },
  title: {
    fontFamily: 'montserrat-bold',
    paddingBottom: theme.SIZES.BASE,
    marginTop: 44,
    color: nowTheme.COLORS.HEADER,
  },
});

export default DiseaseSearchResult;
