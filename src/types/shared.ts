export type PostingStatus = "new" | "active" | "on hold" | "fulfilled";

export type Posting = {
  status: PostingStatus;
  name: string;
  number: string;
  offers: number;
};

export type Nullalble<T> = T | null;

export type NullableFields<T> = {
  [P in keyof T]: Nullalble<T[P]>;
};

export type FormPrep<T> = {
  [P in keyof T]: Exclude<T[P], null> | "";
};

export type Noop = () => void;

export type UDef<T> = {
  [P in keyof T]?: T[P] | undefined | string | "";
};

export type Action<T> = (arg: T) => void;
