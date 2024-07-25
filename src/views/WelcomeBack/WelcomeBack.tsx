import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { Button, Chip, FormItem, Input } from 'components';
import { truncateAddress } from 'utils/address';
import { useRootStore } from 'core';

import styles from './WelcomeBack.module.scss';

export type WelcomeBackProps = {
  onSubmitSuccess(): void;
};

export type WelcomeBackFormValues = {
  password: string;
};

export const WelcomeBack: FC<WelcomeBackProps> = observer(function WelcomeBack_(props) {
  const { onSubmitSuccess } = props;

  const rootStore = useRootStore();

  const navigate = useNavigate();

  const form = useForm<WelcomeBackFormValues>({
    reValidateMode: 'onSubmit',
    defaultValues: {
      password: '',
    },
  });

  const passwordController = (
    <Controller
      name="password"
      control={form.control}
      rules={{
        required: true,
        validate: (value) => {
          if (!rootStore.vault.validatePassword(value)) return 'Password is invalid';
          return true;
        },
      }}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <Input.Password
          ref={ref}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          legend="Password"
        />
      )}
    />
  );

  const handleSubmit = async () => {
    try {
      const values = form.getValues();
      await rootStore.vault.submitPassword(values.password);
      onSubmitSuccess();
    } catch (e) {
      /* empty */
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.chip}>
        <Chip
          displayGradientBorder
          label={truncateAddress(rootStore.wallet.activeAddress || 'Accounts')}
          onDelete={() => navigate('/reset-cache')}
        />
      </div>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={styles.form}>
        <FormItem warning={form.formState.errors.password?.message}>{passwordController}</FormItem>
        <Button
          htmlType="submit"
          fullWidth
          disabled={!form.formState.isDirty || form.formState.isSubmitting}
        >
          Unlock
        </Button>
      </form>
    </div>
  );
});
