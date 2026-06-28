function escapeCsv(value) {
  const stringValue = String(value ?? "");
  if (!/[",\n]/.test(stringValue)) {
    return stringValue;
  }
  return `"${stringValue.replaceAll('"', '""')}"`;
}

function downloadBlob(filename, type, content) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function escapePdfText(value) {
  return String(value).replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}

function makeSimplePdf(lines) {
  const text = lines
    .map((line, index) => {
      const size = index === 0 ? 18 : 12;
      const y = 760 - index * 24;
      return `BT /F1 ${size} Tf 72 ${y} Td (${escapePdfText(line)}) Tj ET`;
    })
    .join("\n");
  const stream = `${text}\n`;
  const encoder = new TextEncoder();
  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n",
    "4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    `5 0 obj\n<< /Length ${encoder.encode(stream).length} >>\nstream\n${stream}endstream\nendobj\n`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const object of objects) {
    offsets.push(encoder.encode(pdf).length);
    pdf += object;
  }
  const xrefStart = encoder.encode(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets
    .slice(1)
    .map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`)
    .join("");
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return pdf;
}

export function exportRecordsCsv(records) {
  const headers = [
    "householdId",
    "areaId",
    "address",
    "householdSize",
    "rooms",
    "memberName",
    "sex",
    "age",
    "phone",
    "status",
    "capturedAt",
  ];
  const lines = [
    headers.join(","),
    ...records.map((record) => headers.map((header) => escapeCsv(record[header])).join(",")),
  ];

  downloadBlob("censusops-records.csv", "text/csv;charset=utf-8", lines.join("\n"));
}

export function exportExecutiveSummary(summary) {
  const content = makeSimplePdf([
    "CensusOps Executive Summary",
    `Generated: ${new Date().toLocaleString()}`,
    "",
    `Total population: ${summary.totalPopulation}`,
    `Households surveyed: ${summary.householdsSurveyed}`,
    `Completeness: ${summary.completeness}%`,
    `Average processing time: ${summary.averageProcessingTime}`,
    "",
    "Local demo PDF. Production generation can move to Cloud Functions.",
  ]);

  downloadBlob("censusops-executive-summary.pdf", "application/pdf", content);
}
