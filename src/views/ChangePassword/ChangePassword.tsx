import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { observer } from 'mobx-react-lite';

import { Button, FormItem, Input } from 'components';
import { useRootStore } from 'core';

import styles from './ChangePassword.module.scss';

export type ChangePasswordFormValues = {
  oldPassword: string;
  newPassword: string;
  repeatNewPassword: string;
};

export type ChangePasswordProps = {
  onSubmitSuccess(): void;
};

export const ChangePassword: FC<ChangePasswordProps> = observer(function ChangePassword_(props) {
  const { onSubmitSuccess } = props;

  const rootStore = useRootStore();

  const form = useForm<ChangePasswordFormValues>({
    reValidateMode: 'onSubmit',
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      repeatNewPassword: '',
    },
  });

  const watchNewPassword = form.watch('newPassword');

  const oldPasswordController = (
    <Controller
      name="oldPassword"
      control={form.control}
      rules={{
        required: true,
        validate: (value) => {
          if (!rootStore.vault.validatePassword(value)) return 'Current Password is invalid';
          return true;
        },
      }}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <Input.Password
          ref={ref}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          legend="Current Password"
        />
      )}
    />
  );

  const newPasswordController = (
    <Controller
      name="newPassword"
      control={form.control}
      rules={{
        required: true,
        minLength: 6,
      }}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <Input.Password
          ref={ref}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          legend="New Password"
        />
      )}
    />
  );

  const repeatNewPasswordController = (
    <Controller
      name="repeatNewPassword"
      control={form.control}
      rules={{
        required: true,
        validate: (value) => {
          if (value !== watchNewPassword) return 'Invalid Repeat';
          return true;
        },
      }}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <Input.Password
          ref={ref}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          legend="Confirm New Password"
        />
      )}
    />
  );

  const errorText =
    form.formState.errors.oldPassword?.message ||
    form.formState.errors.newPassword?.message ||
    form.formState.errors.repeatNewPassword?.message ||
    'Don’t share your password with anyone. \n' +
      'You can’t recovery your password if you lose it!';

  const handleSubmit = async () => {
    try {
      const values = form.getValues();
      rootStore.vault.removeAccounts();
      await rootStore.vault.submitPassword(values.repeatNewPassword);
      rootStore.vault.syncAccounts();
      onSubmitSuccess();
    } catch (e) {
      /* empty */
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className={styles.root}>
      <FormItem warning={errorText}>
        <div className={styles.inputs}>
          {oldPasswordController}
          {newPasswordController}
          {repeatNewPasswordController}
        </div>
      </FormItem>
      <Button htmlType="submit" fullWidth>
        Save Password
      </Button>
    </form>
  );
});
