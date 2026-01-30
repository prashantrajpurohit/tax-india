"use client";
import React, { useEffect, useMemo, useState } from "react";

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
import { useDispatch, useSelector } from "react-redux";
import { StoreRootState } from "@/reduxstore/redux-store";
import { useQuery } from "@tanstack/react-query";
import httpRequest from "@/config/api/AxiosInterseptor";
import { addEditData, addId } from "@/reduxstore/editIDataSlice";

const statusFilters = [
  { label: "Processing" },
  { label: "Hold On" },
  { label: "Under Review" },
  { label: "Complete" },
  { label: "Refund" },
];

const statusMap: Record<string, number> = {
  Processing: 1,
  "Hold On": 2,
  "Under Review": 3,
  Complete: 4,
  Refund: 5,
};

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

  type PanRow = {
    id: number;
    serial: number;
    orderId: string;
    shopkeeper: string;
  email: string;
  shopName: string;
  amount: number | string;
  name: string;
    mobile: string;
    status: string;
    action: string;
    __raw?: any;
  };

const page = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const role = useSelector(
    (state: StoreRootState) => state?.data?.userdata?.user?.role,
  );
  const roleValue = typeof role === "string" ? role : role?.value;
  const isAdmin = roleValue === "admin";
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pageNumber, setPageNumber] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    setPageNumber(1);
  }, [statusFilter]);

  const statusParam =
    statusFilter === "all" ? 1 : statusMap[statusFilter] ?? 1;

  const {
    data: panData,
    isLoading,
    isError,
  } = useQuery<{ rows: PanRow[]; total: number }>({
    queryKey: ["pancard-list", statusParam, pageNumber],
    queryFn: async () => {
      const response = await httpRequest.get(
        `https://dyementor.com/main/api/pancard_list/${statusParam}/${pageNumber}`,
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

      const rows = list.map((item: any, index: number) => {
        const statusValue =
          typeof item?.status === "string"
            ? item.status
            : typeof item?.status === "number"
              ? statusFilters[item.status - 1]?.label ?? "Processing"
              : "Processing";

        return {
          id: item?.id ?? index + 1,
          serial: (pageNumber - 1) * rowsPerPage + index + 1,
          orderId:
            item?.order_id ??
            item?.ref_id ??
            item?.orderId ??
            `PAN-${(pageNumber - 1) * rowsPerPage + index + 1}`,
          shopkeeper:
            item?.shopkeeper ??
            item?.retailer_name ??
            item?.user_name ??
            item?.created_by ??
            "",
          email: item?.email ?? item?.customeremail ?? "",
          shopName: item?.shop_name ?? item?.shopName ?? "",
          amount: item?.order_amount ?? item?.amount ?? item?.total ?? 0,
          name:
            item?.customername ??
            item?.name ??
            item?.full_name ??
            [item?.first_name, item?.last_name].filter(Boolean).join(" ") ??
            "",
          mobile:
            item?.mobile ??
            item?.mobno ??
            item?.mobile_no ??
            item?.phone ??
            "",
          status: statusValue,
          action: "View",
          __raw: item,
        };
      });

      return { rows, total };
    },
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return (panData?.rows ?? []).filter((row) => {
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
  }, [panData?.rows, searchTerm, statusFilter]);

  const gridRows = filteredRows;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Pan Card Lists
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review, search, and manage PAN applications in one place.
          </p>
        </div>
        {!isAdmin && (
          <Button
            className="px-6"
            onClick={() => navigate("/pan-application/add")}
          >
            Add Pan Card
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
          <AgGridTable
            rows={gridRows}
            columnMap={columnMap}
            loading={isLoading}
            actionColumn="Action"
            onActionClick={(row) => {
              const raw = (row as any)?.__raw ?? row;
              const targetId =
                raw?.id ??
                raw?.ref_id ??
                raw?.order_id ??
                raw?.orderId;
              dispatch(addEditData(raw));
              dispatch(addId(targetId ? String(targetId) : null));
              if (targetId) {
                navigate(`/pan-application/add?id=${encodeURIComponent(String(targetId))}`);
              }
            }}
            pagination={{
              manual: true,
              currentPage: pageNumber,
              rowsPerPage,
              totalRows: panData?.total ?? gridRows.length,
              onPageChange: (nextPage) => setPageNumber(nextPage),
            }}
            emptyMessage={
              isLoading
                ? "Loading pan applications..."
                : isError
                  ? "Failed to load pan applications"
                  : "No pan applications found"
            }
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
