import { makeAutoObservable } from 'mobx';

export class LoginPageStore {
  constructor() {
    makeAutoObservable(this);
  }

  importPk: string | undefined;

  setImportPk = (importPk: string) => {
    this.importPk = importPk;
  };

  resetImportPk = () => {
    this.importPk = undefined;
  };
}
