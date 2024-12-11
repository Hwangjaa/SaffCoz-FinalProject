document
  .getElementById("contactForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    const firstName = event.target.firstName.value.trim();
    const lastName = event.target.lastName.value.trim();
    const email = event.target.email.value.trim();
    const phone = event.target.phone.value.trim();
    const gender = event.target.gender.value;
    const message = event.target.message.value.trim();

    if (!firstName || !lastName) {
      alert("Please enter your full name.");
      return;
    }

    if (email === "" || !email.includes("@") || !email.includes(".")) {
      alert("Please enter a valid email address.");
      return;
    }

    if (
      phone === "" ||
      phone.length < 10 ||
      phone.length > 13 ||
      isNaN(phone)
    ) {
      alert("Please enter a valid phone number.");
      return;
    }

    if (!gender) {
      alert("Wich side are you?");
      return;
    }

    if (!message) {
      alert("Please write your message.");
      return;
    }

    alert("Your message has been sent successfully!");
  });
