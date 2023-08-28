"use client";

import { Posting } from "@/types/shared";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

type Props = {
  postings: Posting[];
};

function Postings({ postings }: Props) {
  return (
    <Table className="cursor-pointer">
      <TableCaption>My postings and their statuses</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Offers</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {postings.map(({ name, number, offers, status }) => (
          <TableRow key={number}>
            <TableCell>{number}</TableCell>
            <TableCell>{name}</TableCell>
            <TableCell className="font-medium">{status}</TableCell>
            <TableCell className="text-right">{offers}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default Postings;
