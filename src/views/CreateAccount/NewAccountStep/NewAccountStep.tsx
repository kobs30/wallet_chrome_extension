import { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Button, Input, PasswordStrengthMeter } from 'components';
import { ACCOUNT_NAME_MAX_LENGTH } from 'config';

import styles from './NewAccountStep.module.scss';
import { CreateAccountFormValues, StepProps } from '../types';

export const NewAccountStep: FC<StepProps> = (props) => {
  const { onSubmit } = props;

  const formContext = useFormContext<CreateAccountFormValues>();

  const nameController = (
    <Controller
      name="name"
      control={formContext.control}
      rules={{ required: true, minLength: 1, maxLength: ACCOUNT_NAME_MAX_LENGTH }}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <Input
          ref={ref}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          legend="Name"
          maxLength={ACCOUNT_NAME_MAX_LENGTH}
        />
      )}
    />
  );

  const passwordController = (
    <Controller
      name="password"
      control={formContext.control}
      rules={{ required: true, minLength: 6 }}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <Input.Password
          ref={ref}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          legend="Password"
        />
      )}
    />
  );

  const watchPassword = formContext.watch('password');

  return (
    <form className={styles.root} onSubmit={formContext.handleSubmit(onSubmit)}>
      <div className={styles.content}>
        {nameController}
        <div>
          {passwordController}
          <PasswordStrengthMeter value={watchPassword} />
        </div>
      </div>
      <Button
        htmlType="submit"
        fullWidth
        disabled={!formContext.formState.isDirty || formContext.formState.isSubmitting}
      >
        Next
      </Button>
    </form>
  );
};
