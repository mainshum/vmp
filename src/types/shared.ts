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
  [P in keyof T]: null extends T[P] ? T[P] | undefined : T[P];
};

export type Noop = () => void;

export type UDef<T> = {
  [P in keyof T]?: T[P] | undefined | string | "";
};

// eslint-disable-next-line no-unused-vars
export type Action<T> = (arg: T) => void;

export type Children = React.ReactNode;
