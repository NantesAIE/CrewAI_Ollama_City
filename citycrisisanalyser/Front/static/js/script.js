document.addEventListener('DOMContentLoaded', function() {
    const dragDropArea = document.getElementById('dragDropArea');
    const dragDropText = document.getElementById('dragDropText');
    const predefinedImages = document.querySelectorAll('.predefined-image');
    const runAnalysisButton = document.getElementById('runAnalysis');
    const fileInput = document.getElementById('fileInput');
    const imageError = document.getElementById('imageError');

    function showDragDropZone() {
        dragDropArea.innerHTML = '';
        const p = document.createElement('p');
        p.id = 'dragDropText';
        p.textContent = 'Déposez ou sélectionnez une image';
        dragDropArea.appendChild(p);
        dragDropArea.classList.add('drag-drop-area');
        if (imageError) imageError.style.display = 'none';
    }

    function addImage(src) {
        if (dragDropArea.querySelector('.dropped-image')) return;
        dragDropArea.innerHTML = '';
        dragDropArea.classList.remove('drag-drop-area');

        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'dropped-image';

        const img = document.createElement('img');
        img.src = src;

        const overlay = document.createElement('div');
        overlay.className = 'overlay';

        const removeBtn = document.createElement('button');
        removeBtn.textContent = '✖';
        removeBtn.title = 'Retirer';
        removeBtn.className = 'remove-btn';

        removeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showDragDropZone();
        });

        imgWrapper.appendChild(img);
        imgWrapper.appendChild(overlay);
        imgWrapper.appendChild(removeBtn);
        dragDropArea.appendChild(imgWrapper);
        if (imageError) imageError.style.display = 'none';
    }

    predefinedImages.forEach(image => {
        image.addEventListener('click', function() {
            addImage(image.src);
        });
    });

    dragDropArea.addEventListener('click', function() {
        if (!dragDropArea.querySelector('.dropped-image')) {
            fileInput.click();
        }
    });

    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file && file.type === 'image/jpeg') {
            const imgURL = URL.createObjectURL(file);
            addImage(imgURL);
        }
        fileInput.value = '';
    });

    runAnalysisButton.addEventListener('click', function() {
        if (!dragDropArea.querySelector('.dropped-image')) {
            if (imageError) imageError.style.display = 'block';
            return;
        }
        if (imageError) imageError.style.display = 'none';
        fetch('/run_analysis', {
            method: 'POST',
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('agentResponse').textContent = data.message;
        });
    });

    dragDropArea.addEventListener('dragover', function(e) {
        e.preventDefault();
    });

    dragDropArea.addEventListener('drop', function(e) {
        e.preventDefault();
        if (!dragDropArea.querySelector('.dropped-image')) {
            const files = e.dataTransfer.files;
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.type === 'image/jpeg') {
                    const imgURL = URL.createObjectURL(file);
                    addImage(imgURL);
                    break;
                }
            }
        }
    });

    showDragDropZone();
});

function drawAgentLines() {
    const equipe = document.getElementById('equipe');
    const agents = [
        document.getElementById('agent1'),
        document.getElementById('agent2'),
        document.getElementById('agent3'),
        document.getElementById('agent4')
    ];
    const svg = document.getElementById('agent-lines');
    if (!equipe || agents.some(a => !a) || !svg) return;

    svg.innerHTML = '';

    // Prend les positions de l'Equipe et des Agents
    const equipeRect = equipe.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();

    agents.forEach(agent => {
        const agentRect = agent.getBoundingClientRect();

        // Calculer les coordonnées de départ et d'arrivée
        const startX = equipeRect.right - svgRect.left;
        const startY = equipeRect.top + equipeRect.height / 2 - svgRect.top;
        const endX = agentRect.left - svgRect.left;
        const endY = agentRect.top + agentRect.height / 2 - svgRect.top;

        // Créer une ligne SVG
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', startX);
        line.setAttribute('y1', startY);
        line.setAttribute('x2', endX);
        line.setAttribute('y2', endY);
        line.setAttribute('stroke', '#000000ff');
        line.setAttribute('stroke-width', '3');
        svg.appendChild(line);
    });
}

// Redraw lines on resize and after DOM is loaded
window.addEventListener('resize', drawAgentLines);
window.addEventListener('DOMContentLoaded', drawAgentLines);
setTimeout(drawAgentLines, 300); // In case of late rendering
