import { ReactNode } from 'react';

export type StepProps = {
  onSubmit(): void;
};

export type CreateAccountFormValues = {
  name: string;
  password: string;
};

export type CreateAccountRepeatFormValues = {
  password: string;
};

export type CreateAccountStepConfig = {
  title: string;
  back: string | (() => void);
  content: ReactNode;
};
