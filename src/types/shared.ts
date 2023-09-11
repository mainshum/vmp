export type PostingStatus = "new" | "active" | "on hold" | "fulfilled";

export type Posting = {
  status: PostingStatus;
  name: string;
  number: string;
  offers: number;
};

export type Nullalble<T> = T | null;

export type Noop = () => void;
