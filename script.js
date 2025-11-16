// LocalStorage key
const STORAGE_KEY = "eduvision-courses";

// Elements
const courseModal = document.getElementById("courseModal");
const btnNewCourse = document.getElementById("btnNewCourse");
const saveCourse = document.getElementById("saveCourse");
const closeModal = document.getElementById("closeModal");
const coursesList = document.getElementById("coursesList");
const mainContent = document.getElementById("mainContent");

// Form inputs
const courseTitle = document.getElementById("courseTitle");
const courseCategory = document.getElementById("courseCategory");
const courseDescription = document.getElementById("courseDescription");

// Load saved courses
let courses = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// -----------------------------
// UI UPDATE
// -----------------------------
function renderCourses() {
    coursesList.innerHTML = "";

    courses.forEach((course, index) => {
        const div = document.createElement("div");
        div.className = "course-card";
        div.innerHTML = `
            <strong>${course.title}</strong>
            <p>${course.category}</p>
        `;
        div.onclick = () => openCourse(index);
        coursesList.appendChild(div);
    });

    updateStats();
}

function updateStats() {
    document.getElementById("statCourses").textContent = courses.length;

    let totalLessons = 0;
    let completed = 0;

    courses.forEach(c => {
        totalLessons += c.lessons.length;
        completed += c.lessons.filter(l => l.done).length;
    });

    document.getElementById("statLessons").textContent = totalLessons;
    document.getElementById("statCompleted").textContent = completed;
}

function openCourse(index) {
    const course = courses[index];

    mainContent.innerHTML = `
        <h1>${course.title}</h1>
        <p>${course.description}</p>
        <h3>Lessons</h3>
        <div id="lessonList"></div>

        <button class="btn" id="addLessonBtn">+ Add Lesson</button>
    `;

    renderLessons(index);
}

function renderLessons(courseIndex) {
    const lessonList = document.getElementById("lessonList");
    const course = courses[courseIndex];

    lessonList.innerHTML = "";

    course.lessons.forEach((lesson, i) => {
        const div = document.createElement("div");
        div.className = "course-card";
        div.innerHTML = `
            <input type="checkbox" ${lesson.done ? "checked" : ""} data-c="${courseIndex}" data-i="${i}">
            ${lesson.title}
        `;
        lessonList.appendChild(div);
    });

    // Checkbox event
    document.querySelectorAll("#lessonList input").forEach(box => {
        box.onchange = (e) => {
            const c = e.target.getAttribute("data-c");
            const i = e.target.getAttribute("data-i");
            courses[c].lessons[i].done = e.target.checked;
            save();
        };
    });
}

// -----------------------------
// MODAL HANDLERS
// -----------------------------
btnNewCourse.onclick = () => {
    courseTitle.value = "";
    courseCategory.value = "";
    courseDescription.value = "";

    courseModal.style.display = "flex";
};

closeModal.onclick = () => courseModal.style.display = "none";

saveCourse.onclick = () => {
    const course = {
        title: courseTitle.value,
        category: courseCategory.value,
        description: courseDescription.value,
        lessons: []
    };

    courses.push(course);
    save();
    courseModal.style.display = "none";
};

function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    renderCourses();
}

// Initialize
renderCourses();
