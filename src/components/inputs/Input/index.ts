import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { InputRef } from 'rc-input';

import { Input as InternalInput, InputProps } from './Input';
import { Password } from './Password';

export { InputSize } from './Input';

type CompoundedComponent = ForwardRefExoticComponent<InputProps & RefAttributes<InputRef>> & {
  Password: typeof Password;
};

export const Input = InternalInput as CompoundedComponent;

Input.Password = Password;
