async function Login() {
    let userID = document.getElementById("inputID").value;
    let password = document.getElementById("inputPassword").value;

    const res = await fetch("https://sis-3.onrender.com/api/students");
    const allStudents = await res.json();

    let student = allStudents.find(s => s.name === userID && s.password === password);

    if (!student) {
        alert("invalid name or password");
        return;
    }

    localStorage.setItem("studentId", student._id);
    localStorage.setItem("role", student.role);

    if (student.role === "STUDENT") {
        window.location.href = "student.html";
    } 
    else if (student.role === "ADMIN") {
        window.location.href = "admin.html";
    }
}
