let allStudents = [];
let allCourses = [];

async function loadData() {
    allStudents = await (await fetch("https://sis-3.onrender.com/api/students")).json();
    allCourses = await (await fetch("https://sis-3.onrender.com/api/courses")).json();
}
loadData();

async function createStudent() {
    let name = document.getElementById("stdName").value.trim();
    let email = document.getElementById("stdEmail").value.trim();
    let password = document.getElementById("stdPass").value.trim();

    await loadData();

    if (email === "" || name === "" || password === "") {
        alert("Please fill in the fields");
        return;
    }

    let newStudent = {
        name: name,
        email: email,
        password: password,
        role: "STUDENT",
        registeredCourses: []
    }

    let student = allStudents.find(s => s.name === name && s.email === email);

    if (student != null) {
        alert("Error: Check the existence of name and email!");
        return;
    }

    try {
        const response = await fetch("https://sis-3.onrender.com/api/students", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newStudent)
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert("Error: " + errorData.message);
            return;
        }

        alert("Student created successfully!");
    } catch (error) {
        alert("Network error: " + error.message);
    }

    displayStudents();
    await loadData();
}

async function removeStudent() {
    let name = document.getElementById("stdName").value.trim();
    let email = document.getElementById("stdEmail").value.trim();

    await loadData();

    if (email === "" || name === "") {
        alert("Please fill in the fields");
        return;
    }

    let student = allStudents.find(c => c.name.toLowerCase() === name.toLowerCase() && c.email.toLowerCase() === email.toLowerCase());

    if (!student) {
        alert("Student does not exist");
        return;
    }

    try {
        const res = await fetch(`https://sis-3.onrender.com/api/students/${student._id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!res.ok) {
            const errorData = await response.json();
            alert("Error: " + errorData.message);
            return;
        }

        alert("Student deleted successfully!");
    } catch (error) {
        alert(error.message);
    }

    displayStudents();

    await loadData();
}

async function displayStudents() {
    let studentArea2 = document.getElementById("studentArea2");
    studentArea2.innerHTML = "";

    let table = document.createElement("table");

    table.style.width = "30%";
    table.style.borderCollapse = "collapse";
    table.style.marginTop = "20px";
    table.style.marginLeft = "auto";
    table.style.marginRight = "20px";
    table.style.fontFamily = "Arial, sans-serif";
    table.style.boxShadow = "2px 2px 8px rgba(0,0,0,0.2)";

    let res = await fetch("https://sis-3.onrender.com/api/students");
    allStudents = await res.json();

    let students = allStudents.filter(s => s.role === "STUDENT");

    let header = table.insertRow();
    ["Name", "Email", "Courses"].forEach(text => {
        let cell = header.insertCell();
        cell.innerHTML = text;
        cell.style.fontWeight = "bold";
        cell.style.textAlign = "right";
        cell.style.border = "1px solid #ccc";
        cell.style.padding = "8px";
        cell.style.backgroundColor = "#f2f2f2";
    });

    students.forEach(student => {
        let newRow = table.insertRow();

        let nameCell = newRow.insertCell();
        nameCell.innerHTML = student.name;
        nameCell.style.textAlign = "right";
        nameCell.style.border = "1px solid #ccc";
        nameCell.style.padding = "8px";

        let emailCell = newRow.insertCell();
        emailCell.innerHTML = student.email;
        emailCell.style.textAlign = "right";
        emailCell.style.border = "1px solid #ccc";
        emailCell.style.padding = "8px";

        let coursesCell = newRow.insertCell();
        if (student.registeredCourses && student.registeredCourses.length > 0) {
            coursesCell.innerHTML = student.registeredCourses.map(c => c.code).join(", ");
        } else {
            coursesCell.innerHTML = "None";
        }
        coursesCell.style.textAlign = "right";
        coursesCell.style.border = "1px solid #ccc";
        coursesCell.style.padding = "8px";
    });

    studentArea2.appendChild(table);

    studentArea2.style.display = "flex";
    studentArea2.style.justifyContent = "flex-end";

}

displayStudents();

async function displayAllCourses() {
    let coursesArea = document.getElementById("dispCourses");
    coursesArea.innerHTML = "";

    coursesArea.style.display = "flex";
    coursesArea.style.justifyContent = "flex-end";
    coursesArea.style.width = "100%";

    let table = document.createElement("table");

    table.style.width = "30%";
    table.style.borderCollapse = "collapse";
    table.style.marginTop = "20px";
    table.style.marginLeft = "auto";
    table.style.marginRight = "20px";
    table.style.fontFamily = "Arial, sans-serif";
    table.style.boxShadow = "2px 2px 8px rgba(0,0,0,0.2)";

    let res = await fetch("https://sis-3.onrender.com/api/courses");
    courses = await res.json();

    let header = table.insertRow();
    ["Code", "Name", "Credits"].forEach(text => {
        let cell = header.insertCell();
        cell.innerHTML = text;
        cell.style.fontWeight = "bold";
        cell.style.textAlign = "right";
        cell.style.border = "1px solid #ccc";
        cell.style.padding = "8px";
        cell.style.backgroundColor = "#f2f2f2";
    });

    courses.forEach(course => {
        let newRow = table.insertRow();

        let codeCell = newRow.insertCell();
        codeCell.innerHTML = course.code;
        codeCell.style.textAlign = "right";
        codeCell.style.border = "1px solid #ccc";
        codeCell.style.padding = "8px";

        let nameCell = newRow.insertCell();
        nameCell.innerHTML = course.title;
        nameCell.style.textAlign = "right";
        nameCell.style.border = "1px solid #ccc";
        nameCell.style.padding = "8px";

        let creditsCell = newRow.insertCell();
        creditsCell.innerHTML = course.credits;
        creditsCell.style.textAlign = "right";
        creditsCell.style.border = "1px solid #ccc";
        creditsCell.style.padding = "8px";
    });

    coursesArea.appendChild(table);
}

displayAllCourses();


async function addCourse() {
    let courseCode = document.getElementById("courseCode").value.trim();
    let courseName = document.getElementById("courseName").value.trim();
    let courseCredits = document.getElementById("courseCredits").value.trim();

    try {
        if (courseCode === "" || courseName === "" || courseCredits === "") {
            throw new Error("Please enter code, name and credits");
        }

        if (courseCredits !== "1" && courseCredits !== "3") {
            throw new Error("Credits must be 1 or 3");
        }

        let newCourse = {
            title: courseName,
            code: courseCode,
            credits: courseCredits
        };

        await fetch("https://sis-3.onrender.com/api/courses", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCourse)
        });

    } catch (error) {
        alert(error.message);
    }
    displayAllCourses();
}

async function deleteCourse() {
    let courseCode = document.getElementById("courseCode").value.trim();

    await loadData(); 

    let course = allCourses.find(s => s.code === courseCode);

    try {
        if (!course) {
            throw new Error("Course does not exist");
        }

        await fetch(`https://sis-3.onrender.com/api/courses/${course._id}`, {
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' }
        });

        alert("Course deleted successfully");

    } catch (error) {
        alert(error.message);
    }

    displayAllCourses();
}

