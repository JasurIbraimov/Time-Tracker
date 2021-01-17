window.addEventListener('DOMContentLoaded', () => {
	// CONSTANTS
	const MESSAGES = {
		years: {
			success: 'Years',
			error: 'Oops',
			reset: '00'
		},
		months: {
			success: 'Months',
			error: 'This time',
			reset: '00'
		},
		days: {
			success: 'Days',
			error: 'Will not return!',
			reset: '00'
		},
		hours: {
			success: 'Hours',
			error: "Let's",
			reset: '00'
		},
		minutes: {
			success: 'Minutes',
			error: "Move",
			reset: '00'
		},
		seconds: {
			success: 'Seconds',
			error: 'On!',
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
		startTimerBtn = document.getElementById('timerBtn') 

	// HELPER FUNCTIONS
	const addingZero = (number) => (number < 10 ? '0' + number : number)
	const setTextsToElems = (messageObject, statusCode, additionalObj = {}) => {
			if (statusCode === STATUS_CODE.success) {
				years.nextElementSibling.innerHTML = messageObject.years.success
				months.nextElementSibling.innerHTML = messageObject.months.success
				days.nextElementSibling.innerHTML = messageObject.days.success
				hours.nextElementSibling.innerHTML = messageObject.hours.success
				minutes.nextElementSibling.innerHTML = messageObject.minutes.success
				seconds.nextElementSibling.innerHTML = messageObject.seconds.success
			} else if (statusCode === STATUS_CODE.error) {
				years.nextElementSibling.innerHTML = messageObject.years.error
				months.nextElementSibling.innerHTML = messageObject.months.error
				days.nextElementSibling.innerHTML = messageObject.days.error
				hours.nextElementSibling.innerHTML = messageObject.hours.error
				minutes.nextElementSibling.innerHTML = messageObject.minutes.error
				seconds.nextElementSibling.innerHTML = messageObject.seconds.error
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
	const setTimerState = (messageObject, visible, statusCode) => {
		setTextsToElems(messageObject, statusCode)
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
			setTextsToElems(null, null, info)
			if (info.total <= 0) {
				timerF.stop()
				timer.classList.add('timer_disable')
				setTextsToElems(MESSAGES, STATUS_CODE.reset)
			}
		}
	}
	// Setting interval
	const setTimer = (inputValue) => {
		timerF.stop()
		if (inputValue) {
			timerF.start(inputValue)
			setTimerState(MESSAGES, true, STATUS_CODE.success)
		} else {
			setTimerState(MESSAGES, false, STATUS_CODE.error)
		}
	}
	startTimerBtn.addEventListener('click', () => {
		checkInputsValue(inputDate.value, inputTime.value)
		if (!inputDate.value && !inputTime.value) {
			timerF.stop()
			setTextsToElems(MESSAGES, STATUS_CODE.reset)
			tip.classList.add('fadeIn')
			setTimeout(() => {
				tip.classList.remove('fadeIn')
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
		setTextsToElems(MESSAGES, STATUS_CODE.reset)
	})

	window.addEventListener('load', () => {
		inputDate.value = localStorage.getItem('date')
		inputTime.value = localStorage.getItem('time')
		checkInputsValue(inputDate.value, inputTime.value)
	})
})
