async function loadComplaints() {

    const container =
        document.getElementById("complaintsContainer");


    try {

        const response = await fetch(
            "http://localhost:3000/complaints"
        );


        if (!response.ok) {

            throw new Error(
                "Failed to load complaints"
            );

        }


        const complaints =
            await response.json();


        container.innerHTML = "";


        // =========================
        // PRIORITY SORTING
        // =========================

        const priorityOrder = {

            "High": 1,
            "Medium": 2,
            "Low": 3

        };


        complaints.sort((a, b) => {

            return (
                (priorityOrder[a.priority] || 2) -
                (priorityOrder[b.priority] || 2)
            );

        });


        // =========================
        // STATISTICS
        // =========================

        updateStatistics(complaints);


        // =========================
        // DISPLAY COMPLAINTS
        // =========================

        complaints.forEach(complaint => {


            const complaintBox =
                document.createElement("div");


            complaintBox.className =
                "complaint";


            // Priority icon

            let priorityIcon = "🟡";


            if (complaint.priority === "High") {

                priorityIcon = "🔴";

            }


            if (complaint.priority === "Low") {

                priorityIcon = "🟢";

            }


            complaintBox.innerHTML = `

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
                    ${priorityIcon}
                    ${complaint.priority || "Medium"}
                </p>


                <p>
                    <strong>Description:</strong>
                    ${complaint.description}
                </p>


                <p>
                    <strong>Current Status:</strong>

                    <span id="current-status-${complaint.id}">
                        ${complaint.status}
                    </span>

                </p>


                <select
                    id="status-${complaint.id}">

                    <option value="Pending">
                        Pending
                    </option>


                    <option value="In Progress">
                        In Progress
                    </option>


                    <option value="Resolved">
                        Resolved
                    </option>

                </select>


                <button
                    type="button"
                    onclick="updateStatus(${complaint.id})">

                    Update Status

                </button>

            `;


            const select =
                complaintBox.querySelector(
                    `#status-${complaint.id}`
                );


            select.value =
                complaint.status;


            container.appendChild(
                complaintBox
            );

        });


    } catch (error) {

        console.error(error);


        container.innerHTML =
            "<p>Unable to connect to the server.</p>";

    }

}


/* =========================
   UPDATE STATISTICS
========================= */

function updateStatistics(complaints) {


    let pending = 0;

    let progress = 0;

    let resolved = 0;


    let highPriority = 0;

    let mediumPriority = 0;

    let lowPriority = 0;


    complaints.forEach(complaint => {


        // STATUS

        if (complaint.status === "Pending") {

            pending++;

        }


        if (complaint.status === "In Progress") {

            progress++;

        }


        if (complaint.status === "Resolved") {

            resolved++;

        }


        // PRIORITY

        if (complaint.priority === "High") {

            highPriority++;

        }


        else if (complaint.priority === "Low") {

            lowPriority++;

        }


        else {

            mediumPriority++;

        }

    });


    // STATUS COUNTS

    document.getElementById(
        "totalComplaints"
    ).textContent =
        complaints.length;


    document.getElementById(
        "pendingComplaints"
    ).textContent =
        pending;


    document.getElementById(
        "progressComplaints"
    ).textContent =
        progress;


    document.getElementById(
        "resolvedComplaints"
    ).textContent =
        resolved;


    // PRIORITY COUNTS

    document.getElementById(
        "highPriorityComplaints"
    ).textContent =
        highPriority;


    document.getElementById(
        "mediumPriorityComplaints"
    ).textContent =
        mediumPriority;


    document.getElementById(
        "lowPriorityComplaints"
    ).textContent =
        lowPriority;

}


/* =========================
   UPDATE STATUS
========================= */

async function updateStatus(id) {


    const select =
        document.getElementById(
            `status-${id}`
        );


    const button =
        select.parentElement.querySelector(
            "button"
        );


    const status =
        select.value;


    button.disabled = true;

    button.textContent =
        "Updating...";


    try {


        const response = await fetch(

            `http://localhost:3000/complaints/${id}`,

            {

                method: "PUT",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    status: status

                })

            }

        );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Update failed"
            );

        }


        // Update current status

        document.getElementById(
            `current-status-${id}`
        ).textContent =
            status;


        button.textContent =
            "Updated ✓";


        // Refresh statistics only

        const allComplaintsResponse =
            await fetch(
                "http://localhost:3000/complaints"
            );


        const allComplaints =
            await allComplaintsResponse.json();


        updateStatistics(
            allComplaints
        );


        setTimeout(() => {

            button.disabled = false;

            button.textContent =
                "Update Status";

        }, 500);


    } catch (error) {


        console.error(error);


        alert(
            "Unable to update Complaint #" +
            id
        );


        button.disabled = false;

        button.textContent =
            "Update Status";

    }

}


/* =========================
   START DASHBOARD
========================= */

loadComplaints();