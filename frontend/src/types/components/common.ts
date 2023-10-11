export enum SnackbarColor {
  OK = 'light-green-lighten-2',
  WARN = 'lime-darken-2',
  ERR = 'red-darken-2',
}

export interface ISnackbar {
  msg: string;
  isVisible: boolean;
  color: SnackbarColor;
}

export type SnackbarParm = Pick<ISnackbar, 'msg'> &
  Partial<Pick<ISnackbar, 'color'>>;

export type ShowSnackbar = (param: SnackbarParm) => void;
