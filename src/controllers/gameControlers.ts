import { Doctor } from "../models/doctor"; // Importa la clase Doctor.
import { Patient } from "../models/patient"; // Importa la clase Patient.
import * as gameView from "../views/gameView"; // Importa funciones de visualización del juego.
import * as prompts from "../utils/prompts"; // Importa funciones para manejar prompts de usuario.

/**
 * Clase principal que controla la lógica del juego de hospital.
 */
export class GameController {
    private doctors: Doctor[] = []; // Lista de doctores disponibles en el juego.
    private patients: Patient[] = []; // Lista de pacientes en cada nivel.
    private level: number = 1; // Nivel actual del juego.

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

        // Agrega algunos pacientes iniciales.
        this.patients.push(new Patient("John Doe", ["dolor de cabeza"], "medium"));
        this.patients.push(new Patient("Jane Roe", ["fractura"], "high"));
    }

    /**
     * Inicia el juego y controla la progresión de niveles.
     */
    public async startGame(): Promise<void> {
        gameView.showWelcomeMessage(); // Muestra mensaje de bienvenida.

        while (this.level <= 3) { // Repite el juego por 3 niveles.
            gameView.showLevel(this.level); // Muestra el nivel actual.
            await this.playLevel(); // Juega el nivel actual.
            this.level++; // Avanza al siguiente nivel.
        }

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
            this.patients.push(new Patient("John Doe", ["dolor de cabeza"], "medium"));
            this.patients.push(new Patient("Jane Roe", ["fractura"], "high"));
        } else if (level === 2) {
            this.patients.push(new Patient("Alice Brown", ["fiebre alta"], "high"));
            this.patients.push(new Patient("Bob White", ["erupción cutánea"], "low"));
        } else if (level === 3) {
            this.patients.push(new Patient("Eve Black", ["dolor abdominal severo"], "high"));
            this.patients.push(new Patient("Charlie Grey", ["tos persistente"], "medium"));
        }
    }

    /**
     * Lógica para jugar un nivel: selección de doctores y pacientes.
     */
    private async playLevel(): Promise<void> {
        this.configureLevel(this.level); // Configura los pacientes para el nivel actual.
        gameView.showPatients(this.patients); // Muestra la lista de pacientes.

        // Ciclo para asignar doctores a pacientes.
        for (const doctor of this.doctors) {
            if (this.patients.length === 0) break; // Si no hay pacientes, termina el nivel.

            // Selecciona un doctor interactivo.
            const doctorName = await prompts.selectDoctor(this.doctors.map(doc => doc.name));
            const selectedDoctor = this.doctors.find(doc => doc.name === doctorName);

            // Selecciona un paciente interactivo.
            const patientName = await prompts.selectPatient(this.patients.map(pat => pat.name));
            const selectedPatient = this.patients.find(pat => pat.name === patientName);

            // Si ambos son válidos, el doctor atiende al paciente.
            if (selectedDoctor && selectedPatient) {
                selectedDoctor.assignPatient(selectedPatient); // Asigna el paciente al doctor.
                selectedDoctor.attendPatient(); // El doctor atiende al paciente.
                this.patients = this.patients.filter(pat => pat !== selectedPatient); // Elimina al paciente de la lista.
            }
        }

        // Verifica si todos los pacientes fueron atendidos.
        if (this.patients.length === 0) {
            gameView.showLevelComplete(this.level); // Nivel completado.
        } else {
            gameView.showLevelFailed(this.level); // Nivel fallido.
        }
    }
};
