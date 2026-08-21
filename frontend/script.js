const form = document.getElementById("complaintForm");
const result = document.getElementById("message");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const complaint = {
        name: document.getElementById("name").value,
        role: document.getElementById("role").value,
        category: document.getElementById("category").value,
        location: document.getElementById("location").value,
        priority: document.getElementById("priority").value,
        description: document.getElementById("description").value
    };

    try {
        const response = await fetch(
            "https://college-issue-system.onrender.com/complaints",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(complaint)
            }
        );

        const data = await response.json();

        if (response.ok) {
            result.innerHTML =
                "Issue submitted successfully! Complaint ID: " +
                data.complaintId;

            form.reset();
        } else {
            result.innerHTML =
                data.message || "Failed to submit issue.";
        }

    } catch (error) {
        console.error(error);

        result.innerHTML =
            "Cannot connect to the server.";
    }
});