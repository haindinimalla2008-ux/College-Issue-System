const API = "https://college-issue-system.onrender.com";

async function loadDashboard() {

    const dashboard = document.getElementById("dashboard");
    const complaintsDiv = document.getElementById("complaints");

    try {

        const response = await fetch(API + "/complaints");

        if (!response.ok) {
            throw new Error("Failed to load complaints");
        }

        const complaints = await response.json();

        let pending = 0;
        let inProgress = 0;
        let resolved = 0;

        complaints.forEach(complaint => {

            if (complaint.status === "Pending") {
                pending++;
            }

            if (complaint.status === "In Progress") {
                inProgress++;
            }

            if (complaint.status === "Resolved") {
                resolved++;
            }

        });

        dashboard.innerHTML = `
            <div class="dashboard-box">

                <div>
                    <h3>Total Complaints</h3>
                    <p>${complaints.length}</p>
                </div>

                <div>
                    <h3>Pending</h3>
                    <p>${pending}</p>
                </div>

                <div>
                    <h3>In Progress</h3>
                    <p>${inProgress}</p>
                </div>

                <div>
                    <h3>Resolved</h3>
                    <p>${resolved}</p>
                </div>

            </div>
        `;

        if (complaints.length === 0) {

            complaintsDiv.innerHTML =
                "<p>No complaints found.</p>";

            return;
        }

        complaintsDiv.innerHTML = "";

        complaints.forEach(complaint => {

            const div = document.createElement("div");

            div.className = "admin-complaint";

            div.innerHTML = `

                <hr>

                <h3>
                    Complaint #${complaint.id}
                </h3>

                <p>
                    <strong>Name:</strong>
                    ${complaint.name}
                </p>

                <p>
                    <strong>Role:</strong>
                    ${complaint.role}
                </p>

                <p>
                    <strong>Category:</strong>
                    ${complaint.category}
                </p>

                <p>
                    <strong>Location:</strong>
                    ${complaint.location}
                </p>

                <p>
                    <strong>Priority:</strong>
                    ${complaint.priority}
                </p>

                <p>
                    <strong>Description:</strong>
                    ${complaint.description}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${complaint.status}
                </p>

                <label>
                    Update Status:
                </label>

                <select
                    onchange="updateStatus(${complaint.id}, this.value)"
                >

                    <option value="Pending"
                        ${complaint.status === "Pending" ? "selected" : ""}>
                        Pending
                    </option>

                    <option value="In Progress"
                        ${complaint.status === "In Progress" ? "selected" : ""}>
                        In Progress
                    </option>

                    <option value="Resolved"
                        ${complaint.status === "Resolved" ? "selected" : ""}>
                        Resolved
                    </option>

                </select>

            `;

            complaintsDiv.appendChild(div);

        });

    } catch (error) {

        console.error(error);

        dashboard.innerHTML =
            "<p>Cannot connect to the server.</p>";

        complaintsDiv.innerHTML =
            "";
    }
}


async function updateStatus(id, status) {

    try {

        const response = await fetch(
            API + "/complaints/" + id,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    status: status
                })
            }
        );

        const data = await response.json();

        if (response.ok) {

            alert(
                "Complaint status updated successfully!"
            );

            loadDashboard();

        } else {

            alert(
                data.message ||
                "Failed to update status."
            );

        }

    } catch (error) {

        console.error(error);

        alert(
            "Cannot connect to the server."
        );
    }
}


loadDashboard();