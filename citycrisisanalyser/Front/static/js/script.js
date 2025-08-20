document.addEventListener('DOMContentLoaded', function() {
    
    // --- Configuration --- //

    const DEV_MODE = true; // true pour mode test
    const API_URL = 'http://localhost:8000/analyse'; // URL FastAPI

    // Sélecteurs principaux
    const dragDropArea = document.getElementById('dragDropArea');
    const runAnalysisButton = document.getElementById('runAnalysis');
    const fileInput = document.getElementById('fileInput');
    const imageError = document.getElementById('imageError');
    const predefinedImages = document.querySelectorAll('.predefined-image');
    const agentResponse = document.getElementById('agentResponse');
    const agentNodes = [
        document.getElementById('agent1'),
        document.getElementById('agent2'),
        document.getElementById('agent3'),
        document.getElementById('agent4')
    ];
    let currentFile = null;
    let svgLinks = [];

    // --- Drag & Drop et sélection d'image --- //
    function showDragDropZone() {
        dragDropArea.innerHTML = '';
        const p = document.createElement('p');
        p.id = 'dragDropText';
        p.textContent = 'Déposez ou sélectionnez une image';
        dragDropArea.appendChild(p);
        dragDropArea.classList.add('border-dashed', 'border-2', 'border-[#90CAF9]', 'rounded-lg', 'cursor-pointer');
        if (imageError) imageError.style.display = 'none';
        currentFile = null;
    }

    function addImage(src, file = null) {
        if (dragDropArea.querySelector('.dropped-image')) return;
        dragDropArea.innerHTML = '';
        dragDropArea.classList.remove('border-dashed', 'border-2', 'border-[#90CAF9]');
        const imgWrapper = document.createElement('div');
        imgWrapper.className = 'relative w-full h-full group dropped-image';
        const img = document.createElement('img');
        img.src = src;
        img.className = 'block w-full h-full rounded-lg object-cover';
        imgWrapper.appendChild(img);
        if (file) {
            imgWrapper.file = file;
            currentFile = file;
        }
        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = '&times;';
        removeBtn.title = 'Retirer';
        removeBtn.className = 'absolute top-2 right-2 bg-[#1976D2] text-white rounded-full w-7 h-7 flex items-center justify-center z-10 hover:bg-[#43A047] transition duration-200 focus:outline-none opacity-0 group-hover:opacity-100';
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
            fetch(image.src)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], image.alt + '.jpg', { type: 'image/jpeg' });
                    addImage(image.src, file);
                });
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

    // --- Animation des agents --- //
    function startAgentLoading(index) {
        const fill = agentNodes[index].querySelector('.agent-fill');
        fill.classList.remove('h-0', 'opacity-50');
        fill.classList.add('h-full', 'opacity-80', 'transition-all', 'duration-1000');
    }

    function setAgentDone(index) {
        const fill = agentNodes[index].querySelector('.agent-fill');
        fill.classList.remove('opacity-80');
        fill.classList.add('opacity-100');
    }

    // --- Conversion image en base64 (sans en-tête) --- //
    function imageToBase64NoHeader(file, callback) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64 = e.target.result.split(',')[1];
            callback(base64);
        };
        reader.readAsDataURL(file);
    }

    // --- Animation des barres SVG --- //
    function drawAgentLinesAndBars(state = 'idle') {
        const equipe = document.getElementById('equipe');
        const agents = agentNodes;
        const svg = document.getElementById('agent-lines');
        if (!equipe || agents.some(a => !a) || !svg) return;
        svg.innerHTML = '';
        svgLinks = [];
        const equipeRect = equipe.getBoundingClientRect();
        const svgRect = svg.getBoundingClientRect();
        const startX = equipeRect.left + equipeRect.width / 2 - svgRect.left;
        const startY = equipeRect.top + equipeRect.height / 2 - svgRect.top;
        agents.forEach((agent, idx) => {
            const agentRect = agent.getBoundingClientRect();
            const endX = agentRect.left + agentRect.width / 2 - svgRect.left;
            const endY = agentRect.top + agentRect.height / 2 - svgRect.top;
            const length = Math.hypot(endX - startX, endY - startY);
            const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            group.setAttribute('transform', `translate(${startX},${startY}) rotate(${angle})`);
            const barBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            barBg.setAttribute('x', 0);
            barBg.setAttribute('y', -2);
            barBg.setAttribute('width', length);
            barBg.setAttribute('height', 4);
            barBg.setAttribute('rx', 2);
            barBg.setAttribute('fill', '#E0E0E0');
            group.appendChild(barBg);
            const barFill = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            barFill.setAttribute('x', 0);
            barFill.setAttribute('y', -2);
            barFill.setAttribute('width', state === 'done' ? length : 0);
            barFill.setAttribute('height', 4);
            barFill.setAttribute('rx', 2);
            barFill.setAttribute('fill', '#43A047');
            barFill.style.transition = 'width 1.2s linear';
            group.appendChild(barFill);
            svg.appendChild(group);
            svgLinks.push(barFill);
        });
    }

    function startProgressBarLinksLoadingSVG() {
        svgLinks.forEach((bar, idx) => {
            bar.setAttribute('width', 0);
            setTimeout(() => {
                bar.setAttribute('width', bar.parentNode.firstChild.getAttribute('width'));
            }, idx * 300);
        });
    }

    function setProgressBarLinksDoneSVG() {
        svgLinks.forEach(bar => {
            bar.setAttribute('width', bar.parentNode.firstChild.getAttribute('width'));
        });
    }

    // --- Lancer l'analyse (version production) --- //
    runAnalysisButton.addEventListener('click', function() {
        if (!currentFile) {
            if (imageError) imageError.style.display = 'block';
            return;
        }
        if (imageError) imageError.style.display = 'none';

        // Convertit l'image en base64
        imageToBase64NoHeader(currentFile, function(base64) {
            console.log("Image en base64 (sans en-tête) :", base64);

            // Démarre les animations
            drawAgentLinesAndBars('idle');
            startProgressBarLinksLoadingSVG();
            agentNodes.forEach((_, idx) => startAgentLoading(idx));

            if (DEV_MODE) {
                // Mode développement : charge un fichier JSON local
                const jsonFileInput = document.createElement('input');
                jsonFileInput.type = 'file';
                jsonFileInput.accept = '.json';
                jsonFileInput.onchange = function(e) {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                            try {
                                const jsonData = JSON.parse(e.target.result);
                                displayAgentResponses(jsonData);
                                setProgressBarLinksDoneSVG();
                                agentNodes.forEach((_, idx) => setAgentDone(idx));
                            } catch (err) {
                                console.error("Erreur de parsing JSON :", err);
                                agentResponse.textContent = "Erreur : JSON invalide.";
                            }
                        };
                        reader.readAsText(file);
                    }
                };
                jsonFileInput.click();
            } else {
                // Mode production : envoie la requête à FastAPI
                fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        image_base64: base64,
                        filename: currentFile.name
                    })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Erreur serveur: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Réponse de l'API :", data);
                    displayAgentResponses(data);
                    setProgressBarLinksDoneSVG();
                    agentNodes.forEach((_, idx) => setAgentDone(idx));
                })
                .catch(error => {
                    console.error("Erreur lors de la requête :", error);
                    agentResponse.textContent = "Erreur lors de l'analyse. Voir la console pour plus de détails.";
                });
            }
        });
    });

    // Initialisation
    showDragDropZone();
    drawAgentLinesAndBars('idle');
    window.addEventListener('resize', () => drawAgentLinesAndBars('idle'));
});

