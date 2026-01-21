import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import type { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);
interface IRow {
  brand: string;
  model: string;
  value: number;
  electric: boolean;
}
const AgGridTable = () => {
  // Row Data: The data to be displayed.
  const [rowData, setRowData] = useState<IRow[]>([
    { brand: "Tesla", model: "Model Y", value: 64950, electric: true },
    { brand: "Ford", model: "F-Series", value: 33850, electric: false },
    { brand: "Toyota", model: "Corolla", value: 29600, electric: false },
    { brand: "Mercedes", model: "EQA", value: 48890, electric: true },
    { brand: "Fiat", model: "500", value: 15774, electric: false },
    { brand: "Nissan", model: "Juke", value: 20675, electric: false },
  ]);

  const defaultColDef = {
    flex: 1,
  };
const obj={make:"brand",model:"model",price:"value",electric:"electric"}

const cols=Object.keys(obj).map((key)=>({field:key}))
const res=rowData?.map((item,index)=>(
  Object.entries(obj).reduce((acc,val)=>({...acc,[val[0]]:item[val[1]]}),{})
)
)

  // Container: Defines the grid's theme & dimensions.
  return (
    <div className="ag-theme-alpine" style={{ height: "400px", width: "100%" }}>
      <AgGridReact
        rowData={res}
        columnDefs={cols}
        defaultColDef={defaultColDef}
      />
    </div>
  );
};

export default AgGridTable;
