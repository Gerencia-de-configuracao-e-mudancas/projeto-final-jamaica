export default function turnLoader(turnInElement, turnOffElement, displayType) {
    turnOffElement.style.display = "none";
    turnInElement.style.display = displayType;
}