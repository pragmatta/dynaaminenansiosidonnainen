const DEFAULT_SALARY = 600
const DEFAULT_BENEFIT = 560
const BENEFIT_ACCUMULATION_INTERVAL = 11
const BENEFIT_PAYBACK_RATE = 0.5
const BENEFIT_PAYBACK_LIMIT = DEFAULT_BENEFIT/BENEFIT_PAYBACK_RATE
const DEFAULT_WORK_MONTHS = 12
const REVENUE_COLOR = { FILL: 'rgba(38, 208, 124, 0.4)', STROKE: 'rgba(38, 208, 124, 1)' }
const BENEFIT_COLOR = { FILL: 'rgba(58, 93, 174, 0.4)', STROKE: 'rgba(58, 93, 174, 1)' }
const PREDICTION_COLOR = { FILL: 'rgba(58, 93, 174, 0.2)', STROKE: 'rgba(58, 93, 174, 1)' }
const WITHDRAWAL_COLOR = { FILL: 'rgba(68, 0, 153, 0.4)', STROKE: 'rgba(68, 0, 153, 1)' }
const REVENUE_PRESETS = { 
	a: {min:0, max:0}, 
	b: {min:100, max:200}, 
	c: {min:200, max:400}, 
	d: {min:400, max:600}, 
	e: {min:600, max:800}, 
	f: {min:800, max:1200}, 
	g: {min:1200, max:1600}, 
	h: {min:1600, max:2000}, 
	i: {min:2000, max:2500},
	// j: {min:2000, max:2000},
	// k: {min:2200, max:2200},
	// l: {min:2400, max:2400},
}

function _sumInterval(arr, start_index, interval_length) {
	var sum = 0
	for (var i=start_index; i<start_index+interval_length; i++)
		if ((i>=0) && arr[i])
			sum += arr[i]
	return sum
}

function _averageInterval(arr, start_index, interval_length) {
	return _sumInterval(arr, start_index, interval_length)/interval_length
}

function _getRandomValue(min_val, max_val) {
	return Math.floor(Math.random()*(max_val-min_val+1))+min_val
}

function _getElementValue(input_id, default_value) {
	var _element = document.getElementById(input_id)
	if (_element) 
		return _element.value || default_value
	else
		return default_value
}

function _getElementIntValue(input_id, default_value) {
	return parseInt(_getElementValue(input_id, default_value)) || default_value
}

function _addElementClass(input_id, value) {
	var _element = document.getElementById(input_id)
	if (_element) 
		_element.classList.add(value)
}

function _removeElementClass(input_id, value) {
	var _element = document.getElementById(input_id)
	if (_element) 
		_element.classList.remove(value)
}

function _setElementValue(input_id, value) {
	var _element = document.getElementById(input_id)
	if (_element) 
		_element.value = value
}

function _getElementTextContent(input_id, default_content) {
	var _element = document.getElementById(input_id)
	if (_element) 
		return _element.textContent || default_content
	else
		return default_content
}

function _setElementTextContent(input_id, content) {
	var _element = document.getElementById(input_id)
	if (_element) 
		_element.textContent = content
}

function _printMonth(delta_month) {
	var d = new Date()
	var m = d.getMonth()
	var y = d.getYear() + 1900
	if (delta_month < 0 && -delta_month > m) {
		return (12 + 1 + m + delta_month).toString() + "/" + (y-1).toString()
	} else if (delta_month >= 0 && delta_month + m >= 12) {
		return (m + delta_month - 12 + 1).toString() + "/" + (y+1).toString()
	} else {
		return (m + delta_month + 1).toString() + "/" + (y).toString()
	}
}

