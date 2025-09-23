const express = require("express");
const path = require("path");
const multer = require("multer");
const bodyParser = require("body-parser");
const fs = require("fs");
const XLSX = require("xlsx");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3002;

// Static files
app.use(express.static(path.join(__dirname, "Public")));
app.use(bodyParser.json());
const upload = multer();

// Excel file
const excelFile = path.join(__dirname, "Viworks user data.xlsx");

// MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/viworkstech-userdata", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("MongoDB error:", err));

// Schema
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  mobile: String,
  productType: String,
  productDescription: String,
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model("User", userSchema);

// Save to Excel (with headers)
function saveToExcel(newRow) {
  let workbook, worksheet, data;

  if (fs.existsSync(excelFile)) {
    workbook = XLSX.readFile(excelFile);
    worksheet = workbook.Sheets["Sheet1"];
    data = XLSX.utils.sheet_to_json(worksheet);
    data.push(newRow);
  } else {
    workbook = XLSX.utils.book_new();
    data = [newRow];
  }

  // Always ensure headers are included
  worksheet = XLSX.utils.json_to_sheet(data, { header: [
    "firstName",
    "lastName",
    "email",
    "mobile",
    "productType",
    "productDescription",
    "createdAt"
  ]});

  workbook.Sheets["Sheet1"] = worksheet;
  if (!workbook.SheetNames.includes("Sheet1")) {
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  }

  XLSX.writeFile(workbook, excelFile);
  console.log("📊 Excel updated:", excelFile);
}

// API
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
      createdAt: new Date()
    };

    // Required fields check
    const requiredFields = ["firstName", "lastName", "email", "mobile", "productType", "productDescription"];
    const emptyFields = requiredFields.filter(field => !formData[field] || formData[field].trim() === "");

    if (emptyFields.length > 0) {
      return res.status(400).json({
        status: "error",
        message: `❌ Please fill all required fields: ${emptyFields.join(", ")}`
      });
    }

    // Save to Excel + MongoDB
    saveToExcel(formData);
    const user = new User(formData);
    await user.save();

    console.log("✅ New form submitted:", formData);

    res.json({
      status: "success",
      message: "✅ Form submitted!"
    });
  } catch (err) {
    console.error("Error saving data:", err);
    res.status(500).json({
      status: "error",
      message: "Error saving data ❌",
      error: err.message
    });
  }
});

app.get("/view-excel", (req, res) => {
  if (!fs.existsSync(excelFile)) {
    return res.status(404).send("No Excel file found yet.");
  }
  const workbook = XLSX.readFile(excelFile);
  const worksheet = workbook.Sheets["Sheet1"];
  const data = XLSX.utils.sheet_to_json(worksheet);
  res.json(data); // show JSON in browser
});

// Root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
