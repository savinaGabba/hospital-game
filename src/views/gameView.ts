// src/views/gameView.ts

import { Patient } from "../models/patient";

// Mostrar mensaje de bienvenida.
export function showWelcomeMessage(): void {
    console.log("👨‍⚕️ Bienvenido al Juego del Hospital 🏥");
    console.log("Tu objetivo es atender a todos los pacientes antes de que se acabe el tiempo. ¡Buena suerte!\n");
}

// Mostrar mensaje de nivel actual.
export function showLevel(level: number): void {
    console.log(`\n===== 🌟 Nivel ${level} 🌟 =====\n`);
}

// Mostrar los pacientes disponibles en el nivel.
export function showPatients(patients: Patient[]): void {
    if (patients.length === 0) {
        console.log("No hay pacientes disponibles para este nivel.\n");
        return;
    }

    console.log("📋 Lista de pacientes disponibles:");
    patients.forEach((patient, index) => {
        console.log(`  ${index + 1}. ${patient.name} - Urgencia: ${patient.urgency}`);
        console.log(`     Síntomas: ${patient.symptoms.join(", ")}`);
    });
    console.log("");
}

// Mostrar mensaje cuando se completa un nivel.
export function showLevelComplete(level: number): void {
    console.log(`🎉 ¡Felicidades! Has completado el nivel ${level}.\n`);
}

// Mostrar mensaje cuando no se completa un nivel.
export function showLevelFailed(level: number): void {
    console.log(`❌ Nivel ${level} no completado. Aún quedan pacientes por atender.\n`);
}

// Función para mostrar el tiempo restante
export function showTimeRemaining(timeRemaining: number): void {
    console.log(`Tiempo restante: ${timeRemaining} segundos.`);
}

// Función para mostrar el mensaje de fin de tiempo
export function showTimeUpMessage(): void {
    console.log("¡El tiempo se ha agotado! Has perdido el nivel.");
}

// Mostrar mensaje de finalización del juego.
export function showGameEnd(): void {
    console.log("🏁 El juego ha terminado. ¡Gracias por jugar al Juego del Hospital! 👩‍⚕️👨‍⚕️");
}
