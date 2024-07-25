import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { observer } from 'mobx-react-lite';

import { Button, FormItem, Input } from 'components';

import styles from './AddAccount.module.scss';
import { useRootStore } from '../../core';
import { ACCOUNT_NAME_MAX_LENGTH } from '../../config';

export type AddAccountFormValues = {
  name: string;
};

export type AddAccountProps = {
  onSubmitSuccess(): void;
};

export const AddAccount: FC<AddAccountProps> = observer(function AddAccount_(props) {
  const { onSubmitSuccess } = props;

  const rootStore = useRootStore();

  const form = useForm<AddAccountFormValues>({
    reValidateMode: 'onSubmit',
    defaultValues: {
      name: '',
    },
  });

  const nameController = (
    <Controller
      name="name"
      control={form.control}
      rules={{
        required: true,
        minLength: 1,
        maxLength: ACCOUNT_NAME_MAX_LENGTH,
      }}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <Input
          ref={ref}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          legend="Account Name"
          maxLength={ACCOUNT_NAME_MAX_LENGTH}
        />
      )}
    />
  );

  const handleSubmit = () => {
    try {
      const values = form.getValues();
      rootStore.wallet.addAccount(values.name);
      onSubmitSuccess();
    } catch (e) {
      /* empty */
    }
  };

  return (
    <div className={styles.root}>
      <img
        src="assets/images/svg/brain.svg"
        width={120}
        height={96}
        alt="Brain Illustration"
        className={styles.image}
      />
      <form onSubmit={form.handleSubmit(handleSubmit)} className={styles.form}>
        <FormItem
          noIcon
          info="Let it be cool and unique"
          warning={form.formState.errors.name?.message}
        >
          {nameController}
        </FormItem>
        <Button htmlType="submit">Create</Button>
      </form>
    </div>
  );
});
