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
  Name: "name",
  Mobile: "mobile",
  Status: "status",
  Action: "action",
} as const;

const mockRows = [
  {
    id: 1,
    orderId: "ITR-1001",
    shopkeeper: "Amit Sharma",
    email: "amit@example.com",
    shopName: "Sunrise Retail",
    amount: 1499,
    name: "Amit Sharma",
    mobile: "9876543210",
    status: "Processing",
  },
  {
    id: 2,
    orderId: "ITR-1002",
    shopkeeper: "Riya Singh",
    email: "riya@example.com",
    shopName: "Quick Mart",
    amount: 999,
    name: "Riya Singh",
    mobile: "9898989898",
    status: "Complete",
  },
  {
    id: 3,
    orderId: "ITR-1003",
    shopkeeper: "Vikas Jain",
    email: "vikas@example.com",
    shopName: "Jain Store",
    amount: 1299,
    name: "Vikas Jain",
    mobile: "9123456780",
    status: "Hold On",
  },
  {
    id: 4,
    orderId: "ITR-1004",
    shopkeeper: "Neha Verma",
    email: "neha@example.com",
    shopName: "Verma Traders",
    amount: 1799,
    name: "Neha Verma",
    mobile: "9001122334",
    status: "Under Review",
  },
  {
    id: 5,
    orderId: "ITR-1005",
    shopkeeper: "Sahil Khan",
    email: "sahil@example.com",
    shopName: "City Hub",
    amount: 1599,
    name: "Sahil Khan",
    mobile: "9012345678",
    status: "Refund",
  },
  {
    id: 6,
    orderId: "ITR-1006",
    shopkeeper: "Pooja Mehta",
    email: "pooja@example.com",
    shopName: "Mehta Market",
    amount: 1099,
    name: "Pooja Mehta",
    mobile: "9090909090",
    status: "Processing",
  },
  {
    id: 7,
    orderId: "ITR-1007",
    shopkeeper: "Karan Patel",
    email: "karan@example.com",
    shopName: "Patel Store",
    amount: 1899,
    name: "Karan Patel",
    mobile: "9812345678",
    status: "Complete",
  },
  {
    id: 8,
    orderId: "ITR-1008",
    shopkeeper: "Nisha Roy",
    email: "nisha@example.com",
    shopName: "Roy Retail",
    amount: 1399,
    name: "Nisha Roy",
    mobile: "9876501234",
    status: "Under Review",
  },
  {
    id: 9,
    orderId: "ITR-1009",
    shopkeeper: "Manish Gupta",
    email: "manish@example.com",
    shopName: "Gupta Goods",
    amount: 1199,
    name: "Manish Gupta",
    mobile: "9955443322",
    status: "Processing",
  },
  {
    id: 10,
    orderId: "ITR-1010",
    shopkeeper: "Anjali Rao",
    email: "anjali@example.com",
    shopName: "Rao Mart",
    amount: 1699,
    name: "Anjali Rao",
    mobile: "9009988776",
    status: "Complete",
  },
  {
    id: 11,
    orderId: "ITR-1011",
    shopkeeper: "Rahul Das",
    email: "rahul@example.com",
    shopName: "Das Traders",
    amount: 999,
    name: "Rahul Das",
    mobile: "9666554433",
    status: "Hold On",
  },
  {
    id: 12,
    orderId: "ITR-1012",
    shopkeeper: "Isha Kapoor",
    email: "isha@example.com",
    shopName: "Kapoor Store",
    amount: 1299,
    name: "Isha Kapoor",
    mobile: "9555443311",
    status: "Refund",
  },
];

const page = () => {
  const navigate = useNavigate();
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
        row.name,
        row.mobile,
        row.status,
        String(row.amount),
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
        sno: index + 1,
        action: "View",
      })),
    [filteredRows],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            ITR Application Lists
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review, search, and manage ITR applications in one place.
          </p>
        </div>
        <Button
          className="px-6"
        onClick={() => navigate("/itr-application/add")}
        >
          Add ITR Application
        </Button>
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
          <AgGridTable
            rows={gridRows}
            columnMap={columnMap}
            height="auto"
            pagination
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
