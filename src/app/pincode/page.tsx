"use client";
import React, { useEffect, useState } from "react";

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
import { Search } from "lucide-react";
import AgGridTable from "@/components/aggrid-table";
import httpRequest from "@/config/api/AxiosInterseptor";
import { ApiUrl } from "@/config/api/apiUrls";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const statusFilters = [{ label: "Approved" }, { label: "Pending" }];

const columnMap = {
  "Serial No": "serial",
  Pincode: "pincode",
  Status: "status",
} as const;

type PincodeRow = {
  id: number;
  serial: number;
  pincode: string;
  userName: string;
  role: string;
  email: string;
  mobile: string;
  status: string;
};

const page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pageNumber, setPageNumber] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { data, isLoading, error } = useQuery<{
    rows: PincodeRow[];
    total: number;
  }>({
    queryKey: ["registration-codes", pageNumber, rowsPerPage],
    queryFn: async (): Promise<{ rows: PincodeRow[]; total: number }> => {
      const response = await httpRequest.get(
        `${ApiUrl.REGISTRATION_CODE_URL}/${pageNumber}?per_page=${rowsPerPage}`,
      );
      const payload = response?.data?.data ?? response?.data ?? {};
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.items)
            ? payload.items
            : [];
      const total =
        payload?.total ??
        response?.data?.total ??
        response?.data?.data?.total ??
        list.length;

      const pageItems = list.slice(0, rowsPerPage);
      const rows = pageItems.map((item: any, index: number) => {
        const statusValue =
          typeof item?.status === "number"
            ? item.status === 0
              ? "Approved"
              : "Pending"
            : typeof item?.status === "string"
              ? item.status
              : item?.is_active || item?.active
                ? "Approved"
                : "Pending";

        return {
          id: item?.id ?? index + 1,
          serial: (pageNumber - 1) * rowsPerPage + index + 1,
          pincode: String(
            item?.pincode ??
              item?.pin_code ??
              item?.code ??
              item?.registration_code ??
              item?.register_pin ??
              "",
          ),
          status: statusValue,
        };
      });
      return { rows, total };
    },
  });
  const rows = data?.rows ?? [];
  const totalRows = data?.total ?? rows.length;

  useEffect(() => {
    if (error) {
      toast.error(
        (error as any)?.response?.data?.message || "Failed to load pincodes",
      );
    }
  }, [error]);
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredRows = rows.filter((row) => {
    const matchesStatus =
      statusFilter === "all" || row.status === statusFilter;

    if (!normalizedSearch) {
      return matchesStatus;
    }

    const matchesSearch = [
      row.pincode,
      row.userName,
      row.role,
      row.email,
      row.mobile,
      row.status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedSearch);

    return matchesStatus && matchesSearch;
  });

  const gridRows = filteredRows;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Pincode Lists
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review, search, and manage pincode coverage in one place.
          </p>
        </div>
       
      </div>

      <Card className="py-0">
        <CardContent className="grid gap-4 py-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label
              htmlFor="pincode-search"
              className="text-sm text-muted-foreground"
            >
              Search
            </Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="pincode-search"
                placeholder="Search pincode..."
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
            loading={isLoading}
            pagination={{
              manual: true,
              currentPage: pageNumber,
              rowsPerPage,
              totalRows,
              onPageChange: (nextPage) => setPageNumber(nextPage),
              onRowsPerPageChange: (value) => {
                setRowsPerPage(value);
                setPageNumber(1);
              },
            }}
            emptyMessage="No pincodes found"
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default page
