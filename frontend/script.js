```javascript
document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("complaintForm");
    const result = document.getElementById("message");

    if (!form) {
        console.error("Complaint form not found.");
        return;
    }

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        result.textContent = "Submitting issue...";

        const complaint = {
            name: document.getElementById("name").value.trim(),
            role: document.getElementById("role").value,
            category: document.getElementById("category").value,
            location: document.getElementById("location").value.trim(),
            priority: document.getElementById("priority").value,
            description: document.getElementById("description").value.trim()
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

                result.textContent =
                    "Issue submitted successfully! Complaint ID: " +
                    data.complaintId;

                form.reset();

            } else {

                result.textContent =
                    data.message || "Failed to submit issue.";

            }

        } catch (error) {

            console.error("Error:", error);

            result.textContent =
                "Cannot connect to the server.";

        }

    });

});
```
