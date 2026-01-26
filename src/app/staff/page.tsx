"use client";

import AgGridTable from "@/components/aggrid-table";
import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

type Staff = {
  id: number;
  name: string;
  shop_name: string;
  mobile_no: string;
  address: string;
  status: string;
};

// Dummy data for demonstration
const staffData: Staff[] = [
  {
    id: 1,
    name: "Rahul Sharma",
    shop_name: "Sharma Tax Services",
    mobile_no: "9876543210",
    address: "123, MG Road, Delhi",
    status: "Active",
  },
  {
    id: 2,
    name: "Priya Patel",
    shop_name: "Patel & Associates",
    mobile_no: "9123456780",
    address: "456, Ring Road, Mumbai",
    status: "Active",
  },
  {
    id: 3,
    name: "Amit Kumar",
    shop_name: "Kumar Tax Consultants",
    mobile_no: "9988776655",
    address: "789, Civil Lines, Jaipur",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Sneha Reddy",
    shop_name: "Reddy Financial Services",
    mobile_no: "9654321098",
    address: "321, Banjara Hills, Hyderabad",
    status: "Active",
  },
  {
    id: 5,
    name: "Vikram Singh",
    shop_name: "Singh Tax Hub",
    mobile_no: "9012345678",
    address: "654, Sector 15, Chandigarh",
    status: "Inactive",
  },
];

const columnMap = {
  "S No": "id" as const,
  Name: "name" as const,
  "Shop Name": "shop_name" as const,
  "Mobile No": "mobile_no" as const,
  Address: "address" as const,
  Status: "status" as const,
};

function Page() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Staff List</h1>
        <Button asChild variant="destructive">
          <Link to="/staff/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Staff
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <AgGridTable<Staff>
            rows={staffData}
            columnMap={columnMap}
            pagination
            emptyMessage="No staff found"
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default Page;
