# EduVision – Learning Dashboard

A learning dashboard where you create courses, add lessons to them and tick lessons off as you complete them. Built with plain HTML, CSS and JavaScript.

I made this after my [task tracker](https://github.com/Mubarakjk/task-tracker-dashboard) because I wanted a project with more structure: data nested inside other data (lessons inside courses) and a layout with a sidebar and a main panel.

![EduVision](https://github.com/user-attachments/assets/d3e5e9a5-2dff-4933-8835-02ab18ce63ce)

## Features

- Create courses with a title, category and description
- Add lessons to each course
- Tick lessons off and see progress for the course
- Quick stats in the sidebar: courses, total lessons and lessons completed
- Everything is saved in LocalStorage, so it is still there after a refresh
- Works on mobile, where the sidebar stacks above the content

## Run it

No install or build step. Clone the repo and open `index.html` in a browser:

```bash
git clone https://github.com/Mubarakjk/eduvision-learning-dashboard.git
```

## What I learned

- Structuring nested data and keeping the sidebar, stats and main panel in sync with it
- Building a modal form and validating input
- Escaping user text before adding it to the page

## Tech

HTML, CSS, JavaScript and LocalStorage. No frameworks or libraries, because I wanted to practise building everything by hand.
