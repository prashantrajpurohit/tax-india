"use client";

import AgGridTable from "@/components/aggrid-table";
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
import { Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

type RetailerUser = {
  id: number;
  name: string;
  email: string;
  mobile_no: string;
  city: string;
  status: string;
};

const retailerUsers: RetailerUser[] = [
  {
    id: 1,
    name: "Amit Verma",
    email: "amit.verma@example.com",
    mobile_no: "9876543210",
    city: "Delhi",
    status: "Active",
  },
  {
    id: 2,
    name: "Priya Nair",
    email: "priya.nair@example.com",
    mobile_no: "9123456780",
    city: "Mumbai",
    status: "Active",
  },
  {
    id: 3,
    name: "Rohit Das",
    email: "rohit.das@example.com",
    mobile_no: "9988776655",
    city: "Kolkata",
    status: "Inactive",
  },
];

const statusOptions = ["All", "Active", "Inactive"];

const columnMap = {
  "S No": "id" as const,
  Name: "name" as const,
  Email: "email" as const,
  "Mobile No": "mobile_no" as const,
  City: "city" as const,
  Status: "status" as const,
};

const Page = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filteredRows = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return retailerUsers.filter((row) => {
      const matchesStatus =
        status === "All" || row.status.toLowerCase() === status.toLowerCase();
      if (!needle) {
        return matchesStatus;
      }
      const haystack = [
        row.name,
        row.email,
        row.mobile_no,
        row.city,
        row.status,
      ]
        .join(" ")
        .toLowerCase();
      return matchesStatus && haystack.includes(needle);
    });
  }, [search, status]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Retailer Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track retailer accounts, verify details, and manage access.
          </p>
        </div>
        <Button asChild className="px-6">
          <Link to="/retailer-users/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Retailer User
          </Link>
        </Button>
      </div>

      <Card className="py-0">
        <CardContent className="grid gap-4 py-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label
              htmlFor="retailer-search"
              className="text-sm text-muted-foreground"
            >
              Search
            </Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="retailer-search"
                placeholder="Search application..."
                className="h-10 w-full pl-9"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="retailer-status"
              className="text-sm text-muted-foreground"
            >
              Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="retailer-status" className="h-10 w-full">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden py-0">
        <CardContent className="space-y-6 pb-6 pt-6">
          <AgGridTable<RetailerUser>
            rows={filteredRows}
            columnMap={columnMap}
            pagination
            emptyMessage="No retailer users found"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
