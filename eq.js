import StandardEQ from './standardEQ.js';
import { createAudioStream, getFrequencies } from './audioUtils.js';

window.onload = () => {
	const soundAllowed = (stream) => {
		const audio = createAudioStream(stream);
		const eq = new StandardEQ({ range: audio.range });
		getFrequencies(audio.analyser, audio.frequencyArray, [eq]);
	}
	const soundNotAllowed = (err) => console.log(err);
	navigator.getUserMedia({ audio: true }, soundAllowed, soundNotAllowed);
}

/*
[ ] full sweep/wave on startup
[ ] layout
[x] adjust config
[ ] reactify
[ ] themes / ui (horizontal LED, full spectrum, peaks only LED w/data display, animated Khz val, rainbow of some sort)
*/

// const eq = new StandardEQ({
// 	audio,
// 	bands: [
// 		{ frequency: 25, peak: 0, label: '25 Hz' },
// 		{ frequency: 65, peak: 0, label: '66 Hz' },
// 		{ frequency: 160, peak: 0, label: '160 Hz' },
// 		{ frequency: 400, peak: 0, label: '400 Hz' },
// 		{ frequency: 1000, peak: 0, label: '1 KHz' },
// 		{ frequency: 2500, peak: 0, label: '2.5 KHz' },
// 		{ frequency: 10000, peak: 0, label: '10 KHz' }
// 	]
// });

// this.frequencyArray = [45, 211, 87, 167, 67, 34, 134, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 165, 134, 134, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 165, 134, 134, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 165, 134, 134, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 165, 134, 134, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 165, 134, 134, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165];
