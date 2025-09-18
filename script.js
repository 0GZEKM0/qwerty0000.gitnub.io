// Глобальные переменные
let updateInterval = 1000; // 1 секунда по умолчанию
let stopwatchRunning = false;
let stopwatchStartTime = 0;
let stopwatchPausedTime = 0;
let stopwatchInterval;
let customTime = null;
let customDate = null;
let customSeconds = 0;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Установка User-Agent
    document.getElementById('user-agent').textContent = navigator.userAgent;
    
    // Запуск обновления времени
    updateAllDisplays();
    
    // Установка обработчиков событий для слайдера
    const slider = document.getElementById('interval-slider');
    slider.addEventListener('input', function() {
        document.getElementById('interval-value').textContent = this.value;
    });
});

// Обновление всех отображений
function updateAllDisplays() {
    updateTime();
    updateDate();
    updateSeconds();
    updateLastUpdateTime();
    
    setTimeout(updateAllDisplays, updateInterval);
}

// Обновление времени
function updateTime() {
    const now = customTime || new Date();
    const timeElement = document.getElementById('current-time');
    
    if (customTime) {
        // Используем пользовательское время
        const timeWithOffset = new Date(customTime.getTime() + (Date.now() - stopwatchStartTime));
        timeElement.textContent = timeWithOffset.toLocaleTimeString('ru-RU');
    } else {
        // Используем реальное время
        timeElement.textContent = now.toLocaleTimeString('ru-RU');
    }
    
    timeElement.classList.add('pulse');
    setTimeout(() => timeElement.classList.remove('pulse'), 500);
}

// Обновление даты
function updateDate() {
    const now = customDate || new Date();
    const dateElement = document.getElementById('current-date');
    
    dateElement.textContent = now.toLocaleDateString('ru-RU');
    dateElement.classList.add('pulse');
    setTimeout(() => dateElement.classList.remove('pulse'), 500);
}

// Обновление секундомера
function updateSeconds() {
    const secondsElement = document.getElementById('seconds-counter');
    
    if (stopwatchRunning) {
        const elapsed = Math.floor((Date.now() - stopwatchStartTime) / 1000) + customSeconds;
        secondsElement.textContent = elapsed.toLocaleString('ru-RU');
    } else {
        secondsElement.textContent = customSeconds.toLocaleString('ru-RU');
    }
    
    secondsElement.classList.add('pulse');
    setTimeout(() => secondsElement.classList.remove('pulse'), 500);
}

// Обновление времени последнего обновления
function updateLastUpdateTime() {
    const updateElement = document.getElementById('last-update');
    updateElement.textContent = new Date().toLocaleTimeString('ru-RU');
}

// Управление секундомером
function startStopwatch() {
    if (!stopwatchRunning) {
        stopwatchRunning = true;
        stopwatchStartTime = Date.now() - (customSeconds * 1000);
        document.getElementById('status').textContent = '🟢 Секундомер запущен';
    }
}

function pauseStopwatch() {
    if (stopwatchRunning) {
        stopwatchRunning = false;
        customSeconds = Math.floor((Date.now() - stopwatchStartTime) / 1000) + customSeconds;
        document.getElementById('status').textContent = '⏸️ Секундомер на паузе';
    }
}

function resetStopwatch() {
    stopwatchRunning = false;
    customSeconds = 0;
    stopwatchStartTime = Date.now();
    document.getElementById('status').textContent = '🔄 Секундомер сброшен';
    setTimeout(() => {
        document.getElementById('status').textContent = '🟢 Онлайн';
    }, 2000);
}

// Управление отображением
function toggleDisplay(type) {
    const sections = {
        time: document.getElementById('time-card').parentElement,
        date: document.getElementById('date-card').parentElement,
        seconds: document.getElementById('seconds-card').parentElement
    };

    // Сброс всех кнопок
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Установка активной кнопки
    event.target.classList.add('active');

    // Управление видимостью
    if (type === 'all') {
        Object.values(sections).forEach(section => {
            section.classList.remove('hidden');
        });
    } else {
        Object.entries(sections).forEach(([key, section]) => {
            if (key === type) {
                section.classList.remove('hidden');
            } else {
                section.classList.add('hidden');
            }
        });
    }
}

// Обновление интервала обновления
function updateInterval(value) {
    updateInterval = value * 1000; // Конвертация в миллисекунды
    document.getElementById('interval-value').textContent = value;
}

// Пользовательские настройки
function setCustomTime() {
    const timeInput = document.getElementById('custom-time').value;
    if (timeInput) {
        const [hours, minutes] = timeInput.split(':');
        const now = new Date();
        customTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
        document.getElementById('status').textContent = '✅ Пользовательское время установлено';
    }
}

function setCustomDate() {
    const dateInput = document.getElementById('custom-date').value;
    if (dateInput) {
        customDate = new Date(dateInput);
        document.getElementById('status').textContent = '✅ Пользовательская дата установлена';
    }
}

function setCustomSeconds() {
    const secondsInput = parseInt(document.getElementById('custom-seconds').value);
    if (!isNaN(secondsInput)) {
        customSeconds = secondsInput;
        document.getElementById('status').textContent = '✅ Счетчик секунд установлен';
    }
}

// Авто-обновление статуса
setInterval(() => {
    if (document.getElementById('status').textContent !== '🟢 Онлайн') {
        setTimeout(() => {
            document.getElementById('status').textContent = '🟢 Онлайн';
        }, 3000);
    }
}, 5000);

// Обработка видимости страницы
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        document.getElementById('status').textContent = '⏸️ Страница неактивна';
    } else {
        document.getElementById('status').textContent = '🟢 Онлайн';
    }
});