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

// Index of the course currently shown in the main panel (null = welcome screen)
let openIndex = null;

// Escape user text before putting it into innerHTML
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// -----------------------------
// UI UPDATE
// -----------------------------
function renderCourses() {
    coursesList.innerHTML = "";

    courses.forEach((course, index) => {
        const div = document.createElement("div");
        div.className = "course-card" + (index === openIndex ? " active" : "");
        div.innerHTML = `
            <strong>${escapeHtml(course.title)}</strong>
            <p>${escapeHtml(course.category)}</p>
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
    openIndex = index;

    mainContent.innerHTML = `
        <h1>${escapeHtml(course.title)}</h1>
        <p>${escapeHtml(course.description)}</p>
        <p class="progress" id="courseProgress"></p>
        <h3>Lessons</h3>
        <div id="lessonList"></div>

        <div class="lesson-form">
            <input type="text" id="lessonTitle" placeholder="Lesson title">
            <button class="btn" id="addLessonBtn">+ Add Lesson</button>
        </div>
    `;

    const lessonTitle = document.getElementById("lessonTitle");

    const addLesson = () => {
        const title = lessonTitle.value.trim();
        if (!title) return;
        course.lessons.push({ title, done: false });
        lessonTitle.value = "";
        save();
        renderLessons(index);
        lessonTitle.focus();
    };

    document.getElementById("addLessonBtn").onclick = addLesson;
    lessonTitle.onkeydown = (e) => {
        if (e.key === "Enter") addLesson();
    };

    renderCourses();
    renderLessons(index);
}

function renderLessons(courseIndex) {
    const lessonList = document.getElementById("lessonList");
    const course = courses[courseIndex];

    lessonList.innerHTML = "";

    if (course.lessons.length === 0) {
        lessonList.innerHTML = `<p class="empty">No lessons yet. Add your first one below.</p>`;
    }

    course.lessons.forEach((lesson, i) => {
        const label = document.createElement("label");
        label.className = "course-card lesson" + (lesson.done ? " done" : "");
        label.innerHTML = `
            <input type="checkbox" ${lesson.done ? "checked" : ""} data-i="${i}">
            <span>${escapeHtml(lesson.title)}</span>
        `;
        lessonList.appendChild(label);
    });

    // Checkbox event
    document.querySelectorAll("#lessonList input").forEach(box => {
        box.onchange = (e) => {
            const i = e.target.getAttribute("data-i");
            course.lessons[i].done = e.target.checked;
            save();
            renderLessons(courseIndex);
        };
    });

    const done = course.lessons.filter(l => l.done).length;
    document.getElementById("courseProgress").textContent =
        `${done} of ${course.lessons.length} lessons completed`;
}

// -----------------------------
// MODAL HANDLERS
// -----------------------------
btnNewCourse.onclick = () => {
    courseTitle.value = "";
    courseCategory.value = "";
    courseDescription.value = "";

    courseModal.style.display = "flex";
    courseTitle.focus();
};

closeModal.onclick = () => courseModal.style.display = "none";

saveCourse.onclick = () => {
    const title = courseTitle.value.trim();

    // A course needs a title
    if (!title) {
        courseTitle.focus();
        return;
    }

    const course = {
        title,
        category: courseCategory.value.trim(),
        description: courseDescription.value.trim(),
        lessons: []
    };

    courses.push(course);
    save();
    courseModal.style.display = "none";
    openCourse(courses.length - 1);
};

function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    renderCourses();
}

// Initialize
renderCourses();
