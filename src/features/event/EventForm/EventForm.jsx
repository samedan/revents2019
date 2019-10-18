import React, { Component } from 'react';
import { Segment, Form, Button } from 'semantic-ui-react';

class EventForm extends Component {
  state = {
    title: '',
    date: '',
    city: '',
    venue: '',
    hostedBy: ''
  };

  componentDidMount() {
    if (this.props.selectedEvent !== null) {
      this.setState({
        ...this.props.selectedEvent
      });
    }
  }

  handleFormSubmit = evt => {
    evt.preventDefault();
    if (this.state.id) {
      // updateEvent={this.handleUpdateEvent} from EventDashboard
      this.props.updateEvent(this.state);
    } else {
      this.props.createEvent(this.state);
    }
  };

  handleInputChange = ({ target: { name, value } }) => {
    // evt.target.name
    this.setState({ [name]: value });
  };

  render() {
    const { cancelFormOpen } = this.props;
    const { title, date, city, venue, hostedBy } = this.state;
    return (
      <Segment>
        <Form onSubmit={this.handleFormSubmit} autoComplete="off">
          <Form.Field>
            <label>Event Title</label>
            <input
              name="title"
              placeholder="Event Title"
              value={title}
              onChange={this.handleInputChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Event Date</label>
            <input
              type="date"
              placeholder="Event Date"
              value={date}
              name="date"
              onChange={this.handleInputChange}
            />
          </Form.Field>
          <Form.Field>
            <label>City</label>
            <input
              placeholder="City event is taking place"
              value={city}
              name="city"
              onChange={this.handleInputChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Venue</label>
            <input
              placeholder="Enter the Venue of the event"
              value={venue}
              name="venue"
              onChange={this.handleInputChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Hosted By</label>
            <input
              placeholder="Enter the name of person hosting"
              value={hostedBy}
              name="hostedBy"
              onChange={this.handleInputChange}
            />
          </Form.Field>
          <Button positive type="submit">
            Submit
          </Button>
          <Button type="button" onClick={cancelFormOpen}>
            Cancel
          </Button>
        </Form>
      </Segment>
    );
  }
}

export default EventForm;
