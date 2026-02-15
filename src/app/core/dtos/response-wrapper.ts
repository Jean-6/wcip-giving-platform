export interface ResponseWrapper<T> {

  success:  boolean;
  msg: string | null;
  data: T;
  status : number | null;
  path: string;
}
