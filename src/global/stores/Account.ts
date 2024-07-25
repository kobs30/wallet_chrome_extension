import { makeAutoObservable } from 'mobx';

import * as t from 'global/types';

export class Account implements t.Account {
  constructor(public name: string, public address: string, public pk: string) {
    makeAutoObservable(this);
  }

  setName = (name: string) => {
    this.name = name;
  };
}
