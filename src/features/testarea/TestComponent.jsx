// rcc

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { incrementCounter, decrementCounter } from './testActions';
import { Button } from 'semantic-ui-react';

class TestComponent extends Component {
  render() {
    const { data, incrementCounter, decrementCounter } = this.props;
    return (
      <div>
        <div>TestComponent</div>
        <h3>AAnswer: {data}</h3>
        <Button onClick={incrementCounter} positive content="Increase" />
        <Button onClick={decrementCounter} negative content="Decrease" />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.test.data
});

const mapDispatchToProps = {
  incrementCounter,
  decrementCounter
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestComponent);
