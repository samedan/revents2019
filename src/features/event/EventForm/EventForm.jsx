/*global google*/
import React, { Component } from 'react';
import { Segment, Form, Button, Grid, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { createEvent, updateEvent, cancelToggle } from '../eventActions';

import { reduxForm, Field } from 'redux-form';
import TextInput from '../../../app/common/form/TextInput';
import TextArea from '../../../app/common/form/TextArea';
import SelectInput from '../../../app/common/form/SelectInput';
import DateInput from '../../../app/common/form/DateInput';
import PlaceInput from '../../../app/common/form/PlaceInput';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import {
  composeValidators,
  combineValidators,
  isRequired,
  hasLengthGreaterThan
} from 'revalidate';
import { withFirestore } from 'react-redux-firebase';

const category = [
  { key: 'drinks', text: 'Drinks', value: 'drinks' },
  { key: 'culture', text: 'Culture', value: 'culture' },
  { key: 'film', text: 'Film', value: 'film' },
  { key: 'food', text: 'Food', value: 'food' },
  { key: 'music', text: 'Music', value: 'music' },
  { key: 'travel', text: 'Travel', value: 'travel' }
];

const validate = combineValidators({
  title: isRequired({ message: 'The event title is required' }),
  category: isRequired({ message: 'The category is required' }),
  description: composeValidators(
    isRequired({ message: 'Please enter a description' }),
    hasLengthGreaterThan(4)({
      message: 'Description needs to be at least 5 characters'
    })
  )(),
  city: isRequired('city'),
  venue: isRequired('venue'),
  date: isRequired('date')
});

class EventForm extends Component {
  state = {
    cityLatLng: {},
    venueLatLng: {}
  };

  async componentDidMount() {
    const { firestore, match } = this.props;
    await firestore.setListener(`events/${match.params.id}`);
  }

  async componentWillUnmount() {
    const { firestore, match } = this.props;
    await firestore.unsetListener(`events/${match.params.id}`);
  }

  onFormSubmit = async values => {
    values.venueLatLng = this.state.venueLatLng;
    try {
      if (this.props.initialValues.id) {
        // check if venueLatLng is 'empty', it's {} in the DBB
        if (Object.keys(values.venueLatLng).length === 0) {
          values.venueLatLng = this.props.event.venueLatLng;
        }
        this.props.updateEvent(values);
        this.props.history.push(`/events/${this.props.initialValues.id}`);
      } else {
        let createdEvent = await this.props.createEvent(values);
        console.log(createdEvent);
        this.props.history.push(`/events/${createdEvent.id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleCitySelect = selectedCity => {
    geocodeByAddress(selectedCity)
      .then(results => getLatLng(results[0]))
      .then(latlng => {
        this.setState({
          cityLatLng: latlng
        });
      })
      .then(() => {
        this.props.change('city', selectedCity);
      });
  };

  handleVenueSelect = selectedVenue => {
    geocodeByAddress(selectedVenue)
      .then(results => getLatLng(results[0]))
      .then(latlng => {
        this.setState({
          venueLatLng: latlng
        });
      })
      .then(() => {
        this.props.change('venue', selectedVenue);
      });
  };

  render() {
    const {
      history,
      initialValues,
      invalid,
      submitting,
      pristine,
      event,
      cancelToggle
    } = this.props;
    return (
      <Grid.Column width={10}>
        <Segment>
          <Header sub color="teal" content="Event Details" />
          <Form
            onSubmit={this.props.handleSubmit(this.onFormSubmit)}
            autoComplete="off"
          >
            <Field
              name="title"
              component={TextInput}
              placeholder="Event name"
            />
            <Field
              name="category"
              type="text"
              component={SelectInput}
              // declared as an Array below
              options={category}
              // multiple={true}
              placeholder="What is it about"
            />
            <Field
              name="description"
              component={TextArea}
              rows={3}
              placeholder="Tell us about your event"
            />
            <Header sub color="teal" content="Event Location Details" />
            <Field
              name="city"
              component={PlaceInput}
              options={{ types: ['(cities)'] }}
              onSelect={this.handleCitySelect}
              placeholder="Event city"
            />
            <Field
              name="venue"
              component={PlaceInput}
              options={{
                location: new google.maps.LatLng(this.state.cityLatLng),
                radius: 1000,
                types: ['establishment']
              }}
              onSelect={this.handleVenueSelect}
              placeholder="Event venue"
            />
            <Field
              name="date"
              component={DateInput}
              placeholder="Event date"
              dateFormat="dd LLL yyyy h:mm a"
              showTimeSelect
              timeFormat="HH:mm"
            />

            <Button
              positive
              type="submit"
              disabled={invalid || submitting || pristine}
            >
              Submit
            </Button>
            <Button
              type="button"
              onClick={
                initialValues.id
                  ? () => history.push(`/events/${initialValues.id}`)
                  : () => history.push('/events')
              }
            >
              Cancel
            </Button>
            <Button
              type="button"
              color={event.cancelled ? 'green' : 'red'}
              floated="right"
              content={event.cancelled ? 'Reactivate event' : 'Cancel event'}
              onClick={() => cancelToggle(!event.cancelled, event.id)}
            />
          </Form>
        </Segment>
      </Grid.Column>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const eventId = ownProps.match.params.id;
  let event = {};

  if (
    state.firestore.ordered.events &&
    state.firestore.ordered.events.length > 0
  ) {
    event =
      state.firestore.ordered.events.filter(event => event.id === eventId)[0] ||
      {};
  }

  return { initialValues: event, event };
};

const mapDispatchToProps = {
  createEvent,
  updateEvent,
  cancelToggle
};

export default withFirestore(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    reduxForm({ form: 'eventForm', validate, enableReinitialize: true })(
      EventForm
    )
  )
);
