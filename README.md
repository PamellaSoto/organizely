# ✍ Organize.ly

![Project cover](/docs/cover.png)

**A local or login-based weekly management app** designed to organize tasks visually, boost focus, and simplify your week.


## Table of Contents
1. [About the Project](#about-the-project)  
3. [Features](#features)  
4. [Technologies Used](#technologies-used)  
8. [Prototype (Figma)](#prototype-figma)  
7. [REST API Documentation](#rest-api-documentation)  
9. [How to Use](#how-to-use)


## About the Project

Organize.ly is a **task management tool designed to boost personal productivity** by combining task control, scheduling, and prioritization — helping users plan their weekly activities with visual clarity and efficiency.

It can run locally in your browser using **Local Storage**, or by creating an **account**.

The main goal of this project is to offer a **clear, structured, and visually intuitive** way to organize and manage a week’s worth of tasks.


## Features

- Create, edit, and delete tasks.
- Organize tasks by priority (High / Medium / Low).
- Drag-and-drop tasks into days of the week.
- Mark tasks as done (visually highlighted).
- Delete all completed tasks automatically.
- Customize application background with preset colors and (soon) custom images.
- (coming soon) Pomodoro addon for focus.
- Integration with ZenQuotes API for daily motivation.


## Technologies Used

| Layer | Technology |
|:------|:------------|
| Backend | **Java**, **Spring Boot**, **JPA**, **PostgreSQL** |
| Frontend | **React**, **Tailwind CSS**, **Axios**, **DnD** |
| Deployment | **Render** |


## Prototype (Figma)

![Figma print](/docs/figma.png)
> The first design stage was a very basic prototype in Figma, used to establish the creative direction, colors, and component states. [See more here.](https://www.figma.com/design/OEGRgzXmXJx083vToIWtHg/Organize.ly?node-id=0-1&t=oCT3afQizhvm1F3f-1)

## REST API Documentation


### Tasks


| Method | Path | Description |	Body |
|:-------|:-----|:------------|:-----|
| GET | /api/tasks/all | Get all tasks | — |
| POST | /api/tasks/new | Create a new task | { "desc": "..." } |
| PUT | /api/tasks/{id}/edit | Update task | { "desc": "...", "completed": true } |
| DELETE | /api/tasks/{id}/delete | Delete task | — |

### Categories


| Method | Path | Description |	Body |
|:-------|:-----|:------------|:-----|
| GET | /api/categories/all | Get all categories | — |
| POST | /api/categories/new | Create a new category | { "name": "..." } |
| DELETE | /api/categories/{id}/delete | Delete category | — |


## How to Use (PT-BR)


--- 

_Project by: Pamella Sotomayor_