function _onload() {
	var ctx = document.getElementById("dbi_chart").getContext('2d');
	window._dbi_revenues = []
	window._dbi_benefits = []
	window._dbi_predictions = []
	window._dbi_withdrawals = []
	window._dbi_months = []
	window._dbi_chart = new Chart(ctx, {
	    type: 'line',
	    data: {
	        // labels: ["0e/kk", "500e/kk", "1000e/kk", "1500e/kk", "2000e/kk", "2500e/kk", "3000e/kk", "3500e/kk", "4000e/kk", "4500e/kk", "5000e/kk", "5500e/kk", "6000e/kk", "6500e/kk", "7000e/kk", "7500e/kk", "8000e/kk"],//window._dbi_months,
	        labels: window._dbi_months,
	        datasets: [
	        	// TULONSIIRTONEUTRAALI
				// { label: "Tulonsiirto perustulossa", data: [560, 390, 220, 105, 50, 5, -5, -10, -20, -50, -85, -110, -140, -165, -160, -150], borderWidth: 1, backgroundColor: BENEFIT_COLOR.FILL, borderColor: BENEFIT_COLOR.STROKE },

	        	// KUSTANNUSNEUTRAALI
				// { label: "Dynaaminen AS", data: window._dbi_benefits, borderWidth: 1, backgroundColor: BENEFIT_COLOR.FILL, borderColor: BENEFIT_COLOR.STROKE },
				// { label: "Ansiot", yAxisID: 'line-stacked', data: window._dbi_revenues, borderWidth: 1, backgroundColor: REVENUE_COLOR.FILL, borderColor: REVENUE_COLOR.STROKE },
				// { label: "Perinteinen AS", yAxisID: 'line-stacked', data: window._dbi_withdrawals, fill: 1, borderWidth: 1, backgroundColor: WITHDRAWAL_COLOR.FILL, borderColor: WITHDRAWAL_COLOR.STROKE },

	        	// DEMO
				// { label: "Ansiosidonnainen", data: window._dbi_benefits, borderWidth: 1, backgroundColor: BENEFIT_COLOR.FILL, borderColor: BENEFIT_COLOR.STROKE },
				// { label: "Ansiot", yAxisID: 'line-stacked', data: window._dbi_revenues, borderWidth: 1, backgroundColor: REVENUE_COLOR.FILL, borderColor: REVENUE_COLOR.STROKE },
				// { label: "Tuki", yAxisID: 'line-stacked', data: window._dbi_withdrawals, fill: 1, borderWidth: 1, backgroundColor: WITHDRAWAL_COLOR.FILL, borderColor: WITHDRAWAL_COLOR.STROKE },

				// NORMAL
				{ label: _getElementValue("dbi_chart_title_benefit"), data: window._dbi_benefits, borderWidth: 1, backgroundColor: BENEFIT_COLOR.FILL, borderColor: BENEFIT_COLOR.STROKE },
				{ label: _getElementValue("dbi_chart_title_prediction"), data: window._dbi_predictions, fill: 0, borderWidth: 1, backgroundColor: PREDICTION_COLOR.FILL, borderColor: PREDICTION_COLOR.STROKE },
				{ label: _getElementValue("dbi_chart_title_revenue"), yAxisID: 'line-stacked', data: window._dbi_revenues, borderWidth: 1, backgroundColor: REVENUE_COLOR.FILL, borderColor: REVENUE_COLOR.STROKE },
				{ label: _getElementValue("dbi_chart_title_withdrawal"), yAxisID: 'line-stacked', data: window._dbi_withdrawals, fill: 2, borderWidth: 1, backgroundColor: WITHDRAWAL_COLOR.FILL, borderColor: WITHDRAWAL_COLOR.STROKE },
	        ]
	    },
	    options: {
	    	responsive: true,
	    	animation: {
	    		duration: 1400,
	    	},
	        scales: {
	            yAxes: [
	            	{
		            	id: 'line-normal',
		            	stacked: false,
						ticks: {
							beginAtZero: true,
							min: 0,
							max: 1000
						},	            	
	            	},
	            	{
		            	id: 'line-stacked',
		            	stacked: true,
		            	display: false,
						ticks: {
							beginAtZero: true,
							min: 0,
							max: 1000
						},	            	
					}
	            ]
	        },
	    }
	});
	_setElementValue("dbi_work_months", DEFAULT_WORK_MONTHS)
	_setElementValue("dbi_revenue_preset", "c")
	revenuePresetUpdate()

	dataReset()
	//setTimeout(predictionsUpdate, 0)
}

function dataReset() {
	dataInitialize()
	predictionsUpdate()
	revenueSliderReset()
	benefitSliderReset()
	chartUpdate()
}

