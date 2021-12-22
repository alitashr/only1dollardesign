import React from 'react';
import styled from 'styled-components';
import {Form} from 'react-bootstrap';

const FormControl = styled(Form.Control)`
    padding: 6px 10px;
    background: #d9d9d9;
    color: #1d1d1d;
    border-radius: 0;
`
const Input = (props) => {
    return (  
  <div className="form-group">
    <FormControl
      className="form-input"
      id={props.name}
      name={props.name}
      type={props.type}
      value={props.value}
      onChange={props.handleChange}
      onSubmit = {props.onSubmit}
      placeholder={props.placeholder} 
      autoComplete = {props.onpaste ?  'off': 'on'}
      onPaste= {props.onpaste ? props.onpaste: null}
      required = {props.required? true: false}
    />
  </div>
)
}

export default Input;
