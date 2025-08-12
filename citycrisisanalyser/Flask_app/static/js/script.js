document.addEventListener('DOMContentLoaded', function() {
    const dragDropArea = document.getElementById('dragDropArea');
    const predefinedImages = document.querySelectorAll('.predefined-image');
    const runAnalysisButton = document.getElementById('runAnalysis');

    predefinedImages.forEach(image => {
        image.addEventListener('click', function() {
            const imgClone = image.cloneNode(true);
            dragDropArea.appendChild(imgClone);
        });
    });

    runAnalysisButton.addEventListener('click', function() {
        fetch('/run_analysis', {
            method: 'POST',
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
        });
    });

    dragDropArea.addEventListener('dragover', function(e) {
        e.preventDefault();
    });

    dragDropArea.addEventListener('drop', function(e) {
        e.preventDefault();
        const files = e.dataTransfer.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                img.style.width = '50px';
                img.style.height = '50px';
                img.style.margin = '10px';
                dragDropArea.appendChild(img);
            }
        }
    });
});
