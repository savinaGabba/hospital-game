import * as readline from "readline";

// Configuración del input/output por consola.
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Función auxiliar para preguntar y recibir respuestas.
function askQuestion(question: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(question, (answer) => resolve(answer.trim()));
    });
}

// Preguntar al usuario por el doctor a seleccionar.
export async function selectDoctor(doctors: string[]): Promise<string> {
    console.log("\nDoctores disponibles:");
    doctors.forEach((doc, index) => {
        console.log(`${index + 1}. ${doc}`);
    });

    const choice = await askQuestion("Selecciona un doctor por número: ");
    const index = parseInt(choice) - 1;

    if (index >= 0 && index < doctors.length) {
        return doctors[index];
    } else {
        console.log("Selección inválida. Intenta nuevamente.");
        return selectDoctor(doctors); // Reintentar si la entrada es inválida.
    }
}

// Preguntar al usuario por el paciente a seleccionar.
export async function selectPatient(patients: string[]): Promise<string> {
    console.log("\nPacientes disponibles:");
    patients.forEach((pat, index) => {
        console.log(`${index + 1}. ${pat}`);
    });

    const choice = await askQuestion("Selecciona un paciente por número: ");
    const index = parseInt(choice) - 1;

    if (index >= 0 && index < patients.length) {
        return patients[index];
    } else {
        console.log("Selección inválida. Intenta nuevamente.");
        return selectPatient(patients); // Reintentar si la entrada es inválida.
    }
}

// Confirmar si el usuario quiere continuar con una acción.
export async function confirmAction(action: string): Promise<boolean> {
    const response = await askQuestion(`¿Quieres proceder con ${action}? (sí/no): `);
    return response.toLowerCase() === "sí";
}

// Cerrar el readline después de todas las interacciones.
export function closePrompt(): void {
    rl.close();
}