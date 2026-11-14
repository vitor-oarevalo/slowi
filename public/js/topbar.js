const hojeTopo = document.getElementById("hoje");

if (hojeTopo) {
    hojeTopo.textContent = new Date().toLocaleDateString("pt-BR", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
    });
}