function dataInitialize() {
	var ansiokuukaudet = _getElementIntValue("dbi_work_months", DEFAULT_WORK_MONTHS)
	var min_ansio = _getElementIntValue("dbi_revenue_min", DEFAULT_SALARY)
	var max_ansio = _getElementIntValue("dbi_revenue_max", DEFAULT_SALARY)
	for (var i=0; i<=2*BENEFIT_ACCUMULATION_INTERVAL; i++) {
		window._dbi_months[i] = _printMonth(i-BENEFIT_ACCUMULATION_INTERVAL)
		if (i < ansiokuukaudet) {
			window._dbi_withdrawals[i] = 0
			window._dbi_revenues[i] = _getRandomValue(min_ansio, max_ansio)
		} else {
			window._dbi_withdrawals[i] = 0
			window._dbi_revenues[i] = 0
		}
		if (i==0) {
			window._dbi_benefits[i] = DEFAULT_BENEFIT
		} else if (i <= ansiokuukaudet) {
			window._dbi_benefits[i] = benefitCalculateNext(window._dbi_revenues, window._dbi_benefits, i-1, 0)
		} else {
			window._dbi_benefits[i] = benefitCalculateNext(window._dbi_revenues, window._dbi_benefits, i-1, window._dbi_benefits[i-1])
		}		
		chartUpdate()
	}	
	var i=2*BENEFIT_ACCUMULATION_INTERVAL+1
	var j=window._dbi_month_max - i + 1
	if (j > 0) {
		window._dbi_revenues.splice(i, j)
		window._dbi_benefits.splice(i, j)
		window._dbi_predictions.splice(i, j)
		window._dbi_withdrawals.splice(i, j)
		window._dbi_months.splice(i, j)
	}
	window._dbi_month_current = DEFAULT_WORK_MONTHS
	window._dbi_month_max = 2*BENEFIT_ACCUMULATION_INTERVAL
}

function chartUpdate() {
	var max_value = 0
	for (var i=0; i<=window._dbi_month_max; i++) {
		max_value = Math.max(max_value, window._dbi_benefits[i] || 0)
		max_value = Math.max(max_value, window._dbi_predictions[i] || 0)
		max_value = Math.max(max_value, (window._dbi_revenues[i] || 0) + (window._dbi_withdrawals[i] || 0))
	}
	max_value = Math.floor((max_value*1.1)/100)*100
	window._dbi_chart.options.scales.yAxes[0].ticks.max = max_value
	window._dbi_chart.options.scales.yAxes[1].ticks.max = max_value
	window._dbi_chart.update()
}


function revenuePresetUpdate() {
	var selection = _getElementValue("dbi_revenue_preset", "a")
	var preset = REVENUE_PRESETS[selection]
	_setElementValue("dbi_revenue_min", preset.min)
	_setElementValue("dbi_revenue_max", preset.max)
	_setElementValue("dbi_revenue_average", (preset.min + preset.max)/2)
	_setElementValue("dbi_revenue_variance", (preset.max - preset.min))
	dataReset()
}

function revenueSettingsUpdate() {
	var keskiarvio = _getElementIntValue("dbi_revenue_average", DEFAULT_SALARY)
	var vaihteluvali = _getElementIntValue("dbi_revenue_variance", 0)
	_setElementValue("dbi_revenue_average", keskiarvio)
	_setElementValue("dbi_revenue_variance", vaihteluvali)
	_setElementValue("dbi_revenue_min", Math.max(keskiarvio - vaihteluvali, 0))
	_setElementValue("dbi_revenue_max", keskiarvio + vaihteluvali)
}

