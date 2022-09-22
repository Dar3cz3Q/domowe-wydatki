import React, { useMemo } from "react";
import { useTable } from "react-table";
import { useNavigate } from "react-router-dom";

export default function CreateTable({ dataToShow, columnsToShow, type }) {
  const columns = useMemo(() => columnsToShow, [columnsToShow]);
  const data = useMemo(() => dataToShow, [dataToShow]);

  const today = new Date();

  const navigate = useNavigate();

  const Table = useTable({
    data,
    columns,
  });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    Table;

  const handleRowClick = (id) => {
    navigate(`/${type}/edit/${id}`);
  };

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          const termin = new Date(row.original.termin);
          return (
            <tr
              {...row.getRowProps()}
              onClick={() => handleRowClick(row.original.id)}
              title="Zmień dane"
              className={
                row.original.oddano === "Nie" && today > termin
                  ? "not_returned"
                  : ""
              }
            >
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
