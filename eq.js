window.onload = function () {
	"use strict";

	let config = {
		frequencyCount: 512, // 
		fftSize: 2048, // default value
		fidelity: 100, // higher number means more detail in EQ
		peakDecay: 400, // time to delay before resetting peak
		peakFallRate: 5, // rate at which peak descends after decay
		peakFadeRate: .1, // rate at which peak fades after decay
		bars: [
			{ frequency: 25, peak: 0, label: '25 Hz' },
			{ frequency: 45, peak: 0, label: '45 Hz' },
			{ frequency: 65, peak: 0, label: '66 Hz' },
			{ frequency: 100, peak: 0, label: '100 Hz' },
			{ frequency: 160, peak: 0, label: '160 Hz' },
			{ frequency: 250, peak: 0, label: '250 Hz' },
			{ frequency: 400, peak: 0, label: '400 Hz' },
			{ frequency: 630, peak: 0, label: '630 Hz' },
			{ frequency: 1000, peak: 0, label: '1 KHz' },
			{ frequency: 1600, peak: 0, label: '1.6 KHz' },
			{ frequency: 2500, peak: 0, label: '2.5 KHz' },
			{ frequency: 6300, peak: 0, label: '6.3 KHz' },
			{ frequency: 10000, peak: 0, label: '10 KHz' },
			{ frequency: 16000, peak: 0, label: '16 KHz' }
		]
	}
	let eq;

	const soundAllowed = (stream) => {

		let audio = createAudioStream(stream);
		const frequencyArray = new Uint8Array(audio.analyser.frequencyBinCount);

		eq = {
			frequencyArray,
			run: drawEq,
			...audio,
			...paintUI()
		};

		// console.log(eq);
		eq.run();
	}

	const createAudioStream = (stream) => {
		const audioContent = new AudioContext();
		const audioStream = audioContent.createMediaStreamSource(stream);
		const analyser = audioContent.createAnalyser();
		let range = audioStream.context.sampleRate / 2 / analyser.frequencyBinCount;
		audioStream.connect(analyser);
		analyser.fftSize = config.fftSize;
		window.persistAudioStream = stream;
		return { analyser, range };
	}

	const paintUI = () => {
		const visualizer = document.getElementById('visualizer');
		const barsEl = visualizer.getElementById('eq-bars');
		const peaksEl = visualizer.getElementById('eq-peaks');
		const labelsEl = visualizer.getElementById('eq-labels');
		let size = config.bars.length * config.fidelity;
		let eqPath, peakPath, label;

		visualizer.setAttribute('viewBox', `0 0 ${size} ${size}`);

		for (let i = 0, max = config.bars.length; i < max; i++) {
			eqPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			eqPath.setAttribute('stroke-width', config.fidelity * .9);
			eqPath.setAttribute('stroke-dasharray', `${config.fidelity * .9}, ${config.fidelity * .1}`);
			barsEl.appendChild(eqPath);

			peakPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			peakPath.setAttribute('stroke-width', config.fidelity * .9);
			peaksEl.appendChild(peakPath);

			label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
			label.setAttribute('x', (i * config.fidelity) + (config.fidelity / 2));
			label.setAttribute('y', (config.bars.length * config.fidelity) - 10);
			label.setAttribute('class', '.label');
			label.textContent = config.bars[i].label;
			labelsEl.appendChild(label);
		}

		return {
			eqContainer: barsEl.getElementsByTagName('path'),
			peakContainer: peaksEl.getElementsByTagName('path')
		}
	}

	const drawEq = () => {
		requestAnimationFrame(drawEq);

		eq.analyser.getByteFrequencyData(eq.frequencyArray);
		// eq.frequencyArray = [45, 211, 87, 167, 67, 34, 134, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 165, 134, 134, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 165, 134, 134, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 165, 134, 134, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 165, 134, 134, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 165, 134, 134, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165];
		const now = new moment();
		config.bars.map(drawBar.bind(null, now));
	}

	const drawBar = (now, bar, idx) => {
		const frequencies = eq.frequencyArray.filter(filterFrequencies.bind(null, config.bars, idx));
		bar.value = frequencies.length ? frequencies.reduce(averageFrequency.bind(null, frequencies.length)) : 0;
		if (bar.value > bar.peak) {
			bar.peak = bar.value;
			bar.opacity = 1;
			bar.decay = new moment();
		} else if (moment.duration(now.diff(bar.decay)) > config.peakDecay) {
			bar.peak = bar.peak - config.peakFallRate;
			bar.opacity = bar.opacity - config.peakFadeRate;
		}
		eq.eqContainer[idx].setAttribute('d', getEQLine(idx, bar.value));
		eq.peakContainer[idx].setAttribute('d', getPeakLine(idx, bar.peak, bar.opacity));
		eq.peakContainer[idx].setAttribute('style', `opacity: ${bar.opacity}`);
	}

	const getEQLine = (idx, val) => {
		const x = (idx * config.fidelity) + (config.fidelity / 2);
		const y = config.bars.length * config.fidelity;
		const h = calculateLineLength(val);
		return `M ${x},${y} L ${x},${h}`;
	}

	const getPeakLine = (idx, val) => {
		const x = (idx * config.fidelity) + (config.fidelity / 2);
		const y = calculateLineLength(val);
		const h = y - config.fidelity * .2;
		return `M ${x},${y} L ${x},${h}`;
	}

	const averageFrequency = (len, acc, val) => acc + val / len;

	const filterFrequencies = (bars, barIdx, data, idx) => {
		const min = barIdx === 0 ? barIdx : bars[barIdx - 1].frequency;
		const max = bars[barIdx].frequency;
		const currentFrequency = idx * eq.range;
		return (currentFrequency >= min && currentFrequency < max);
	}

	const calculateLineLength = (val) => parseInt((config.bars.length * config.fidelity) - (val * config.bars.length * config.fidelity / config.frequencyCount), 10);

	const soundNotAllowed = function (error) {
		console.log(error);
	}

	navigator.getUserMedia({ audio: true }, soundAllowed, soundNotAllowed);

};