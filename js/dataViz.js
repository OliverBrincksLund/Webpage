document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('your-canvas-id');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        // Sample data - replace with your actual data
        const depths = [0, 30, 60, 90, 120, 150];
        const pesticides = {
            'Atrazine': [10, 8, 6, 4, 2, 1],
            'Glyphosate': [15, 12, 8, 5, 3, 1],
            'Chlorpyrifos': [5, 7, 9, 8, 6, 4],
            'Metolachlor': [8, 10, 11, 9, 7, 5],
            'Acetochlor': [12, 9, 7, 5, 3, 2]
        };

        const colors = [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
        ];

        const datasets = Object.entries(pesticides).map(([pesticide, concentrations], index) => ({
            label: pesticide,
            data: concentrations.map((concentration, i) => ({ x: concentration, y: depths[i] })),
            borderColor: colors[index],
            backgroundColor: colors[index].replace('1)', '0.2)'),
            tension: 0.1
        }));

        new Chart(ctx, {
            type: 'line',
            data: { datasets },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Pesticide Infiltration by Depth'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    },
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'Concentration (μg/L)'
                        }
                    },
                    y: {
                        reverse: true,
                        title: {
                            display: true,
                            text: 'Depth (cm)'
                        },
                        suggestedMin: 0,
                        suggestedMax: 150
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                }
            }
        });
    } else {
        console.warn('Canvas element not found');
    }
});