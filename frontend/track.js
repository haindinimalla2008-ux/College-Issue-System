```javascript
async function trackComplaint() {

    const id = document.getElementById("complaintId").value.trim();
    const result = document.getElementById("result");

    if (!id) {

        result.innerHTML =
            '<p class="error">Please enter a Complaint ID.</p>';

        return;
    }

    result.innerHTML =
        '<p>🔎 Searching for complaint...</p>';

    try {

        const response = await fetch(
            `https://college-issue-system.onrender.com/complaints/${id}`
        );

        const data = await response.json();

        if (!response.ok) {

            result.innerHTML =
                `<p class="error">${data.message || "Complaint not found."}</p>`;

            return;
        }

        let priorityIcon = "🟡";

        if (data.priority === "High") {
            priorityIcon = "🔴";
        }

        if (data.priority === "Low") {
            priorityIcon = "🟢";
        }

        result.innerHTML = `

            <div class="success">

                <h3>
                    Complaint #${data.id}
                </h3>

                <p>
                    <strong>Name:</strong>
                    ${data.name}
                </p>

                <p>
                    <strong>Role:</strong>
                    ${data.role}
                </p>

                <p>
                    <strong>Category:</strong>
                    ${data.category}
                </p>

                <p>
                    <strong>Location:</strong>
                    ${data.location}
                </p>

                <p>
                    <strong>Priority:</strong>
                    ${priorityIcon}
                    ${data.priority || "Medium"}
                </p>

                <p>
                    <strong>Description:</strong>
                    ${data.description}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${data.status}
                </p>

            </div>

        `;

    } catch (error) {

        console.error(error);

        result.innerHTML =
            '<p class="error">❌ Cannot connect to the server.</p>';

    }
}
```
