// src/controllers/gameControllers.ts

import { Doctor } from "../models/doctor";
import { Patient, TraumaPatient, RespiratoryInfectionPatient, DermatologyPatient, GastroenterologyPatient } from "../models/patient";
import * as gameView from "../views/gameView";
import * as prompts from "../utils/prompts";

// Función para agregar un retraso.
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Clase principal que controla la lógica del juego de hospital.
 */
export class GameController {
    private doctors: Doctor[] = []; // Lista de doctores disponibles en el juego.
    private patients: Patient[] = []; // Lista de pacientes en cada nivel.
    private level: number = 1; // Nivel actual del juego.
    private levelTimeLimit: number = 60; // Límite de tiempo por nivel en segundos 

    constructor() {
        this.initializeGame(); // Configura los datos iniciales del juego.
    }

    /**
     * Configura los doctores y pacientes iniciales.
     */
    private initializeGame(): void {
        // Agrega doctores con sus especialidades y niveles de experiencia.
        this.doctors.push(new Doctor("Dr. Smith", "TraumaPatient", "senior"));
        this.doctors.push(new Doctor("Dr. Johnson", "GastroenterologyPatient", "mid"));

        // Agrega pacientes específicos con condiciones que usen los métodos particulares.
        this.patients.push(new TraumaPatient("John Doe", ["fractura en pierna"], "fractura")); // Debería requerir rayos X.
        this.patients.push(new RespiratoryInfectionPatient("Jane Roe", ["tos", "fiebre"], true)); // Debería requerir aislamiento.
        this.patients.push(new DermatologyPatient("Alice Smith", ["lesión en la piel"], "melanoma")); // Debería requerir biopsia.
        this.patients.push(new GastroenterologyPatient("Bob Johnson", ["dolor abdominal", "fiebre"], "high", true)); // Debería requerir hospitalización.
    }

    /**
     * Inicia el juego y controla la progresión de niveles.
     */
    public async startGame(): Promise<void> {
        await delay(1000); // Pausa antes de mostrar el mensaje de bienvenida.
        gameView.showWelcomeMessage(); // Muestra mensaje de bienvenida.

        while (this.level <= 3) { // Repite el juego por 3 niveles.
            await delay(1000); // Pausa antes de mostrar el nivel.
            gameView.showLevel(this.level); // Muestra el nivel actual.
            this.configureLevel(this.level);  // Configura los pacientes al comenzar cada nivel.
            
            const levelFinished = await this.playLevel(); // Juega el nivel actual con temporizador.
            
            if (!levelFinished) {
                gameView.showTimeUpMessage(); // Si el tiempo se acabó, muestra el mensaje de "Tiempo agotado".
                break; // Termina el juego si el tiempo se agotó antes de completar el nivel.
            }

            this.level++; // Avanza al siguiente nivel.
        }

        await delay(1000); // Pausa antes de mostrar el mensaje de fin.
        gameView.showGameEnd(); // Muestra el mensaje de fin del juego.
    }

    /**
     * Configura los pacientes según el nivel actual.
     * @param level Nivel actual del juego.
     */
    private configureLevel(level: number): void {
        this.patients = []; // Limpia la lista de pacientes.

        // Agrega pacientes específicos según el nivel.
        if (level === 1) {
            this.patients.push(new TraumaPatient("John Doe", ["fractura en brazo"], "fractura")); // Requiere rayos X.
            this.patients.push(new RespiratoryInfectionPatient("Jane Roe", ["tos", "fiebre"], true)); // Requiere aislamiento.
            this.patients.push(new Patient("Alice Brown", ["dolor de cabeza"], "medium")); // Paciente estándar.
        } else if (level === 2) {
            this.patients.push(new DermatologyPatient("Bob White", ["lesión en la piel"], "melanoma")); // Requiere biopsia.
            this.patients.push(new GastroenterologyPatient("Charlie Grey", ["dolor abdominal", "fiebre"], "high", true)); // Requiere hospitalización.
            this.patients.push(new Patient("Dave Green", ["mareos"], "low")); // Paciente estándar.
        } else if (level === 3) {
            this.patients.push(new TraumaPatient("Eve Black", ["fractura en pierna"], "fractura")); // Requiere rayos X.
            this.patients.push(new RespiratoryInfectionPatient("Fiona Blue", ["fiebre alta", "dificultad para respirar"], true)); // Requiere aislamiento.
            this.patients.push(new DermatologyPatient("George Red", ["erupción sospechosa"], "melanoma")); // Requiere biopsia.
        }
    }

