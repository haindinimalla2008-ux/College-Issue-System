async function trackComplaint() {

    const id = document.getElementById("complaintId").value;
    const result = document.getElementById("result");

    if (!id) {
        result.innerHTML =
            '<p class="error">Please enter a Complaint ID.</p>';
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:3000/complaints/${id}`
        );

        const data = await response.json();

        if (!response.ok) {

            result.innerHTML =
                `<p class="error">${data.message}</p>`;

            return;
        }


        // Priority icon

        let priorityIcon = "🟡";

        if (data.priority === "High") {
            priorityIcon = "🔴";
        }

        if (data.priority === "Low") {
            priorityIcon = "🟢";
        }


        // Display complaint

        result.innerHTML = `

            <div class="success">

                <h3>
                    Complaint #${data.id}
                </h3>

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
            '<p class="error">Cannot connect to the server.</p>';

    }
}