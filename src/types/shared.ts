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

export type Noop = () => void;

export type UDef<T> = {
  [P in keyof T]?: T[P] | undefined | string | "";
};
