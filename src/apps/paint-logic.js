// Paint Application Logic
class PaintApp {
    constructor() {
        this.canvas = document.getElementById('paint-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.currentTool = 'brush';
        this.currentColor = '#000000';
        this.brushSize = 5;
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;

        this.initializeCanvas();
        this.setupEventListeners();
        this.updateStatusBar();
    }

    initializeCanvas() {
        // Set canvas size
        this.canvas.width = 800;
        this.canvas.height = 600;

        // Set initial canvas properties
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }

    setupEventListeners() {
        // Tool buttons
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectTool(e.target.closest('.tool-btn').dataset.tool);
            });
        });

        // Color buttons
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectColor(e.target.dataset.color);
            });
        });

        // Brush size control
        const brushSizeInput = document.getElementById('brush-size');
        const sizeValue = document.getElementById('size-value');

        brushSizeInput.addEventListener('input', (e) => {
            this.brushSize = parseInt(e.target.value);
            sizeValue.textContent = this.brushSize;
        });

        // Canvas drawing events
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());

        // Prevent context menu on right click
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    selectTool(tool) {
        this.currentTool = tool;

        // Update button states
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tool="${tool}"]`).classList.add('active');

        // Update cursor
        this.updateCanvasCursor();
        this.updateStatusBar();
    }

    selectColor(color) {
        this.currentColor = color;

        // Update button states
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-color="${color}"]`).classList.add('active');

        // Update status bar color indicator
        const colorIndicator = document.getElementById('current-color');
        colorIndicator.style.backgroundColor = color;
        this.updateStatusBar();
    }

    updateCanvasCursor() {
        switch (this.currentTool) {
            case 'brush':
            case 'eraser':
                this.canvas.style.cursor = 'crosshair';
                break;
            default:
                this.canvas.style.cursor = 'default';
        }
    }

    startDrawing(e) {
        this.isDrawing = true;
        const rect = this.canvas.getBoundingClientRect();
        this.lastX = e.clientX - rect.left;
        this.lastY = e.clientY - rect.top;

        if (this.currentTool === 'brush' || this.currentTool === 'eraser') {
            this.ctx.beginPath();
            this.ctx.moveTo(this.lastX, this.lastY);
        }
    }

    draw(e) {
        if (!this.isDrawing) return;

        const rect = this.canvas.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;

        switch (this.currentTool) {
            case 'brush':
                this.drawBrush(currentX, currentY);
                break;
            case 'eraser':
                this.drawEraser(currentX, currentY);
                break;
        }

        this.lastX = currentX;
        this.lastY = currentY;
    }

    stopDrawing() {
        if (this.isDrawing) {
            this.isDrawing = false;
        }
    }

    drawBrush(x, y) {
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.brushSize;
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }

    drawEraser(x, y) {
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = this.brushSize * 2;
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }


    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    updateStatusBar() {
        const toolElement = document.getElementById('current-tool');
        const canvasInfo = document.getElementById('canvas-info');

        toolElement.textContent = this.currentTool.charAt(0).toUpperCase() + this.currentTool.slice(1);
        canvasInfo.textContent = `${this.canvas.width} x ${this.canvas.height} px`;
    }

    // Public methods for potential future features
    clearCanvas() {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    saveCanvas() {
        const link = document.createElement('a');
        link.download = 'paint-drawing.png';
        link.href = this.canvas.toDataURL();
        link.click();
    }
}

// Initialize the paint app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.paintApp = new PaintApp();
});