const moneyColumns = new Set(["Amount", "Fee Total", "Discount", "Payable", "Paid", "Balance"]);

function styleHeader(row) {
  row.font = { bold: true, color: { argb: "FFFFFFFF" } };
  row.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF0B2F70" } };
  row.alignment = { vertical: "middle" };
}

function addDataTable(sheet, columns, rows, startRow = 1) {
  const header = sheet.getRow(startRow);
  columns.forEach((column, index) => {
    header.getCell(index + 1).value = column;
    sheet.getColumn(index + 1).width = Math.min(Math.max(column.length + 3, 14), 32);
  });
  styleHeader(header);
  for (const [index, record] of rows.entries()) {
    const row = sheet.getRow(startRow + index + 1);
    columns.forEach((column, columnIndex) => {
      const cell = row.getCell(columnIndex + 1);
      cell.value = record[column] ?? "";
      if (moneyColumns.has(column) && typeof cell.value === "number") {
        cell.numFmt = "#,##0.00;[Red]-#,##0.00";
      }
    });
  }
  sheet.views = [{ state: "frozen", ySplit: startRow }];
  if (columns.length && rows.length) {
    sheet.autoFilter = {
      from: { row: startRow, column: 1 },
      to: { row: startRow + rows.length, column: columns.length },
    };
  }
}

export async function createReportWorkbook({
  report,
  academicYear,
  columns,
  rows,
  detailColumns,
  details,
  filters,
  totals,
}) {
  const { default: ExcelJS } = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "NR Edify English Medium School";
  workbook.subject = `${report} for academic year ${academicYear}`;

  const summary = workbook.addWorksheet("Summary");
  summary.addRow(["NR Edify English Medium School"]);
  summary.getRow(1).font = { bold: true, size: 16, color: { argb: "FF0B2F70" } };
  summary.addRow(["Report", report]);
  summary.addRow(["Academic Year", academicYear]);
  summary.addRow([
    "Filters",
    Object.entries(filters)
      .map(([key, value]) => `${key}: ${value}`)
      .join(" | "),
  ]);
  summary.addRow([
    "Transactions",
    totals.transactions,
    "Students",
    totals.students,
    "Collected",
    totals.collected,
    "Pending",
    totals.pending,
  ]);
  addDataTable(summary, columns, rows, 7);
  summary.getColumn(1).width = Math.max(summary.getColumn(1).width, 22);

  const detailSheet = workbook.addWorksheet("Details");
  detailSheet.addRow([`${report} - complete detail`]);
  detailSheet.getRow(1).font = { bold: true, size: 14, color: { argb: "FF0B2F70" } };
  detailSheet.addRow(["Academic Year", academicYear]);
  detailSheet.addRow([
    "Filters",
    Object.entries(filters)
      .map(([key, value]) => `${key}: ${value}`)
      .join(" | "),
  ]);
  addDataTable(detailSheet, detailColumns, details, 5);

  return workbook.xlsx.writeBuffer();
}

export async function downloadReportWorkbook(options) {
  const buffer = await createReportWorkbook(options);
  const url = URL.createObjectURL(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `${report.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${academicYear}.xlsx`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
