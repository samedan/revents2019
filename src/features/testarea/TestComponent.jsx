// rcc

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { incrementAsync, decrementAsync } from './testActions';
import { Button } from 'semantic-ui-react';
import TestPlaceInput from './TestPlaceInput';
import SimpleMap from './SimpleMap';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { openModal } from '../modals/modalActions';

class TestComponent extends Component {
  state = {
    latlng: {
      lat: 59.95,
      lng: 30.33
    }
  };

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng =>
        this.setState({
          latlng: latLng
        })
      )
      .catch(error => console.error('Error', error));
  };

  render() {
    const {
      data,
      incrementAsync,
      decrementAsync,
      openModal,
      loading,
      buttonName
    } = this.props;

    return (
      <div>
        <div>TestComponent</div>
        <h3>Answer: {data}</h3>
        <Button
          name="increment"
          loading={buttonName === 'increment' && loading}
          onClick={e => incrementAsync(e.target.name)}
          positive
          content="Increase"
        />

        <Button
          name="decrement"
          loading={buttonName === 'decrement' && loading}
          onClick={e => decrementAsync(e.target.name)}
          negative
          content="Decrease"
        />
        <Button
          onClick={() => openModal('TestModal', { data: 42 })}
          color="teal"
          content="Open Modal"
        />
        <br />
        <br />
        <TestPlaceInput selectAddress={this.handleSelect} />
        <SimpleMap key={this.state.latlng.lng} latlng={this.state.latlng} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.test.data,
  loading: state.async.loading,
  buttonName: state.async.elementName
});

const mapDispatchToProps = {
  incrementAsync,
  decrementAsync,
  openModal
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestComponent);
