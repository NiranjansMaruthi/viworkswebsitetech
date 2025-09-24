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

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(this);

    const data = {};
    let emptyFields = [];

    // Collect data + validate
    formData.forEach((value, key) => {
      data[key] = value.trim();
      if (!value.trim()) emptyFields.push(key);
    });

    if (emptyFields.length > 0) {
      alertBox.innerText = `❌ Please fill all required fields: ${emptyFields.join(", ")}`;
      alertBox.style.color = "red";
      return;
    }

    // Show loading
    alertBox.innerText = "Submitting...";
    alertBox.style.color = "blue";

    // Send to server
    fetch("/submit", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    })
      .then(async res => {
        let result;
        try {
          result = await res.json(); // try parsing JSON
        } catch (e) {
          throw new Error("Server did not return valid JSON");
        }

        if (res.ok && result.status === "success") {
          alertBox.innerText = "✅ Response submitted!";
          alertBox.style.color = "green";
          form.reset();
        } else {
          alertBox.innerText = result.message || "❌ Response Failed!";
          alertBox.style.color = "red";
        }
      })
      .catch(err => {
        alertBox.innerText = "❌ Failed to submit!";
        alertBox.style.color = "red";
        console.error("Fetch error:", err);
      });
  });
});
