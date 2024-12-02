//src/utils/prompts.ts

import * as readline from "readline";

// Configuración del input/output por consola.
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Función auxiliar para preguntar y recibir respuestas.
export async function askQuestion(question: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(question, (answer) => resolve(answer.trim()));
    });
}

// Preguntar al usuario por el doctor a seleccionar.
export const selectDoctor = async (doctorNames: string[]): Promise<string> => {
    console.log(`Selecciona un doctor:`);
    doctorNames.forEach((name, index) => console.log(`${index + 1}. ${name}`));

    while (true) {
        const choice = await askQuestion("Selecciona un doctor por número: ");
        const index = parseInt(choice) - 1;

        if (index >= 0 && index < doctorNames.length) {
            return doctorNames[index]; // Devuelve el nombre del doctor seleccionado.
        } else {
            console.log("Selección inválida. Intenta nuevamente.");
        }
    }
};

// Preguntar al usuario por el paciente a seleccionar.
export const selectPatient = async (patientNames: string[]): Promise<string> => {
    console.log(`Selecciona un paciente:`);
    patientNames.forEach((name, index) => console.log(`${index + 1}. ${name}`));

    while (true) {
        const choice = await askQuestion("Selecciona un paciente por número: ");
        const index = parseInt(choice) - 1;

        if (index >= 0 && index < patientNames.length) {
            return patientNames[index]; // Devuelve el nombre del paciente seleccionado.
        } else {
            console.log("Selección inválida. Intenta nuevamente.");
        }
    }
};

// Confirmar si el usuario quiere continuar con una acción.
export async function confirmAction(action: string): Promise<boolean> {
    const response = await askQuestion(`¿Quieres proceder con ${action}? (sí/no): `);
    return response.toLowerCase() === "sí";
}

// Cerrar el readline después de todas las interacciones.
export function closePrompt(): void {
    rl.close();
};
