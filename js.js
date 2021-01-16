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
			value1 = ISOSDateTime
		} else {
			setTimer()
		}

		// 4. When user selected nothing
	} else {
		timerF.stop()
		setTextsToElems(MESSAGES, STATUS_CODE.reset)
		document.getElementById('tip').classList.add('fadeIn')
		setTimeout(() => {
			document.getElementById('tip').classList.remove('fadeIn')
		}, 3000)
	}
}
