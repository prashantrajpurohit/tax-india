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
import { useQuery } from "@tanstack/react-query";

import { RetailerController } from "./controller";

type RetailerUser = {
  id: number;
  serial: number;
  name: string;
  email: string;
  mobile_no: string;
  city: string;
  pan_no: string;
  aadhar_no: string;
  status: string;
};

const statusOptions = ["All", "Active", "Inactive"];

const columnMap = {
  "S No": "serial" as const,
  Name: "name" as const,
  Email: "email" as const,
  "Mobile No": "mobile_no" as const,
  City: "city" as const,
  "PAN No": "pan_no" as const,
  "Aadhaar No": "aadhar_no" as const,
  Status: "status" as const,
};

const Page = () => {
  const controller = useMemo(() => new RetailerController(), []);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const {
    data: retailerUsers = [],
    isLoading,
    isError,
  } = useQuery<RetailerUser[]>({
    queryKey: ["retailer-users"],
    queryFn: async () => {
      const payload = await controller.getActiveRetailerUsers();
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : [];

      return list.map((item: any, index: number) => {
        const statusValue =
          typeof item?.status === "string"
            ? item.status
            : typeof item?.status === "number"
              ? item.status === 1
                ? "Active"
                : "Inactive"
              : item?.is_active || item?.active
                ? "Active"
                : "Inactive";

        return {
          id: item?.id ?? index + 1,
          serial: index + 1,
          name:
            item?.name ??
            item?.full_name ??
            [item?.first_name, item?.last_name].filter(Boolean).join(" ") ??
            "",
          email: item?.email ?? item?.user_email ?? "",
          mobile_no: item?.mobile_no ?? item?.mobile ?? item?.phone ?? "",
          city: item?.city ?? item?.address_city ?? item?.state ?? "",
          pan_no: item?.pan_no ?? "",
          aadhar_no: item?.aadhar_no ?? "",
          status: statusValue,
        };
      });
    },
  });

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
        row.pan_no,
        row.aadhar_no,
        row.status,
      ]
        .join(" ")
        .toLowerCase();
      return matchesStatus && haystack.includes(needle);
    });
  }, [retailerUsers, search, status]);

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
            emptyMessage={
              isLoading
                ? "Loading retailer users..."
                : isError
                  ? "Failed to load retailer users"
                  : "No retailer users found"
            }
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
