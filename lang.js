const schaleDBLink = '<a href="https://schaledb.com/" style="color: inherit;" target="_blank" class="txt-link"><svg width="20" height="20" version="1.1" viewBox="0 0 37.6 37.6" xmlns="http://www.w3.org/2000/svg"><path d="m18.2 4.36c-0.721-0.00295-1.44 0.0316-2.14 0.103-3.33 0.339-6.44 1.52-8.65 3.5 0.403 0.157 0.806 0.314 1.21 0.476 1.91-1.61 4.54-2.59 7.45-2.89 2.79-0.285 5.83 0.0741 8.64 1.13 0.319-0.304 0.64-0.606 0.965-0.906-2.39-0.939-4.96-1.41-7.47-1.42zm10.2 2.73c-0.249 0.336-0.502 0.669-0.758 1 2.66 1.62 4.43 3.74 5.17 5.96h1.47c-0.0316-0.11-0.0631-0.221-0.0992-0.331-0.824-2.51-2.81-4.87-5.78-6.63zm-22.9 3.18c-1.26 2.12-1.45 4.48-0.722 6.71 0.734 2.23 2.39 4.35 4.85 6.03l0.861-0.953c-2.22-1.55-3.71-3.48-4.36-5.48-0.628-1.91-0.501-3.86 0.436-5.63-0.356-0.224-0.709-0.451-1.06-0.68zm23.3 4.45c-0.675 1e-6 -1.34 0.125-1.98 0.376-0.641 0.231-1.24 0.55-1.79 0.955-0.552 0.405-1.02 0.868-1.41 1.39-0.39 0.521-0.663 1.07-0.818 1.65l-0.822 3.07c-0.31 1.16-0.296 2.01 0.0413 2.55 0.362 0.521 0.922 0.877 1.68 1.07l5.15 1.74c0.144 0.0386 0.26 0.145 0.349 0.318 0.113 0.154 0.123 0.405 0.03 0.752l-0.612 2.29c-0.0465 0.174-0.166 0.366-0.358 0.578-0.167 0.193-0.373 0.386-0.618 0.579-0.22 0.174-0.454 0.328-0.702 0.463-0.224 0.116-0.413 0.173-0.567 0.173h-7.23l-0.822 3.07h8.3c0.424-1e-6 0.96-0.164 1.61-0.491 0.647-0.328 1.28-0.733 1.89-1.22 0.631-0.482 1.18-1 1.66-1.56 0.497-0.559 0.81-1.08 0.939-1.56l0.876-3.27c0.0568-0.212 0.0995-0.443 0.128-0.694 0.0531-0.27 0.0553-0.531 0.0067-0.781-0.0485-0.251-0.17-0.482-0.364-0.694-0.189-0.231-0.477-0.415-0.865-0.55l-5.79-2.02c-0.249-0.0771-0.424-0.183-0.522-0.318-0.0988-0.135-0.107-0.357-0.0243-0.666l0.674-2.52c0.16-0.598 0.455-1.01 0.883-1.24 0.428-0.231 0.864-0.347 1.31-0.347h6.6l0.822-3.07zm-15 9.11-0.857 0.949c3.15 1.3 6.62 1.77 9.88 1.46-0.56-0.229-1.01-0.567-1.34-1.01-2.54 0.0611-5.21-0.386-7.68-1.39z" fill="#fff"></path><path d="m31.2 1.85-3.41 3.01a66.3 86.6 75.9 0 0-7.04 6.95l-2.07 2.3-4.38-2.24a66.2 86.5 75.9 0 0-8.77-3.83l-4.13-1.52 3.4 2.33a66.3 86.6 75.9 0 0 7.96 4.73l4.38 2.24-8.07 8.94a66.3 86.6 75.9 0 0-6 7.48l-2.47 3.49 3.41-3.01a66.2 86.5 75.9 0 0 7.04-6.95l8.07-8.94 3.23 1.65c0.187-0.46 0.437-0.907 0.754-1.33 0.143-0.191 0.299-0.373 0.461-0.55l-2.9-1.49 2.07-2.3a66.2 86.5 75.9 0 0 6-7.48zm-3.43 17c-0.0934 0.0991-0.176 0.25-0.255 0.548l-0.383 1.43a66.3 86.6 75.9 0 0 5.8 2.42l4.13 1.52-3.4-2.33a66.2 86.5 75.9 0 0-5.89-3.59z" fill="#00d9fa"></path></svg>SchaleDB</a>';

