 // Loader
window.addEventListener("load", () => {
  const load = document.getElementById("loader");
  if (load) {
    load.style.display = "block";
    setTimeout(() => {
      load.style.display = "none";
    }, 1000);
  }
});

// Dropdown menu
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => navLinks.classList.toggle("show"));
  }
});

// Smooth scroll
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-links a");
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.textContent.trim();
      const targets = {
        "Home": "Home",
        "Services": "Service",
        "Contact": "Contact-Section"
      };
      if (targets[targetId]) {
        document.getElementById(targets[targetId])
          .scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});


// Form submission
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("myForm");
  const alertBox = document.querySelector(".alert-text");

  if (!form || !alertBox) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      firstName: document.getElementById("first-name").value.trim(),
      lastName: document.getElementById("last-name").value.trim(),
      email: document.getElementById("email").value.trim(),
      mobile: document.getElementById("phone").value.trim(),
      productType: document.getElementById("service").value.trim(),
      productDescription: document.getElementById("project-details").value.trim()
    };

    // Check empty fields
    const emptyFields = Object.entries(data).filter(([k, v]) => !v);
    if (emptyFields.length > 0) {
      alertBox.textContent = "❌ Please fill in all inputs before submitting";
      alertBox.style.color = "red";
      return;
    }

    alertBox.textContent = "⏳ Submitting...";
    alertBox.style.color = "blue";

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const text = await res.text();
      let response;
      try {
        response = JSON.parse(text);
      } catch {
        response = text;
      }

      console.log("Response:", response);
      alertBox.textContent = "✅ Form submitted successfully!";
      alertBox.style.color = "green";
      form.reset();
    } catch (err) {
      console.error("Error:", err);
      alertBox.textContent = "❌ Something went wrong. Please try again.";
      alertBox.style.color = "red";
    }
  });
});