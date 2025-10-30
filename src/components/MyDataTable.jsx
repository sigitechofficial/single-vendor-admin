import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export default function MyDataTable(props) {
  return (
    <div className="mt-8">
      <DataTable
        value={props.data}
        scrollable
        stripedRows
        showGridlines
        paginator
        rows={10}
        rowsPerPageOptions={[10, 25, 50, 100]}
        emptyMessage="No Data Available"
      >
        {props?.columns?.map((col, ind) => (
          <Column
            key={ind}
            field={col.field}
            header={col.header}
            sortable={true}
            style={{ minWidth: "14rem" }}
          />
        ))}
      </DataTable>
    </div>
  );
}
