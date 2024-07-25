import { FC, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { observer } from 'mobx-react-lite';

import { CycloneSymbolOutlineColored } from 'components/icons/brand';
import { Button, FormItem, GradientButton, Input, Overlay, Spinner } from 'components';
import { useRootStore } from 'core';

import styles from './GetStarted.module.scss';

export type GetStartedProps = {
  onSubmittingChange(isSubmitting: boolean): void;
  onSubmitSuccess(value: string): void;
};

export type GetStartedFormValues = {
  privateKey: string;
};

export const GetStarted: FC<GetStartedProps> = observer(function GetStarted_(props) {
  const { onSubmittingChange, onSubmitSuccess } = props;

  const rootStore = useRootStore();

  const form = useForm<GetStartedFormValues>({
    reValidateMode: 'onSubmit',
    defaultValues: {
      privateKey: '',
    },
  });

  useEffect(() => {
    onSubmittingChange(form.formState.isSubmitting);
  }, [form.formState.isSubmitting]);

  const watchPrivateKey = form.watch('privateKey');
  const isPrivateKeyEmpty = watchPrivateKey.length === 0;

  const handleSubmit = () => {
    try {
      const values = form.getValues();
      onSubmitSuccess(values.privateKey);
    } catch (e) {
      /* empty */
    }
  };

  const privateKeyController = (
    <Controller
      name="privateKey"
      control={form.control}
      rules={{
        validate: (value) => {
          return rootStore.wallet.verifyPk(value) ? true : 'Key is invalid';
        },
      }}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <Input
          ref={ref}
          value={value}
          onBlur={onBlur}
          onChange={onChange}
          placeholder="Your private Key"
          legend="Import Account"
          allowClear
        />
      )}
    />
  );

  return (
    <div className={styles.root}>
      <Overlay isActive={!isPrivateKeyEmpty}>
        <Link to="/login/new-account">
          <GradientButton isActive>
            <div className={styles.gradientButton}>
              <CycloneSymbolOutlineColored
                width={32}
                height={32}
                className={styles.gradientButtonIcon}
              />
              <div className={styles.gradientButtonText}>
                <span className={styles.gradientButtonTitle}>Create New Wallet</span>
                <span className={styles.gradientButtonDescription}>Use wallet in browser</span>
              </div>
            </div>
          </GradientButton>
        </Link>
      </Overlay>
      <Overlay isActive={form.formState.isSubmitting}>
        <div className={styles.orSeparator}>Or</div>
      </Overlay>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={styles.form}>
        <Overlay isActive={form.formState.isSubmitting}>
          <FormItem
            warning={form.formState.errors.privateKey?.message}
            info="Create new account by importing wallet private key"
          >
            {privateKeyController}
          </FormItem>
        </Overlay>
        <Button htmlType="submit" disabled={isPrivateKeyEmpty} fullWidth>
          {form.formState.isSubmitting ? <Spinner /> : 'Import'}
        </Button>
      </form>
    </div>
  );
});
