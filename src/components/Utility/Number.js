import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
numeral.register('locale', 'fr', {
    delimiters: {
        thousands: ' ',
        decimal: ','
    },
    abbreviations: {
        thousand: 'K',
        million: 'M',
        billion: 'B',
        trillion: 'T'
    },
    ordinal : function (number) {
        return number === 1 ? 'er' : 'ème';
    },
    currency: {
        symbol: '€'
    }
});
// switch between locales
numeral.locale('fr');

class Number extends React.Component {
  static propTypes = {
    precision: PropTypes.number,
    value: PropTypes.number.isRequired
  };

  render() {
    let value = this.props.value.toLocaleString();

    return (
      <span>
        {value}
      </span>
    );
  }
}

export default Number;
