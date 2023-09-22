document.querySelectorAll('.contact-btn').forEach(btn => {
    btn.className = 'disabled';
});
document.getElementById('input').oninput = () => {
    document.getElementById('delete-btn-update').disabled = true;
}