    /**
     * Lógica para jugar un nivel: selección de doctores y pacientes.
     */
    private async playLevel(): Promise<boolean> {
        let timeRemaining = 60; // Tiempo inicial para el nivel
        let patientsAttended = 0; // Contador de pacientes atendidos
        
        // Mostrar pacientes y comenzar el temporizador
        gameView.showPatients(this.patients);
        console.log("Iniciando temporizador con 60 segundos...");
    
        // Función para el temporizador (se ejecuta cada 5 segundos)
        const timer = setInterval(() => {
            if (timeRemaining > 0 && patientsAttended < this.patients.length) {
                console.log(`Tiempo restante: ${timeRemaining} segundos.`);
                timeRemaining -= 5;
            }
            // Si todos los pacientes han sido atendidos o el tiempo se acaba, detener el temporizador
            if (patientsAttended === this.patients.length || timeRemaining <= 0) {
                clearInterval(timer);
            }
        }, 5000); // El temporizador se actualiza cada 5 segundos
    
        // Mientras haya pacientes para atender y el tiempo no haya expirado
        while (this.patients.length > 0 && timeRemaining > 0) {
            // Selección de doctor
            const doctorName = await prompts.selectDoctor(this.doctors.map(doc => doc.name));
            const selectedDoctor = this.doctors.find(doc => doc.name === doctorName);
    
            // Selección de paciente
            const patientName = await prompts.selectPatient(this.patients.map(pat => pat.name));
            const selectedPatient = this.patients.find(pat => pat.name === patientName);
    
            if (selectedDoctor && selectedPatient) {
                selectedDoctor.assignPatient(selectedPatient); // Asigna al doctor el paciente
                console.log(`${selectedDoctor.name} está atendiendo a ${selectedPatient.name}.`);
                await delay(1000); // Pausa antes de mostrar el resultado
                selectedDoctor.attendPatient(); // El doctor atiende al paciente
    
                // Mostrar requisitos según el tipo de paciente
                if (selectedPatient instanceof TraumaPatient) {
                    console.log(`${selectedPatient.name} requiere rayos X: ${selectedPatient.requireXRay() ? 'Sí' : 'No'}`);
                } else if (selectedPatient instanceof RespiratoryInfectionPatient) {
                    console.log(`${selectedPatient.name} requiere aislamiento: ${selectedPatient.isolationRequired() ? 'Sí' : 'No'}`);
                } else if (selectedPatient instanceof DermatologyPatient) {
                    console.log(`${selectedPatient.name} requiere biopsia: ${selectedPatient.requireBiopsy() ? 'Sí' : 'No'}`);
                } else if (selectedPatient instanceof GastroenterologyPatient) {
                    console.log(`${selectedPatient.name} requiere hospitalización: ${selectedPatient.requiresHospitalization() ? 'Sí' : 'No'}`);
                }
    
                selectedPatient.markAsAttended(); // Marca al paciente como atendido
                patientsAttended++; // Incrementar el contador de pacientes atendidos
                this.patients = this.patients.filter(pat => pat !== selectedPatient); // Elimina al paciente atendido
            } else {
                console.log("Selección inválida. Intenta nuevamente.");
            }
    
            // Espera de 5 segundos antes de continuar
            await delay(5000);
    
            // Verificar si todos los pacientes han sido atendidos
            if (this.patients.length === 0) {
                console.log("¡Todos los pacientes han sido atendidos a tiempo!");
                break;
            }
        }
    
        // Verificar si el nivel fue completado o perdido
        if (this.patients.length === 0) {
            console.log("¡Nivel completado exitosamente!");
            return true; // Nivel ganado.
        } else {
            console.log("¡El tiempo se ha agotado! Has perdido el nivel.");
            return false; // Nivel perdido.
        }
    }
    
    private startTimer(): Promise<number> {
        return new Promise((resolve) => {
            let timeRemaining = this.levelTimeLimit;
            console.log(`Iniciando temporizador con ${timeRemaining} segundos...`);
    
            // Usamos setTimeout para manejar el temporizador de forma no bloqueante
            const updateTime = () => {
                if (timeRemaining > 0) {
                    if (timeRemaining % 5 === 0) {
                        gameView.showTimeRemaining(timeRemaining);  // Muestra el tiempo restante cada 5 segundos.
                    }
                    timeRemaining--;  // Reduce el tiempo restante.
                    setTimeout(updateTime, 1000);  // Llama a la función nuevamente en 1 segundo.
                } else {
                    gameView.showTimeUpMessage();  // Muestra el mensaje de tiempo agotado cuando termina.
                    resolve(timeRemaining);  // Resuelve la promesa cuando se acaba el tiempo.
                }
            };
    
            // Inicia el temporizador.
            updateTime();
        });
    }
}