function benefitSliderReset() {
	_setElementValue("dbi_benefit_slider", 0)
	benefitUpdateSliderValue()
}
/*
function benefitCalculateNext(revenues, benefits, current_index, withdrawal) {
	var benefit = benefits[current_index] || 0
	var previous_benefit = benefits[current_index-1] || 0
	var revenue = revenues[current_index] || 0
	if (revenue < DEFAULT_BENEFIT/BENEFIT_PAYBACK_RATE){
		var leftover_benefit = (benefit-DEFAULT_BENEFIT)*(BENEFIT_ACCUMULATION_INTERVAL-1)/BENEFIT_ACCUMULATION_INTERVAL
		var revenue_payback = revenue*BENEFIT_PAYBACK_RATE/BENEFIT_ACCUMULATION_INTERVAL
		var unpaid_withdrawal = withdrawal*(1-BENEFIT_PAYBACK_RATE)/BENEFIT_ACCUMULATION_INTERVAL
		return DEFAULT_BENEFIT + Math.max(0, Math.round(leftover_benefit + Math.max(0, revenue_payback - unpaid_withdrawal)))
	} else {
		return Math.min(revenue, Math.round((benefit*(BENEFIT_ACCUMULATION_INTERVAL-1)*1.038 + revenue - withdrawal)/BENEFIT_ACCUMULATION_INTERVAL))
	}
}

function benefitCalculateNext(revenues, benefits, current_index, withdrawal) {
	var benefit = benefits[current_index] || 0
	var previous_benefit = benefits[current_index-1] || 0
	var revenue = revenues[current_index] || 0
	var benefit_extra = 0
	if (revenue > BENEFIT_PAYBACK_LIMIT) {
		benefit_extra = revenue - BENEFIT_PAYBACK_LIMIT
		revenue = BENEFIT_PAYBACK_LIMIT
		benefit_extra = Math.min(benefit_extra, Math.round((benefit*(BENEFIT_ACCUMULATION_INTERVAL-1)*1.038 + benefit_extra - (withdrawal))/BENEFIT_ACCUMULATION_INTERVAL))
	}
	var leftover_benefit = (benefit-DEFAULT_BENEFIT)*(BENEFIT_ACCUMULATION_INTERVAL-1)/BENEFIT_ACCUMULATION_INTERVAL
	var revenue_payback = revenue*BENEFIT_PAYBACK_RATE/BENEFIT_ACCUMULATION_INTERVAL
	var unpaid_withdrawal = withdrawal*(1-BENEFIT_PAYBACK_RATE)/BENEFIT_ACCUMULATION_INTERVAL
	var benefit_base = DEFAULT_BENEFIT + Math.max(0, Math.round(leftover_benefit + Math.max(0, revenue_payback - unpaid_withdrawal)))
	benefit_base = Math.min(BENEFIT_PAYBACK_LIMIT, benefit_base)
	return benefit_base + benefit_extra
}
*/

function benefitCalculateNext(revenues, benefits, current_index, withdrawal) {
	var benefit = benefits[current_index] || 0
	var previous_benefit = benefits[current_index-1] || 0
	var revenue = revenues[current_index] || 0
	if (revenue < DEFAULT_BENEFIT/BENEFIT_PAYBACK_RATE){
		var leftover_benefit = (benefit-DEFAULT_BENEFIT)*(BENEFIT_ACCUMULATION_INTERVAL-1)/BENEFIT_ACCUMULATION_INTERVAL
		var revenue_payback = revenue*BENEFIT_PAYBACK_RATE/BENEFIT_ACCUMULATION_INTERVAL
		var unpaid_withdrawal = withdrawal*(1-BENEFIT_PAYBACK_RATE)/BENEFIT_ACCUMULATION_INTERVAL
		return DEFAULT_BENEFIT + Math.max(0, Math.round(leftover_benefit + Math.max(0, revenue_payback - unpaid_withdrawal)))
	} else {
		return Math.round(Math.min(revenue, (benefit*(BENEFIT_ACCUMULATION_INTERVAL-1)*1.038 + revenue - withdrawal)/BENEFIT_ACCUMULATION_INTERVAL))
	}
}

function benefitUpdateSliderValue() {
	predictionsUpdate()
	window._dbi_withdrawals[window._dbi_month_current] = benefitGetCurrentWithdrawal()
	var next_delta = predictionsGetNext() - benefitGetNext()
	var total_delta = predictionsGetTotal() - benefitGetTotal()
	if (total_delta >= 0) {
		_removeElementClass("dbi_benefit_change_month_increase", "dbi_hidden")
		_addElementClass("dbi_benefit_change_month_decrease", "dbi_hidden")
		_removeElementClass("dbi_benefit_change_total_increase", "dbi_hidden")
		_addElementClass("dbi_benefit_change_total_decrease", "dbi_hidden")
	} else {
		_addElementClass("dbi_benefit_change_month_increase", "dbi_hidden")
		_removeElementClass("dbi_benefit_change_month_decrease", "dbi_hidden")
		_addElementClass("dbi_benefit_change_total_increase", "dbi_hidden")
		_removeElementClass("dbi_benefit_change_total_decrease", "dbi_hidden")
	}

	_setElementTextContent("dbi_benefit_slider_value", window._dbi_withdrawals[window._dbi_month_current])
	_setElementTextContent("dbi_benefit_change_month_value", (next_delta))
	_setElementTextContent("dbi_benefit_change_total_value", (total_delta))
	_setElementTextContent("dbi_benefit_slider_max", benefitGetCurrentlyAvailable())

	chartUpdate()
}

function benefitGetCurrentlyAvailable() {
	return benefitGetAvailable(window._dbi_month_current)
}

