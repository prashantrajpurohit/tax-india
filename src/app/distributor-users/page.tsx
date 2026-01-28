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

type DistributorUser = {
  id: number;
  name: string;
  shop_name: string;
  mobile_no: string;
  address: string;
  status: string;
  action: string;
};

const distributorUsers: DistributorUser[] = [
  {
    id: 1,
    name: "ONKAR SINGH",
    shop_name: "TEST",
    mobile_no: "9988890687",
    address: "HOUSE NO-E-10/7951, ST NO-1, BAHADURKE ROAD NEW DH",
    status: "Approved",
    action: "View / Pricelist / Pending / Retailers",
  },
  {
    id: 2,
    name: "Soman Rawat",
    shop_name: "BI",
    mobile_no: "01234567899",
    address: "Sunder Nagar, Mundian Kalan.",
    status: "Pending",
    action: "View / Pricelist / Approved / Retailers",
  },
  {
    id: 3,
    name: "Happy",
    shop_name: "Web Master",
    mobile_no: "9874563213",
    address: "Mundian Kalan",
    status: "Approved",
    action: "View / Pricelist / Pending / Retailers",
  },
  {
    id: 4,
    name: "KULDEEP SINGH",
    shop_name: "SHOP PRINT HUB",
    mobile_no: "8288871687",
    address: "H.NO.59 HAIDER ENCLAVE PART 1 VILLAGE LADIAN KALAN NEAR HUSSIANPURA",
    status: "Approved",
    action: "View / Pricelist / Pending / Retailers",
  },
];

const statusOptions = ["All", "Approved", "Pending"];

const columnMap = {
  "S No": "id" as const,
  "Distributor Name": "name" as const,
  "Shop Name": "shop_name" as const,
  "Mobile Number": "mobile_no" as const,
  Address: "address" as const,
  Status: "status" as const,
  Action: "action" as const,
};

const Page = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filteredRows = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return distributorUsers.filter((row) => {
      const matchesStatus =
        status === "All" || row.status.toLowerCase() === status.toLowerCase();
      if (!needle) {
        return matchesStatus;
      }
      const haystack = [
        row.name,
        row.shop_name,
        row.mobile_no,
        row.address,
        row.status,
        row.action,
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
          <h1 className="text-2xl font-semibold">Distributor Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review distributor profiles, track status, and manage approvals.
          </p>
        </div>
        <Button asChild className="px-6">
          <Link to="/distributor-users/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Distributor User
          </Link>
        </Button>
      </div>

      <Card className="py-0">
        <CardContent className="grid gap-4 py-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label
              htmlFor="distributor-search"
              className="text-sm text-muted-foreground"
            >
              Search
            </Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="distributor-search"
                placeholder="Search application..."
                className="h-10 w-full pl-9"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="distributor-status"
              className="text-sm text-muted-foreground"
            >
              Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="distributor-status" className="h-10 w-full">
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
          <AgGridTable<DistributorUser>
            rows={filteredRows}
            columnMap={columnMap}
            pagination
            emptyMessage="No distributor users found"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
