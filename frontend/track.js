```javascript
const trackForm = document.getElementById("trackForm");
const result = document.getElementById("result");

trackForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const id = document.getElementById("complaintId").value.trim();

    if (!id) {
        result.innerHTML = "<p>Please enter a Complaint ID.</p>";
        return;
    }

    result.innerHTML = "<p>Searching for complaint...</p>";

    try {

        const response = await fetch(
            "https://college-issue-system.onrender.com/complaints/" + id
        );

        const data = await response.json();

        if (!response.ok) {

            result.innerHTML =
                "<p>" + (data.message || "Complaint not found.") + "</p>";

            return;
        }

        let priorityText = data.priority || "Medium";

        result.innerHTML =
            "<div>" +
            "<h3>Complaint #" + data.id + "</h3>" +
            "<p><strong>Name:</strong> " + data.name + "</p>" +
            "<p><strong>Role:</strong> " + data.role + "</p>" +
            "<p><strong>Category:</strong> " + data.category + "</p>" +
            "<p><strong>Location:</strong> " + data.location + "</p>" +
            "<p><strong>Priority:</strong> " + priorityText + "</p>" +
            "<p><strong>Description:</strong> " + data.description + "</p>" +
            "<p><strong>Status:</strong> " + data.status + "</p>" +
            "</div>";

    } catch (error) {

        console.error(error);

        result.innerHTML =
            "<p>Cannot connect to the server.</p>";
    }

});
```
