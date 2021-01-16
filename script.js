window.addEventListener('DOMContentLoaded', () => {
	// CONSTANTS
	localStorage.setItem('lang', 'ru')
	let lang = localStorage.getItem('lang')
	let TIMER_STATUS
	const MESSAGES = {
		years: {
			success: {
				en: 'Year',
				ru: 'Год'
			},
			error: {
				en: 'Oops',
				ru: 'Увы'
			},
			reset: '00'
		},
		months: {
			success: {
				en: 'Month',
				ru: 'Месяц'
			},
			error: {
				en: 'This time',
				ru: 'Это время'
			},
			reset: '00'
		},
		days: {
			success: {
				en: 'Days',
				ru: 'День'
			},
			error: {
				en: 'Will not return!',
				ru: 'Не вернуть!'
			},
			reset: '00'
		},
		hours: {
			success: {
				en: 'Hours',
				ru: 'Час'
			},
			error: {
				en: "Let's",
				ru: 'Пора'
			},
			reset: '00'
		},
		minutes: {
			success: {
				en: 'Minutes',
				ru: 'Минута'
			},
			error: {
				en: 'Move',
				ru: 'двигаться'
			},
			reset: '00'
		},
		seconds: {
			success: {
				en: 'Seconds',
				ru: 'Секунда'
			},
			error: {
				en: 'On!',
				ru: 'вперед!'
			},
			reset: '00'
		}
	}
	const STATUS_CODE = {
		success: 'success',
		error: 'error',
		reset: 'reset'
	}
	// ELEMENTS
	const timer = document.getElementById('timer'),
		years = timer.querySelector('#years'),
		months = timer.querySelector('#months'),
		days = timer.querySelector('#days'),
		hours = timer.querySelector('#hours'),
		minutes = timer.querySelector('#minutes'),
		seconds = timer.querySelector('#seconds'),
		resetBtns = document.querySelectorAll('.form__reset'),
		resetFullTimer = document.querySelector('.form__reset-btn'),
		languageChanger = document.querySelector('.language__changer'),
		languageOptions = document.querySelector('.language__variants'),
		languageVariants = languageOptions.querySelectorAll('ul li'),
		headerTitle = document.querySelector('header h1')

	// HELPER FUNCTIONS
	const addingZero = (number) => (number < 10 ? '0' + number : number)
	const setTextsToElems = (messageObject, statusCode, lang, additionalObj = {}) => {
		if (lang === 'en') {
			headerTitle.innerHTML = 'Time Tracker'
			if (statusCode === STATUS_CODE.success) {
				years.nextElementSibling.innerHTML = messageObject.years.success.en
				months.nextElementSibling.innerHTML = messageObject.months.success.en
				days.nextElementSibling.innerHTML = messageObject.days.success.en
				hours.nextElementSibling.innerHTML = messageObject.hours.success.en
				minutes.nextElementSibling.innerHTML = messageObject.minutes.success.en
				seconds.nextElementSibling.innerHTML = messageObject.seconds.success.en
			} else if (statusCode === STATUS_CODE.error) {
				years.nextElementSibling.innerHTML = messageObject.years.error.en
				months.nextElementSibling.innerHTML = messageObject.months.error.en
				days.nextElementSibling.innerHTML = messageObject.days.error.en
				hours.nextElementSibling.innerHTML = messageObject.hours.error.en
				minutes.nextElementSibling.innerHTML = messageObject.minutes.error.en
				seconds.nextElementSibling.innerHTML = messageObject.seconds.error.en
			} else if (statusCode === STATUS_CODE.reset) {
				years.innerHTML = messageObject.years.reset
				months.innerHTML = messageObject.months.reset
				days.innerHTML = messageObject.days.reset
				hours.innerHTML = messageObject.hours.reset
				minutes.innerHTML = messageObject.minutes.reset
				seconds.innerHTML = messageObject.seconds.reset
			} else {
				years.innerHTML = additionalObj.years
				months.innerHTML = additionalObj.months
				days.innerHTML = additionalObj.days
				hours.innerHTML = additionalObj.hours
				minutes.innerHTML = additionalObj.minutes
				seconds.innerHTML = additionalObj.seconds
			}
		} else if (lang === 'ru') {
			headerTitle.innerHTML = 'Tрекер Времени'
			if (statusCode === STATUS_CODE.success) {
				years.nextElementSibling.innerHTML = messageObject.years.success.ru
				months.nextElementSibling.innerHTML = messageObject.months.success.ru
				days.nextElementSibling.innerHTML = messageObject.days.success.ru
				hours.nextElementSibling.innerHTML = messageObject.hours.success.ru
				minutes.nextElementSibling.innerHTML = messageObject.minutes.success.ru
				seconds.nextElementSibling.innerHTML = messageObject.seconds.success.ru
			} else if (statusCode === STATUS_CODE.error) {
				years.nextElementSibling.innerHTML = messageObject.years.error.ru
				months.nextElementSibling.innerHTML = messageObject.months.error.ru
				days.nextElementSibling.innerHTML = messageObject.days.error.ru
				hours.nextElementSibling.innerHTML = messageObject.hours.error.ru
				minutes.nextElementSibling.innerHTML = messageObject.minutes.error.ru
				seconds.nextElementSibling.innerHTML = messageObject.seconds.error.ru
			} else if (statusCode === STATUS_CODE.reset) {
				years.innerHTML = messageObject.years.reset
				months.innerHTML = messageObject.months.reset
				days.innerHTML = messageObject.days.reset
				hours.innerHTML = messageObject.hours.reset
				minutes.innerHTML = messageObject.minutes.reset
				seconds.innerHTML = messageObject.seconds.reset
			} else {
				years.innerHTML = additionalObj.years
				months.innerHTML = additionalObj.months
				days.innerHTML = additionalObj.days
				hours.innerHTML = additionalObj.hours
				minutes.innerHTML = additionalObj.minutes
				seconds.innerHTML = additionalObj.seconds
			}
		}
	}

	const getTimerInterval = (endingTime) => {
		if (endingTime) {
			const total = +new Date(endingTime) - +new Date()

			// This function returns a couple of things
			return {
				// Total we will need below to stop the timer
				total,
				seconds: addingZero(Math.floor((total / 1000) % 60)),
				minutes: addingZero(Math.floor((total / (1000 * 60)) % 60)),
				hours: addingZero(Math.floor((total / (1000 * 60 * 60)) % 24)),
				days: addingZero(Math.floor((total / (1000 * 60 * 60 * 24)) % 30)),
				months: addingZero(Math.floor((total / (1000 * 60 * 60 * 24 * 30)) % 12)),
				years: addingZero(Math.floor(total / (1000 * 60 * 60 * 24 * 30 * 12)))
			}
		}
		// Total - is a difference between ending time and current time
	}
	const setTimerState = (messageObject, visible, statusCode, lang) => {
		TIMER_STATUS = statusCode
		setTextsToElems(messageObject, statusCode, lang)
		timer.classList.remove('timer_hidden')
		if (visible) {
			timer.classList.remove('timer_disable')
		} else {
			timer.classList.add('timer_disable')
		}
	}
	// Helper class
	class Timer {
		constructor(fn, time) {
			this.fn = fn
			this.time = time
			this.timerObj = setInterval(fn, time)
		}
		stop() {
			if (this.timerObj) {
				clearInterval(this.timerObj)
				this.timerObj = null
			}
			return this
		}
		start(inputValue) {
			if (!this.timerObj) {
				this.stop()
				this.timerObj = setInterval(() => this.fn(inputValue), this.time)
			}
			return this
		}
	}
	const timerF = new Timer(updateTimer, 1000)

	// CHECKING INPUTS VALUE
	const checkInputsValue = (value1, value2) => {
		// Four cases
		// 1. When user selected date but not time
		if (value1 && !value2) {
			localStorage.setItem('date', value1)
			if (+new Date(value1) > +new Date()) {
				setTimer(value1)
			} else {
				setTimer()
			}

			// 2. When user selected both date and time
		} else if (value1 && value2) {
			const summaryTime = `${value1}T${value2}:00`
			localStorage.setItem('date', value1)
			localStorage.setItem('time', value2)
			if (+new Date(summaryTime) > +new Date()) {
				setTimer(summaryTime)
			} else {
				setTimer()
			}

			// 3. When user selected time but not date
		} else if (!value1 && value2) {
			const ISOSDateTime = new Date().toISOString().slice(0, 10)
			const summaryTime = `${ISOSDateTime}T${value2}:00`
			localStorage.setItem('time', value2)
			if (+new Date(summaryTime) > +new Date()) {
				setTimer(summaryTime)
			} else {
				setTimer()
			}

			// 4. When user selected nothing
		}
	}

	// MAIN FUNCTIONS
	const form = document.forms.form
	const inputDate = form.elements.date
	const inputTime = form.elements.time

	// Funtions that updated timer every second
	function updateTimer(inputValue) {
		const info = getTimerInterval(inputValue)
		if (info) {
			setTextsToElems(null, null, lang, info)
			if (info.total <= 0) {
				timerF.stop()
				timer.classList.add('timer_disable')
				setTextsToElems(MESSAGES, STATUS_CODE.reset, lang)
			}
		}
	}
	// Setting interval
	const setTimer = (inputValue) => {
		timerF.stop()
		if (inputValue) {
			timerF.start(inputValue)
			setTimerState(MESSAGES, true, STATUS_CODE.success, lang)
		} else {
			setTimerState(MESSAGES, false, STATUS_CODE.error, lang)
		}
	}
	form.addEventListener('submit', (e) => {
		e.preventDefault()
		checkInputsValue(inputDate.value, inputTime.value)
		if (!inputDate.value && !inputTime.value) {
			timerF.stop()
			setTextsToElems(MESSAGES, STATUS_CODE.reset, lang)
			document.getElementById('tip').classList.add('fadeIn')
			setTimeout(() => {
				document.getElementById('tip').classList.remove('fadeIn')
			}, 2000)
		}
	})

	// RESET FORM INPUT
	resetBtns.forEach((btn) => {
		btn.addEventListener('click', () => {
			btn.nextElementSibling.value = ''
			localStorage.removeItem(btn.nextElementSibling.getAttribute('name'))
		})
	})

	resetFullTimer.addEventListener('click', () => {
		inputDate.value = ''
		inputTime.value = ''
		localStorage.removeItem('time')
		localStorage.removeItem('date')
		timerF.stop()
		setTextsToElems(MESSAGES, STATUS_CODE.reset, lang)
	})

	// SET LANGUAGE
	languageChanger.addEventListener('click', (e) => {
		languageOptions.classList.toggle('language__variants_visible')
	})
	languageVariants.forEach((option) => {
		option.addEventListener('click', () => {
			lang = option.getAttribute('data-lang')
			localStorage.setItem('lang', lang)
			languageOptions.classList.toggle('language__variants_visible')
			setTextsToElems(MESSAGES, TIMER_STATUS, lang)
		})
	})

	window.addEventListener('load', () => {
		inputDate.value = localStorage.getItem('date')
		inputTime.value = localStorage.getItem('time')
		checkInputsValue(inputDate.value, inputTime.value)
	})
})