const translations = {
    "guide-button-text": {
        ru: "Руководство",
        en: "Guide"
    },
    guide1: {
        ru: '— кнопка во вьюпорте для переключения режимов между просмотром анимации и взаимодействия. В режиме просмотра анимации для перемещения камеры используются ЛКМ и ПКМ. В режиме взаимодействия - ЛКМ для взаимодействия, ПКМ для камеры.',
        en: '— a button in viewport to switch between animation preview and interaction mode. In animation preview mode, use LMB and RMB to move the camera. In interaction mode, use LMB to interact and RMB to move the camera.'
    },
    guide2: {
        ru: '— наведение на кнопку отобразит места, доступные для взаимодействий, и тип взаимодействия.',
        en: '— hovering over the button will display the locations available for interaction and the type of interaction.'
    },
    guide3: {
        ru: '— взаимодействие удержанием и перемещением курсора.',
        en: '— interaction by holding and moving the cursor.'
    },
    guide4: {
        ru: '— взаимодействие нажатием.',
        en: '— interaction by clicking.'
    },
    infoWelcome: {
        ru: "Добро пожаловать!",
        en: "Welcome!"
    },
    info1: {
        ru: "Этот сайт является портфолио его автора и разработан, чтобы продемонстрировать анимационные навыки в Spine2D наиболее эффективным, простым и доступным способом.",
        en: "This website is a portfolio of its author and is designed to demonstrate skeletal animation skills in Spine2D in the most effective, simple, and accessible way."
    },
    info2: {
        ru: `Дизайн сайта основан на ${schaleDBLink}.`,
        en: `The website design is based on ${schaleDBLink}.`
    },
    info3: {
        ru: "Все неоригинальные ассеты использованы с разрешения их авторов, из открытых источников, где были размещены самими авторами, или после их приобретения в онлайн-магазине. Проекты с этими ассетами не используются в коммерческих целях, а служат исключительно для самообучения и демонстрации достижений в области анимации. Авторы ассетов указаны в меню 'About' каждого проекта.",
        en: "All non-original assets were taken either with authors permission, or from open sources posted by the authors themselves, or after purchase in a digital store. Projects using these assets are not used for commercial purposes, but are intended solely for self-study and demonstrating achievements in animation. The authors of the assets are listed in the projects' 'About'."
    }
};

const titles = {
    displaybar: {
        ru: "Тип отображения проектов",
        en: "Projects display type"
    },
    "switcher-interactive": {
        ru: "Показать только интерактивные проекты",
        en: "Show only interactable projects"
    },
    "github-link": {
        ru: "К репозиторию",
        en: "To repository"
    },
    "viewport-interaction-switch": {
        ru: "Переключить интерактивный режим",
        en: "Switch interactive mode"
    },
    "focus-button": {
        ru: "Фокусирование камеры",
        en: "Camera focus"
    }
};

let currentLang = localStorage.getItem("lang") || "en";
setLang(currentLang);

function setLang(lang) {
    currentLang = lang;
    localStorage.setItem("lang", lang);

    switch (lang) {
        case "en":
            document.querySelector(".lang-en").classList.add("active");
            document.querySelector(".lang-ru").classList.remove("active");
            break;
        case "ru":
            document.querySelector(".lang-ru").classList.add("active");
            document.querySelector(".lang-en").classList.remove("active");
            break;
        default:
            break;
    }

    updateTexts();
}

function updateTexts() {
    for (const key in translations) {
        const el = document.getElementById(key);
        if (el) el.innerHTML = translations[key][currentLang];
    }
    for (const key in titles) {
        const el = document.getElementById(key);
        if (el) el.title = titles[key][currentLang];
    }
}

document.addEventListener("DOMContentLoaded", updateTexts);