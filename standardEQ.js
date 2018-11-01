import { getFrequenciesByRange } from './audioUtils.js';

const defaultConfig = {
	frequencyCount: 512, // 
	fidelity: 100, // higher number means more detail in EQ
	peakDecay: 400, // time to delay before resetting peak
	peakFallRate: 5, // rate at which peak descends after decay
	peakFadeRate: .1, // rate at which peak fades after decay
	bands: [
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
	],
	// not implemented
	enablePeaks: true,
	theme: 'stoplight', // css class
}

export default class StandardEQ {

	constructor(config) {
		// TODO: ensure config contains `range`
		this.config = Object.assign(defaultConfig, config);

		const { fidelity, bands } = this.config;
		const visualizer = document.getElementById('visualizer');
		const labelsEl = visualizer.getElementById('eq-labels');
		const bandsEl = visualizer.getElementById('eq-bands');
		const peaksEl = visualizer.getElementById('eq-peaks');
		const size = bands.length * fidelity;
		let eqPath, peakPath, label;

		visualizer.setAttribute('viewBox', `0 0 ${size} ${size}`);

		bands.map((band, idx) => {
			eqPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			eqPath.setAttribute('stroke-width', fidelity * .9);
			eqPath.setAttribute('stroke-dasharray', `${fidelity * .9}, ${fidelity * .1}`);
			bandsEl.appendChild(eqPath);

			peakPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			peakPath.setAttribute('stroke-width', fidelity * .9);
			peaksEl.appendChild(peakPath);

			label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
			label.setAttribute('x', (idx * fidelity) + (fidelity / 2));
			label.setAttribute('y', (bands.length * fidelity) - 10);
			label.setAttribute('class', '.label');
			label.textContent = bands[idx].label;
			labelsEl.appendChild(label);

			this._calculateBandRange(band, idx);
		});

		this.bandPaths = bandsEl.getElementsByTagName('path');
		this.peakPaths = peaksEl.getElementsByTagName('path');
	}

	draw(frequencyArray) {
		const now = new moment();
		this.config.bands.map(this._drawBand.bind(this, frequencyArray, now));
	}

	_drawBand(frequencyArray, now, band, idx) {
		band.value = this._whatsTheFrequencyKenneth(band, frequencyArray);
		this._calculatePeaks(band, now);
		this.bandPaths[idx].setAttribute('d', this._getEQLine(idx, band.value));
		this.peakPaths[idx].setAttribute('d', this._getPeakLine(idx, band.peak));
		this.peakPaths[idx].setAttribute('style', `opacity: ${band.opacity}`);
	}

	_whatsTheFrequencyKenneth(band, frequencyArray) {
		const frequencies =
			getFrequenciesByRange(frequencyArray, band.min, band.max, this.config.range);
		const frequencyLen = frequencies.length;
		return frequencyLen === 0 ?
			0 : frequencies.reduce((acc, val) => acc + val, 0) / frequencyLen;
	}

	_calculateBandRange(band, bandIdx) {
		band.min = bandIdx === 0 ? 0 : this.config.bands[bandIdx - 1].frequency;
		band.max = this.config.bands[bandIdx].frequency;
	}

	_calculatePeaks(band, now) {
		if (band.value > band.peak) { // new peak detected
			band.peak = band.value;
			band.opacity = 1;
			band.decay = new moment();
		} else if (moment.duration(now.diff(band.decay)) > this.config.peakDecay) { // decay peak
			band.peak = band.peak - this.config.peakFallRate;
			band.opacity = band.opacity - this.config.peakFadeRate;
		}
	}

	_getEQLine(idx, frequency) {
		const x = (idx * this.config.fidelity) + (this.config.fidelity / 2);
		const y = this.config.bands.length * this.config.fidelity;
		const h = this._calculateLineLength(frequency);
		return `M ${x},${y} L ${x},${h}`;
	}

	_getPeakLine(idx, frequency) {
		const x = (idx * this.config.fidelity) + (this.config.fidelity / 2);
		const y = this._calculateLineLength(frequency);
		const h = y - this.config.fidelity * .2;
		return `M ${x},${y} L ${x},${h}`;
	}

	_calculateLineLength(frequency) {
		let { bands, fidelity, frequencyCount } = this.config;
		let numBands = bands.length;
		return parseInt((numBands * fidelity) - (frequency * numBands * fidelity / frequencyCount), 10);
	}
}