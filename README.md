# Random_Wheel
A simple, interactive random number wheel built with Django (backend) and HTML/CSS/JavaScript (frontend). Pick a custom range and spin, or let the wheel decide for you.

This was built as a learning project to practice connecting a Python/Django backend to a vanilla JavaScript frontend through a REST-style API.
# Features
 Enter a custom min/max range and spin the wheel
 "Let the wheel decide" button for a quick random spin (1–200)
  Smooth CSS-animated spin
  Server-side input validation with clear error messages (e.g. values outside the allowed 1–200 range)
# Tech stack
Backend: Python, Django
Frontend: HTML5, CSS3, vanilla JavaScript (no frameworks)
Communication: fetch() calling a Django JSON API endpoint

# Project structure
random-wheel/
├── backend/
│   ├── backend/          # Django project settings & main urls.py
│   ├── wheel/             # App: views, urls, templates, static files
│   │   ├── templates/wheel/index.html
│   │   ├── static/wheel/style.css
│   │   ├── static/wheel/script.js
│   │   ├── views.py
│   │   └── urls.py
│   └── manage.py
└── README.md
