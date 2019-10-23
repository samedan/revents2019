// rafc
import React from 'react';
import { Form, Label } from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateInput = ({
  input: { value, onChange, onBlur },
  width,
  placeholder,
  meta: { touched, error },
  ...rest
}) => {
  return (
    <Form.Field error={touched && !!error}>
      <DatePicker
        {...rest}
        placeholderText={placeholder}
        selected={
          value
            ? // check to see if a date is Date or a firestore timestamp
              Object.prototype.toString.call(value) !== '[object Date]'
              ? value.toDate()
              : value
            : null
        }
        onChange={onChange}
        // val is 'date' as a 'Date'
        onBlur={(e, val) => onBlur(val)}
        // when user types into field
        onChangeRaw={e => e.preventDefault()}
      />
      {touched && error && (
        <Label basic color="red">
          {error}
        </Label>
      )}
    </Form.Field>
  );
};

export default DateInput;
