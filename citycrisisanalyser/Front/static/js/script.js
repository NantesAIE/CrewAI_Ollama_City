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
