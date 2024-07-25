import { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { observer } from 'mobx-react-lite';

import { Button, FormItem, Input, Overlay } from 'components';
import { CycloneLogoWhite } from 'components/icons/brand';
import { Globe } from 'components/icons';
import { useRootStore } from 'core';

import styles from './NetworkGateway.module.scss';
import { GwRadio } from './GwRadio/GwRadio';

export type NetworkGatewayFormValues = {
  gw: string;
  customNetwork: boolean;
};

export const NetworkGateway: FC = observer(function NetworkGateway_() {
  const rootStore = useRootStore();

  const getDefaultValues = () => ({
    gw: rootStore.network.isDefaultNetwork ? '' : rootStore.network.network,
    customNetwork: !rootStore.network.isDefaultNetwork,
  });

  const form = useForm<NetworkGatewayFormValues>({
    reValidateMode: 'onSubmit',
    defaultValues: getDefaultValues(),
  });

  const watchCustomNetwork = form.watch('customNetwork');

  const gwController = (
    <Controller
      name="gw"
      control={form.control}
      rules={{
        required: watchCustomNetwork,
        validate: watchCustomNetwork
          ? () => {
              return true;
            }
          : undefined,
      }}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <Input
          ref={ref}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          legend="IP Port or Domain"
          disabled={!watchCustomNetwork}
        />
      )}
    />
  );

  const handleSubmit = () => {
    const values = form.getValues();
    try {
      rootStore.resetTokens();
      if (values.customNetwork) {
        return rootStore.network.setNetwork(values.gw);
      }
      rootStore.network.resetNetwork();
    } catch (e) {
      /* empty */
    } finally {
      form.reset(getDefaultValues());
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className={styles.root}>
      <div>
        <div>
          <GwRadio
            title="Default"
            description="Cyclonchain.com"
            icon={<CycloneLogoWhite />}
            isActive={!watchCustomNetwork}
            onClick={() => form.setValue('customNetwork', false, { shouldDirty: true })}
          />
          <GwRadio
            title="Custom Network"
            description="Your own chain"
            icon={<Globe />}
            isActive={watchCustomNetwork}
            onClick={() => form.setValue('customNetwork', true, { shouldDirty: true })}
          />
        </div>
        <Overlay isActive={!watchCustomNetwork}>
          <div className={styles.input}>
            <FormItem warning={form.formState.errors.gw?.message}>{gwController}</FormItem>
          </div>
        </Overlay>
      </div>
      <div className={styles.button}>
        <Button
          htmlType="submit"
          disabled={form.formState.isSubmitting || !form.formState.isDirty}
          fullWidth
        >
          Confirm
        </Button>
      </div>
    </form>
  );
});
