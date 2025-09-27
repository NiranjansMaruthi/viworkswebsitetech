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
document.addEventListener("DOMContentLoaded",() => {
  const form = document.getElementById("myForm");
  const alertBox = document.querySelector(".alert-text");

  if(!form || !alertBox) return;

  form.addEventListener("submit", function(e){
    e.preventDefault();


    const formData = new FormData(this);
    const data ={};
    let emptyFields =[];


//Collect values and check if any field is empty
 formData.forEach((value,key)=>{
  data[key] = value.trim()
    if(!value.trim()){
      emptyFields.push(key);
    }
 })


  // validation check if filed are empty if any filed is empty
     if (emptyFields.length > 0) {
    alertBox.textContent ="❌ Please fill in all inputs before submitting ";
    alertBox.style.color="red";
    return;    //stop form from submitting
  }



//fetch to Google Apps Script
    fetch(
      "https://script.google.com/macros/s/AKfycbxM7R8Ux1JxK2sCWzBJqv1Lb8SUp0FnD9xdnSldN3gNkuUGA0Iq2bRnHiUUJvyQoefmRg/exec",
    {
      method:"POST",
      body:JSON.stringify(data),
      headers: {"Content-Type":"application/json",},
      body:JSON.stringify(data)
    })

    .then((res)=> res.json())
    .then((response) => {
      console.log("Successs:",response);
      alertBox.textContent="✅ Form submitted successfully";
      alertBox.style.color ="green";
      form.reset();// clear form after success
    })
    .catch((error) => {
      console.error("Error:",error);
      alertBox.textContent ="❌ Something went worng. Please try agian.";
      alertBox.style.color ="red";
    });
  });
})