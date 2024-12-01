document.addEventListener('DOMContentLoaded', () => {
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const name = document.getElementById('name').value;
            const height = parseFloat(document.getElementById('height').value) / 100;
            const weight = parseFloat(document.getElementById('weight').value);

            const bmi = (weight / (height * height)).toFixed(2);
            const doshas = ['Vata', 'Pitta', 'Kapha'];
            const dosha = doshas[Math.floor(Math.random() * doshas.length)];
            const diseases = {
                Vata: [
                    '🌿 You may experience joint pain in colder weather.',
                    '🌿 High chances of anxiety and insomnia if stressed.',
                    '🌿 Sensitive digestion leading to bloating or gas.'
                ],
                Pitta: [
                    '🔥 You might suffer from heartburn due to spicy foods.',
                    '🔥 High risk of skin issues like acne or rashes.',
                    '🔥 Possible tendency toward irritability or anger.'
                ],
                Kapha: [
                    '💧 Increased risk of obesity if not active.',
                    '💧 You may develop respiratory issues like asthma.',
                    '💧 Possible onset of diabetes if overindulging in sweets.'
                ]
            };
            const advice = {
                Vata: [
                    '☘️ Stay hydrated throughout the day.',
                    '☘️ Follow a warm, nourishing diet.',
                    '☘️ Avoid cold and raw foods.',
                    '☘️ Meditate daily to calm your mind.'
                ],
                Pitta: [
                    '🔥 Include cooling foods in your diet like cucumber.',
                    '🔥 Avoid excessive sun exposure.',
                    '🔥 Practice yoga or tai chi for relaxation.',
                    '🔥 Minimize caffeine and alcohol intake.'
                ],
                Kapha: [
                    '💧 Exercise regularly to maintain energy levels.',
                    '💧 Avoid heavy or greasy foods.',
                    '💧 Stay mentally stimulated with new activities.',
                    '💧 Include spicy foods to balance metabolism.'
                ]
            };
            const bpmAdvice = [
                '💓 Maintain a balanced diet to keep your heart rate stable.',
                '💓 Engage in regular cardio exercises.',
                '💓 Avoid excessive caffeine and smoking.',
                '💓 Practice mindfulness and stress management.'
            ];

            sessionStorage.setItem('name', name);
            sessionStorage.setItem('bmi', bmi);
            sessionStorage.setItem('dosha', dosha);
            sessionStorage.setItem('diseases', JSON.stringify(diseases[dosha]));
            sessionStorage.setItem('advice', JSON.stringify([...advice[dosha], ...bpmAdvice]));

            window.location.href = 'result.html';
        });
    }

    if (window.location.pathname.includes('result.html')) {
        const name = sessionStorage.getItem('name');
        const bmi = sessionStorage.getItem('bmi');
        const dosha = sessionStorage.getItem('dosha');
        const diseases = JSON.parse(sessionStorage.getItem('diseases'));
        const advice = JSON.parse(sessionStorage.getItem('advice'));

        document.getElementById('reportTitle').textContent = `${name}'s Health Report`;
        document.getElementById('dosha').textContent = dosha;

        const nerveImages = {
            Vata: 'vata.jpg',
            Pitta: 'pitta.jpg',
            Kapha: 'kapha.jpg'
        };
        document.getElementById('nerveImage').src = nerveImages[dosha];

        const diseasesList = document.getElementById('diseases');
        diseases.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            diseasesList.appendChild(li);
        });

        const adviceList = document.getElementById('adviceList');
        advice.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            adviceList.appendChild(li);
        });

        // Define Heart Rate Range based on Dosha
        const heartRateRanges = {
            Vata: { min: 75, max: 90 },
            Pitta: { min: 85, max: 100 },
            Kapha: { min: 60, max: 75 }
        };

        // Generate random heart rate within the dosha range
        const generateHeartRate = (dosha) => {
            const { min, max } = heartRateRanges[dosha];
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };

        // Heart Rate Graph
        const heartRateCanvas = document.getElementById('heartRateChart');
        const heartRateChart = new Chart(heartRateCanvas, {
            type: 'line',
            data: {
                labels: Array.from({ length: 30 }, (_, i) => i),
                datasets: [{
                    label: 'Heart Rate (bpm)',
                    data: Array.from({ length: 30 }, () => generateHeartRate(dosha)),
                    borderColor: '#ff4d4d',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4
                }]
            },
            options: { animation: false, scales: { y: { min: 50, max: 120 } } }
        });

        setInterval(() => {
            heartRateChart.data.datasets[0].data.shift();
            heartRateChart.data.datasets[0].data.push(generateHeartRate(dosha));
            heartRateChart.update();
        }, 1000);

        // BMI Bar Graph
        const bmiCanvas = document.getElementById('bmiChart');
        new Chart(bmiCanvas, {
            type: 'bar',
            data: {
                labels: ['Your BMI', 'Healthy BMI Range'],
                datasets: [{
                    label: 'BMI Comparison',
                    data: [bmi, 22],
                    backgroundColor: ['#ffb347', '#82b54b']
                }]
            },
            options: { scales: { y: { min: 0, max: 50 } } }
        });
    }
});
