import { Controller, useForm } from 'react-hook-form';
import { FC } from 'react';
import { observer } from 'mobx-react-lite';

import { Button, FormItem, Input } from 'components';
import { useRootStore } from 'core';

import styles from './ImportAccount.module.scss';

export type ImportAccountFormValues = {
  privateKey: string;
};

export type ImportAccountProps = {
  onSubmitSuccess(): void;
};

export const ImportAccount: FC<ImportAccountProps> = observer(function ImportAccount_(props) {
  const { onSubmitSuccess } = props;

  const rootStore = useRootStore();

  const form = useForm<ImportAccountFormValues>({
    reValidateMode: 'onSubmit',
    defaultValues: {
      privateKey: '',
    },
  });

  const handleSubmit = () => {
    try {
      const values = form.getValues();
      rootStore.wallet.addAccount(
        `Imported Account ${rootStore.wallet.accounts.length + 1}`,
        values.privateKey
      );
      onSubmitSuccess();
    } catch (e) {
      /* empty */
    }
  };

  const privateKeyController = (
    <Controller
      name="privateKey"
      control={form.control}
      rules={{
        required: true,
        validate: (value) => {
          if (!rootStore.wallet.verifyPk(value)) return 'Key is invalid';
          if (rootStore.wallet.findAccountByPk(value))
            return 'You already have an account with this key';
          return true;
        },
      }}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <Input
          ref={ref}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          placeholder="Your private Key"
          legend="Private Key"
          allowClear
        />
      )}
    />
  );

  return (
    <div className={styles.root}>
      <img
        src="assets/images/keys.webp"
        width={92}
        height={74}
        alt="Keys Illustration"
        className={styles.image}
      />
      <form onSubmit={form.handleSubmit(handleSubmit)} className={styles.form}>
        <FormItem warning={form.formState.errors.privateKey?.message}>
          {privateKeyController}
        </FormItem>
        <Button htmlType="submit">Import</Button>
      </form>
    </div>
  );
});
