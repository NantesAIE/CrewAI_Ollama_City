document.addEventListener('DOMContentLoaded', function() {
    // Sélecteurs principaux
    const dragDropArea = document.getElementById('dragDropArea');
    const runAnalysisButton = document.getElementById('runAnalysis');
    const fileInput = document.getElementById('fileInput');
    const imageError = document.getElementById('imageError');
    const predefinedImages = document.querySelectorAll('.predefined-image');
    const agentResponse = document.getElementById('agentResponse');

    // Barres de liaison agents
    const progressBarLinks = [
        document.getElementById('progressBarLink1'),
        document.getElementById('progressBarLink2'),
        document.getElementById('progressBarLink3'),
        document.getElementById('progressBarLink4')
    ];

    // Agents (cercles à droite)
    const agentNodes = [
        document.getElementById('agent1'),
        document.getElementById('agent2'),
        document.getElementById('agent3'),
        document.getElementById('agent4')
    ];

    // --- Drag & Drop et sélection d'image ---
    function showDragDropZone() {
        dragDropArea.innerHTML = '';
        const p = document.createElement('p');
        p.id = 'dragDropText';
        p.textContent = 'Déposez ou sélectionnez une image';
        dragDropArea.appendChild(p);
        dragDropArea.classList.add('drag-drop-area');
        if (imageError) imageError.style.display = 'none';
    }

    function addImage(src, file = null) {
        if (dragDropArea.querySelector('.dropped-image')) return;
        dragDropArea.innerHTML = '';
        dragDropArea.classList.remove('drag-drop-area');

        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'dropped-image';

        const img = document.createElement('img');
        img.src = src;
        imgWrapper.appendChild(img);

        // Stocke le fichier original dans l'élément pour conversion base64
        if (file) imgWrapper.file = file;

        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        imgWrapper.appendChild(overlay);

        const removeBtn = document.createElement('button');
        removeBtn.textContent = '✖';
        removeBtn.title = 'Retirer';
        removeBtn.className = 'remove-btn';
        removeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showDragDropZone();
        });
        imgWrapper.appendChild(removeBtn);

        dragDropArea.appendChild(imgWrapper);
        if (imageError) imageError.style.display = 'none';
    }

    // Sélection image prédéfinie
    predefinedImages.forEach(image => {
        image.addEventListener('click', function() {
            addImage(image.src);
        });
    });

    // Sélection via input file
    dragDropArea.addEventListener('click', function() {
        if (!dragDropArea.querySelector('.dropped-image')) {
            fileInput.click();
        }
    });

    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file && file.type === 'image/jpeg') {
            const imgURL = URL.createObjectURL(file);
            addImage(imgURL, file);
        }
        fileInput.value = '';
    });

    // Drag & drop
    dragDropArea.addEventListener('dragover', function(e) {
        e.preventDefault();
    });

    dragDropArea.addEventListener('drop', function(e) {
        e.preventDefault();
        if (!dragDropArea.querySelector('.dropped-image')) {
            const file = e.dataTransfer.files[0];
            if (file && file.type === 'image/jpeg') {
                const imgURL = URL.createObjectURL(file);
                addImage(imgURL, file);
            }
        }
    });

    // --- Animation des barres de liaison ---
    function startProgressBarLinksLoading() {
        progressBarLinks.forEach(bar => {
            bar.classList.remove('done');
            bar.classList.add('loading');
        });
    }

    function setProgressBarLinksDone() {
        progressBarLinks.forEach(bar => {
            bar.classList.remove('loading');
            bar.classList.add('done');
        });
    }

    // --- Animation des agents (remplissage) ---
    function startAgentLoading(index) {
        agentNodes[index].classList.add('loading');
        agentNodes[index].classList.remove('done');
    }

    function setAgentDone(index) {
        agentNodes[index].classList.remove('loading');
        agentNodes[index].classList.add('done');
    }

    // --- Conversion image en base64 sans l'en-tête ---
    function imageToBase64NoHeader(file, callback) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64 = e.target.result.replace(/^data:image\/jpeg;base64,/, '');
            callback(base64);
        };
        reader.readAsDataURL(file);
    }

    // --- Lancer l'analyse ---
    runAnalysisButton.addEventListener('click', function() {
        const dropped = dragDropArea.querySelector('.dropped-image');
        if (!dropped) {
            if (imageError) imageError.style.display = 'block';
            return;
        }
        if (imageError) imageError.style.display = 'none';

        // Animation barres de liaison
        startProgressBarLinksLoading();

        // Animation agents (remplissage séquentiel)
        let i = 0;
        function nextAgent() {
            if (i < agentNodes.length) {
                startAgentLoading(i);
                setTimeout(() => {
                    setAgentDone(i);
                    i++;
                    nextAgent();
                }, 1200); // Durée de remplissage par agent
            }
        }
        nextAgent();

        // Conversion image en base64 (si fichier dispo)
        let file = null;
        if (dropped && dropped.file) {
            file = dropped.file;
        } else if (fileInput.files[0]) {
            file = fileInput.files[0];
        }
        if (file && file.type === 'image/jpeg') {
            imageToBase64NoHeader(file, function(base64Str) {
                console.log("Base64 image (sans header):", base64Str); // Affiche le base64 dans la console
            });
        }

        // Simulation requête backend
        fetch('/run_analysis', {
            method: 'POST',
        })
        .then(response => response.json())
        .then(data => {
            agentResponse.textContent = data.message;
            setProgressBarLinksDone();
        });
    });

    // Initialisation
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