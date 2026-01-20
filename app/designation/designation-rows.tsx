"use client"
import StatusChips from '@/components/reusableComponents/status-chips'
import { TableCell, TableRow } from '@/ui/table'
import { Pencil } from 'lucide-react'
import React from 'react'
interface itemData {
    row: any,
    indexNumber: number,
    specialEvent?: any
}
const DesignationRows = ({ row, indexNumber, specialEvent }: itemData) => {

    const captureData = (singleData: any) => {
        if (specialEvent) {
            specialEvent(singleData)
        }
    }

    return (
        <TableRow>
            <TableCell align='center'>{indexNumber + 1}</TableCell>
            <TableCell align='center' style={{ textTransform: "capitalize" }}>{row?.name}</TableCell>
            <TableCell align='center'><StatusChips status={row?.is_active} /></TableCell>
            <TableCell align='center'><Pencil style={{cursor:"pointer"}} className="w-4 h-4 " onClick={() =>captureData(row)} /></TableCell>
        </TableRow>
    )
}

export default DesignationRows