let students = [];
let courses = [];

async function loadData() {
    students = await (await fetch("https://sis-3.onrender.com/api/students")).json();
    courses = await (await fetch("https://sis-3.onrender.com/api/courses")).json();

    document.getElementById("registerBtn").disabled = false;
}

loadData();

let registerBtn = document.getElementById("registerBtn");
let dropBtn = document.getElementById("dropBtn");

async function addCourse() {
    let enteredCourseCode = document.getElementById("courseInput").value.trim();
    let enteredStudentCode = localStorage.getItem("studentId");


    if (enteredCourseCode === "" || enteredStudentCode === "") {
        alert("Enter Course Code");
        return;
    }

    let course = courses.find(c => c.code === enteredCourseCode);
    let student = students.find(s => s._id === enteredStudentCode);

    if (!course) {
        alert("No such course");
        return;
    }

    await fetch(`https://sis-3.onrender.com/api/students/${student._id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course._id })
    });

    showCourses();

}

registerBtn.onclick = addCourse;


async function removeCourse() {
    let enteredCourseCode = document.getElementById("courseInput").value.trim();
    let enteredStudentCode = localStorage.getItem("studentId");

    if (enteredCourseCode === "" || enteredStudentCode === "") {
        alert("Enter Code");
        return;
    }

    let course = courses.find(c => c.code === enteredCourseCode);
    let student = students.find(s => s._id === enteredStudentCode);

    if (!course) {
        alert("No such course");
        return;
    }

    await fetch(`https://sis-3.onrender.com/api/students/${student._id}/unregister`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course._id })
    });

    showCourses();
}

dropBtn.onclick = removeCourse;


async function showCourses() {
    await loadData();
    let name = localStorage.getItem("studentId");
    let displayArea = document.getElementById("displayArea");

    displayArea.innerHTML = "";

    let student = students.find(s => s._id === name);
    if (!student) return;

    if (!student.registeredCourses || student.registeredCourses.length === 0) {
        displayArea.innerHTML = "No courses registered.";
        return;
    }

    student.registeredCourses.forEach(course => {
        let line = document.createElement("span");
        line.innerHTML = course.code + " - " + course.title;
        displayArea.appendChild(line);
        displayArea.appendChild(document.createElement("br"));
    });

}

showCourses();


async function displayAllCourses() {
    let coursesArea = document.getElementById("coursesArea");
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
