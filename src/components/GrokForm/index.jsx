import React, { useState } from "react";
import { Segment, Form, Header, Message } from "semantic-ui-react";

import { chain } from "../../forms/validation";


const GrokForm = () => {
  /**
   * Form is backed by a model stored in the component's state.
   * 
   * The model represents the user's input, which is free to be invalid.
   */
  const [model, setModel] = useState({
    ticketNumber: "",
  });

  /**
   * Validation errors for each form input.
   * 
   * When a field is valid, the error will be `false`.
   * 
   * Note that all fields are considered valid in initial state.
   */
  const [errors, setErrors] = useState({
    ticketNumber: false,
  });

  const [touched, setTouched] = useState({
    ticketNumber: false,
  });

  /**
   * Fields that must be filled in for the form to be submitted.
   */
  const requireFields = ["ticketNumber"];

  /**
   * Checks whether all model fields are considered valid.
   * @returns `true` when all error fields are `false`.
   */
  const allFieldsValid = () => Object
    .keys(errors)
    .map(key => errors[key])
    .every(errorMessage => !errorMessage);

  /**
   * Checks the model whether all the fields marked as
   * required have a value entered.
   * @returns `true` when required fields are occupied, `false` when they're vacant.
   */
  const requiredFieldsFilled = () => requireFields
    .map(key => !!model[key])
    .every(isOccupied => isOccupied);

  const isValid = requiredFieldsFilled() && allFieldsValid();

  /**
   * Validate whether the input is a whole number.
   * @param  {object} data       All props and a proposed value
   * @param  {string} data.name  Input field and model property name.
   * @param  {string} data.value Proposed value from user input.
   * @return {boolean}           `true` when valid, `false` when invalid.
   */
  const checkInteger = ({ name, value }) => {
    if (/^[0-9]*$/.test(value)) {
      setErrors({ ...errors, [name]: false });
      return true;
    } else {
      setErrors({ ...errors, [name]: "Field must be a whole number" });
      return false;
    }
  };

  const checkMinChars = (minChars) => ({ name, value }) => {
    if (value.length >= minChars) {
      setErrors({ ...errors, [name]: false });
      return true;
    } else {
      setErrors({ ...errors, [name]: `Field must be longer than ${minChars} characters` });
      return false;
    }
  };

  /**
   * Validate that the input has been filled.
   * @param  {object} data       All props and a proposed value
   * @param  {string} data.name  Input field and model property name.
   * @param  {string} data.value Proposed value from user input.
   * @return {boolean}           `true` when valid, `false` when invalid.
   */
  const checkRequired = ({ name, value }) => {
    if (value) {
      setErrors({ ...errors, [name]: false });
      return true;
    } else {
      setErrors({ ...errors, [name]: "Field is required" });
      return false;
    }
  }

  /**
   * Store the input's new value to the form's model.
   * @param  {object} data       All props and a proposed value
   * @param  {string} data.name  Input field and model property name.
   * @param  {string} data.value Proposed value from user input.
   */
  const handleChange = ({ name, value }) => {
    setModel({ ...model, [name]: value });

    // Ensure that when a model property changes,
    // the form is flagged as touched.
    setTouched({ ...touched, [name]: true });
  };

  return (
    <Segment>
      <Header>Grok Form</Header>
      <Form error={!isValid}>
        <Form.Field>
          <Form.Input
            required
            name="ticketNumber"
            label="Ticket Number"
            value={model.ticketNumber}
            error={errors.ticketNumber}
            onChange={(_, data) => {
              handleChange(data);
              chain(data)
                .check(checkInteger)
                .check(checkMinChars(3))
                .check(checkRequired)
                .validate();
            }}
          />
        </Form.Field>
        <Message error>All required fields must be entered</Message>
        <Form.Button primary disabled={!isValid}>Submit</Form.Button>
      </Form>
    </Segment>
  );
};

export default GrokForm;
