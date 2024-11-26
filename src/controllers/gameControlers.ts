import { Doctor } from "../models/doctor";
import { Patient } from "../models/patient";
import * as gameView from "../views/gameView";

export class GameController {
    private doctors: Doctor[] = [];//un array que contiene los doctores disponibles en el juego.
    private patients: Patient[] = [];//un array q contiene los pacientes
    private level: number = 1;//nivel de juego

    constructor() {
        this.initializeGame(); // configura los doctores y pacientes iniciales.
    }

    // Configura los datos iniciales del juego.
    private initializeGame(): void {
        // Crear doctores según las especialidades.
        this.doctors.push(new Doctor("Dr. Smith", "TraumaPatient", "senior"));
        this.doctors.push(new Doctor("Dr. Johnson", "GastroenterologyPatient", "mid"));

        // Crear algunos pacientes iniciales.
        this.patients.push(new Patient("John Doe", ["dolor de cabeza"], "medium"));
        this.patients.push(new Patient("Jane Roe", ["fractura"], "high"));
    }

    // Método para iniciar el juego.
    public startGame(): void {
        gameView.showWelcomeMessage();

        while (this.level <= 3) {
            gameView.showLevel(this.level);
            this.playLevel();
            this.level++;
        }

        gameView.showGameEnd();
    }

    private configureLevel(level: number): void {
        // Limpia listas de pacientes para evitar duplicados.
        this.patients = [];
        
        // Generar pacientes específicos según el nivel.
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

    // Lógica de cada nivel.
    private playLevel(): void {
        this.configureLevel(this.level); // Configura pacientes específicos para el nivel.
    
        // Mostrar pacientes disponibles.
        gameView.showPatients(this.patients);
    
        // Asignar y atender pacientes.
        this.doctors.forEach((doctor) => {
            const patient = this.patients.shift(); // Toma un paciente.
            if (patient) {
                doctor.assignPatient(patient);
                doctor.attendPatient();
            }
        });
    
        // Verificar si se completó el nivel.
        if (this.patients.length === 0) {
            gameView.showLevelComplete(this.level);
        } else {
            gameView.showLevelFailed(this.level);
        }
    }
};
