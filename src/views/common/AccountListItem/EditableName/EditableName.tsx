import { FC, KeyboardEventHandler, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Tooltip, TooltipContent, TooltipTrigger } from 'components';
import { Edit } from 'components/icons';
import { ACCOUNT_NAME_MAX_LENGTH } from 'config';
import { composeRef } from 'utils/ref';

import styles from './EditableName.module.scss';

export type EditNameProps = {
  name: string;
  onSave(value: string): void;
};

export type EditableNameFormValues = {
  name: string;
};

export const EditableName: FC<EditNameProps> = (props) => {
  const { name, onSave } = props;

  const editInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<EditableNameFormValues>({
    mode: 'onBlur',
    defaultValues: {
      name,
    },
  });

  const [edit, setEdit] = useState(false);

  const handleEditClick = () => {
    setEdit(true);
    setTimeout(() => {
      editInputRef.current?.focus();
    }, 0);
  };

  const handleSubmit = () => {
    setEdit(false);
    const values = form.getValues();
    values.name.length === 0 ? form.setValue('name', name) : onSave(values.name);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLFormElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      form.handleSubmit(handleSubmit)();
    }
  };

  const nameController = (
    <Controller
      name="name"
      control={form.control}
      rules={{
        maxLength: ACCOUNT_NAME_MAX_LENGTH,
      }}
      render={({ field: { ref, onBlur, onChange, value } }) => (
        <input
          className={styles.editInput}
          ref={composeRef(ref, editInputRef)}
          onBlur={onBlur}
          onChange={onChange}
          value={value}
          maxLength={ACCOUNT_NAME_MAX_LENGTH}
        />
      )}
    />
  );

  return (
    <div className={styles.root}>
      {edit ? (
        <form
          onBlur={form.handleSubmit(handleSubmit)}
          onKeyDown={handleKeyDown}
          className={styles.editForm}
        >
          {nameController}
        </form>
      ) : (
        name
      )}
      {!edit && (
        <Tooltip offset={2}>
          <TooltipTrigger className={styles.icon} role="button" onClick={handleEditClick}>
            <Edit width={12} height={12} />
          </TooltipTrigger>
          <TooltipContent>Rename</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};
