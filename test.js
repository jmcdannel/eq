console.log('test');
let frequencyArray = [45, 211, 87, 167, 67, 34, 134, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165, 134, 25, 75, 24, 99, 100, 134, 145, 123, 165];
let bars = [
	{ frequency: 40, max: 0, label: '25Hz' },
	{ frequency: 150, max: 0, label: '25Hz' },
	{ frequency: 300, max: 0, label: '25Hz' },
	{ frequency: 500, max: 0, label: '25Hz' },
	{ frequency: 2000, max: 0, label: '25Hz' }
];
let fIdx = 0;
let frequencyStep = 25;
let frequency;
const averageFrequency = (len, acc, val) => {
	debugger;
	return acc + val / len;
}
const filterFrequencies = (bars, barIdx, data, fIdx) => {
	const min = barIdx === 0 ? barIdx : bars[barIdx - 1].frequency;
	const f = fIdx * frequencyStep;
	return (f >= min && f < bars[barIdx].frequency);
}
bars.map((bar, idx) => {
	const frequencies = frequencyArray.filter(filterFrequencies.bind(null, bars, idx));
	bar.value = frequencies.reduce(averageFrequency.bind(null, frequencies.length));
	return bar;

	// frequencyArray.reduce((acc, currData, fIdx) => {
	// 	frequency = frequencyStep * fIdx;
	// 	console.log(bar.frequency, frequency, currData);
	// 	return currData;
	// });
	// let 
	// let currData = frequencyArray[fIdx];

	// while (frequency <= bar.frequency) {
	// 	console.log(bar.frequency, frequency, currData);
	// 	fIdx++;
	// 	frequency = 25 * (fIdx + 1);
	// 	currData = frequencyArray[fIdx];
	// 	// break;
	// }

});

console.log(bars);
