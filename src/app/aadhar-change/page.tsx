"use client";
import React, { useMemo, useState } from "react";

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
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import AgGridTable from "@/components/aggrid-table";
import { useSelector } from "react-redux";
import { StoreRootState } from "@/reduxstore/redux-store";

const statusFilters = [
  { label: "Processing" },
  { label: "Hold On" },
  { label: "Under Review" },
  { label: "Complete" },
  { label: "Refund" },
];

const columnMap = {
  Sno: "id",
  "Order ID": "orderId",
  Shopkeeper: "shopkeeper",
  Email: "email",
  "Shop Name": "shopName",
  "Order Amount": "amount",
  Mobile: "mobile",
  Status: "status",
  Action: "action",
} as const;

const mockRows = [
  {
    id: 1,
    orderId: "ADR-1001",
    shopkeeper: "Amit Sharma",
    email: "amit@example.com",
    shopName: "Sunrise Retail",
    amount: 249,
    mobile: "9876543210",
    status: "Processing",
  },
  {
    id: 2,
    orderId: "ADR-1002",
    shopkeeper: "Riya Singh",
    email: "riya@example.com",
    shopName: "Quick Mart",
    amount: 199,
    mobile: "9898989898",
    status: "Complete",
  },
  {
    id: 3,
    orderId: "ADR-1003",
    shopkeeper: "Vikas Jain",
    email: "vikas@example.com",
    shopName: "Jain Store",
    amount: 299,
    mobile: "9123456780",
    status: "Hold On",
  },
  {
    id: 4,
    orderId: "ADR-1004",
    shopkeeper: "Neha Verma",
    email: "neha@example.com",
    shopName: "Verma Traders",
    amount: 349,
    mobile: "9001122334",
    status: "Under Review",
  },
  {
    id: 5,
    orderId: "ADR-1005",
    shopkeeper: "Sahil Khan",
    email: "sahil@example.com",
    shopName: "City Hub",
    amount: 279,
    mobile: "9012345678",
    status: "Refund",
  },
];

const page = () => {
  const navigate = useNavigate();
  const role = useSelector(
    (state: StoreRootState) => state?.data?.userdata?.user?.role,
  );
  const roleValue = typeof role === "string" ? role : role?.value;
  const isAdmin = roleValue === "admin";
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const filteredRows = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return mockRows.filter((row) => {
      const matchesStatus =
        statusFilter === "all" || row.status === statusFilter;

      if (!normalizedSearch) {
        return matchesStatus;
      }

      const matchesSearch = [
        row.orderId,
        row.shopkeeper,
        row.email,
        row.shopName,
        String(row.amount),
        row.mobile,
        row.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [searchTerm, statusFilter]);

  const gridRows = useMemo(
    () =>
      filteredRows.map((row, index) => ({
        ...row,
        id: index + 1,
        action: "View",
      })),
    [filteredRows],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Aadhar Change Lists
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review, search, and manage Aadhar change requests in one place.
          </p>
        </div>
        {!isAdmin && (
          <Button
            className="px-6"
            onClick={() => navigate("/aadhar-change/add")}
          >
            Add Aadhar Change
          </Button>
        )}
      </div>

      <Card className="py-0">
        <CardContent className="grid gap-4 py-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label
              htmlFor="status-search"
              className="text-sm text-muted-foreground"
            >
              Search
            </Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="status-search"
                placeholder="Search application..."
                className="h-10 w-full pl-9"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="status-filter"
              className="text-sm text-muted-foreground"
            >
              Status
            </Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="status-filter" className="h-10 w-full">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statusFilters.map((filter) => (
                  <SelectItem key={filter.label} value={filter.label}>
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden py-0">
        <CardContent className="space-y-6 pb-6 pt-6">
          <AgGridTable rows={gridRows} columnMap={columnMap} pagination />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