// Fonction pour afficher les réponses des agents
window.displayAgentResponses = function(data) {
    document.getElementById('content-vision').innerHTML =
        data.vision_analysis?.[0]?.output ? marked.parse(data.vision_analysis[0].output) : 'Aucune réponse';
    document.getElementById('content-situation').innerHTML =
        data.situation_interpreter?.[0]?.output ? marked.parse(data.situation_interpreter[0].output) : 'Aucune réponse';
    document.getElementById('content-protocol').innerHTML =
        data.protocol_mapper?.[0]?.output ? marked.parse(data.protocol_mapper[0].output) : 'Aucune réponse';
    document.getElementById('content-intervention').innerHTML =
        data.intervention_planner?.[0]?.output ? marked.parse(data.intervention_planner[0].output) : 'Aucune réponse';
};

// Gestion de l'accordéon pour les agents
document.querySelectorAll('#accordion-agents button[data-accordion-target]').forEach(btn => {
    btn.addEventListener('click', function() {
        const targetId = btn.getAttribute('data-accordion-target');
        const target = document.querySelector(targetId);
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        // Ferme tous les autres
        document.querySelectorAll('#accordion-agents [data-accordion-target]').forEach(otherBtn => {
            if (otherBtn !== btn) {
                otherBtn.setAttribute('aria-expanded', 'false');
                const otherTargetId = otherBtn.getAttribute('data-accordion-target');
                const otherTarget = document.querySelector(otherTargetId);
                if (otherTarget) otherTarget.classList.add('hidden');
                const svg = otherBtn.querySelector('svg[data-accordion-icon]');
                if (svg) svg.classList.remove('rotate-180');
            }
        });
        // Toggle celui-ci
        btn.setAttribute('aria-expanded', String(!expanded));
        if (target) target.classList.toggle('hidden', expanded);
        const svg = btn.querySelector('svg[data-accordion-icon]');
        if (svg) svg.classList.toggle('rotate-180', !expanded);
    });
});
