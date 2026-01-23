"use client";
import React from "react";

import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { useRouter } from "next/navigation";

const statusFilters = [
  { label: "Processing", count: 0 },
  { label: "Hold On", count: 0 },
  { label: "Under Review", count: 0 },
  { label: "Complete", count: 2 },
  { label: "Refund", count: 0 },
];

const columns = [
  "Sno.",
  "Order ID",
  "Shopkeeper",
  "Email",
  "Shop Name",
  "Order Amount",
  "Name",
  "Mobile",
  "Status",
  "Action",
];

const page = () => {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          ITR Application Lists
        </h1>
      </div>

      <Card className="py-0">
        <CardContent className="py-6">
          <Button
            className="px-6"
            onClick={() => router.push("/itr-application/add")}
          >
            Add ITR Application
          </Button>
        </CardContent>
      </Card>

      <Card className="py-0">
        <CardContent className="flex flex-wrap gap-3 py-6">
          {statusFilters.map((filter) => (
            <Button
              key={filter.label}
              variant={filter.label === "Complete" ? "default" : "secondary"}
              className="px-5"
            >
              {filter.label} ({filter.count})
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card className="overflow-hidden py-0">
        <div className="flex items-center border-b bg-muted px-6 py-3">
          <span className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            ITR Application
          </span>
        </div>
        <CardContent className="space-y-6 pb-6 pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Label htmlFor="entries">Show</Label>
              <Select defaultValue="10">
                <SelectTrigger id="entries" className="h-9 w-24">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-muted-foreground">entries</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Label htmlFor="search">Search:</Label>
              <Input
                id="search"
                placeholder="Type to search"
                className="h-9 w-60"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column} className="whitespace-nowrap">
                      {column}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="py-10 text-center text-muted-foreground"
                  >
                    No data available in table
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-4 text-sm md:flex-row md:items-center md:justify-between">
            <p className="text-muted-foreground">Showing 0 to 0 of 0 entries</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" disabled>
                Previous
              </Button>
              <Button variant="outline" disabled>
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