function benefitGetAvailable(month) {
	var benefit = window._dbi_benefits[month]
	var revenue = window._dbi_revenues[month]
	if (revenue < DEFAULT_BENEFIT/BENEFIT_PAYBACK_RATE)
		return Math.round(Math.max(0, DEFAULT_BENEFIT - revenue*BENEFIT_PAYBACK_RATE)/DEFAULT_BENEFIT*benefit)
	else
		return 0
}

function benefitGetCurrentWithdrawal() {
	return Math.round(_getElementIntValue("dbi_benefit_slider", 0)*benefitGetCurrentlyAvailable()/100)
}

function benefitGetNext() {
	return window._dbi_benefits[window._dbi_month_current+1]
}

function benefitGetTotal() {
	var sum = 0
	for (var i=window._dbi_month_current+1; i<=window._dbi_month_max; i++)
		sum += window._dbi_benefits[i]
	return sum
}
function benefitCollect() {
	for (var i=window._dbi_month_current+1; i<=window._dbi_month_max; i++)
		window._dbi_benefits[i] = window._dbi_predictions[i]
	window._dbi_predictions[window._dbi_month_current] = null
	window._dbi_withdrawals[window._dbi_month_current] = benefitGetCurrentWithdrawal()

	window._dbi_month_current = window._dbi_month_current + 1
	if (window._dbi_month_current == window._dbi_month_max) {
		window._dbi_month_max = window._dbi_month_max + 1
		window._dbi_months[window._dbi_month_max] = _printMonth(window._dbi_month_max-BENEFIT_ACCUMULATION_INTERVAL)
		window._dbi_revenues[window._dbi_month_max] = 0
		window._dbi_withdrawals[window._dbi_month_max] = 0
		window._dbi_benefits[window._dbi_month_max] = benefitCalculateNext(window._dbi_revenues, window._dbi_benefits, window._dbi_month_max-1, window._dbi_benefits[window._dbi_month_max-1])
		window._dbi_predictions[window._dbi_month_max] = benefitCalculateNext(window._dbi_revenues, window._dbi_predictions, window._dbi_month_max-1, window._dbi_predictions[window._dbi_month_max-1])
	}

	revenueUpdateSliderValue()

	// benefitDemo()
}
function benefitDemo() {
	setTimeout(
		function() {
			if (window._dbi_month_current == BENEFIT_ACCUMULATION_INTERVAL+1) {
				_setElementValue("dbi_revenue_slider", 0)
				_setElementValue("dbi_benefit_slider", 100)
				revenueUpdateSliderValue()
				benefitUpdateSliderValue()
			}
			if (window._dbi_month_current <= 2*BENEFIT_ACCUMULATION_INTERVAL)
				benefitCollect()
		}, 800)
}
function predictionsUpdate() {
	var withdrawal = benefitGetCurrentWithdrawal()
	window._dbi_predictions[window._dbi_month_current] = window._dbi_benefits[window._dbi_month_current]
	for (var i=window._dbi_month_current+1; i<=window._dbi_month_max; i++) {
		window._dbi_predictions[i] = benefitCalculateNext(window._dbi_revenues, window._dbi_predictions, i-1, withdrawal)
		withdrawal = window._dbi_predictions[i]
	}
}

function predictionsGetNext() {
	return window._dbi_predictions[window._dbi_month_current+1]
}

function predictionsGetTotal() {
	var sum = 0
	for (var i=window._dbi_month_current+1; i<=window._dbi_month_max; i++)
		sum += window._dbi_predictions[i]
	return sum
}

function revenueSliderReset() {
	var revenue = revenueGetCurrentlyAvailable()
	_setElementValue("dbi_revenue_slider", 100)
	_setElementTextContent("dbi_revenue_slider_max", revenue)
	revenueUpdateSliderValue()
}


function revenueUpdateSliderValue() {
	var revenue = Math.round(_getElementIntValue("dbi_revenue_slider", 0)*revenueGetCurrentlyAvailable()/100)
	window._dbi_revenues[window._dbi_month_current] = revenue
	_setElementTextContent("dbi_revenue_slider_value", revenue)

	benefitUpdateSliderValue()
}

function revenueGetCurrentlyAvailable() {
	return _getElementIntValue("dbi_revenue_max")
}

function revenueGetCurrent() {
	window._dbi_revenues[window._dbi_month_current]
}

