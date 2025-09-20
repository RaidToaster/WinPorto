function cvApp() {
    // Create a temporary link element to trigger download
    const link = document.createElement('a');
    link.href = '../../images/CV/CV.pdf';
    link.download = 'Kevin_Pramudya_Mahardika_CV.pdf';
    link.target = '_blank';

    // Add to DOM temporarily
    document.body.appendChild(link);

    // Trigger download
    link.click();

    // Remove from DOM
    document.body.removeChild(link);
}

export { cvApp };