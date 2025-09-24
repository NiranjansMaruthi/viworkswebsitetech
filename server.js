const express = require("express");
const path = require("path");
const multer = require("multer");
const bodyParser = require("body-parser");
const fs = require("fs");
const XLSX = require("xlsx");

const app = express();
const PORT = process.env.PORT || 3002;

// Static files
app.use(express.static(path.join(__dirname, "Public")));
app.use(bodyParser.json());
const upload = multer();

// Excel file path
const excelFile = path.join(__dirname, "Viworks user data.xlsx");

// Save to Excel (with headers)
function saveToExcel(newRow) {
  let workbook, worksheet, data;

  const headers = [
    "firstName",
    "lastName",
    "email",
    "mobile",
    "productType",
    "productDescription",
    "createdAt",
  ];

  if (fs.existsSync(excelFile)) {
    workbook = XLSX.readFile(excelFile);
    worksheet = workbook.Sheets["Sheet1"];
    data = XLSX.utils.sheet_to_json(worksheet);
    data.push(newRow);
    worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
    workbook.Sheets["Sheet1"] = worksheet;
  } else {
    workbook = XLSX.utils.book_new();
    data = [newRow];
    worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  }

  XLSX.writeFile(workbook, excelFile);
  console.log("📊 Excel updated:", excelFile);
}

// API to receive form data
app.post("/submit", upload.none(), async (req, res) => {
  console.log("📩 Received body:", req.body);
  try {
    const formData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      mobile: req.body.mobile,
      productType: req.body.productType,
      productDescription: req.body.productDescription,
      createdAt: new Date(),
    };

    // Required fields check
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "mobile",
      "productType",
      "productDescription",
    ];
    const emptyFields = requiredFields.filter(
      (field) => !formData[field] || formData[field].trim() === ""
    );

    if (emptyFields.length > 0) {
      return res.status(400).json({
        status: "error",
        message: `❌ Please fill all required fields: ${emptyFields.join(", ")}`,
      });
    }

    saveToExcel(formData);
    console.log("✅ New form submitted:", formData);

    res.json({
      status: "success",
      message: "✅ Form submitted and saved to Excel!",
    });
  } catch (err) {
    console.error("Error saving data:", err);
    res.status(500).json({
      status: "error",
      message: "Error saving data ❌",
      error: err.message,
    });
  }
});

// API to view Excel data
app.get("/view-excel", (req, res) => {
  if (!fs.existsSync(excelFile)) return res.json([]);
  const workbook = XLSX.readFile(excelFile);
  const worksheet = workbook.Sheets["Sheet1"];
  const data = XLSX.utils.sheet_to_json(worksheet);
  res.json(data);
});

// Root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Public", "index.html"));
});

// Server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
