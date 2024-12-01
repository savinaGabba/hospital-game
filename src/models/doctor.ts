// src/models/doctor.ts

//se importa la clase Patient para que el doctor pueda trabajar con pacientes
import { Patient } from "./patient";

//se define la clase Doctor que representa a un médico en el juego
export class Doctor {
    name: string; //nombre del doctor.
    specialty: string; //especialidad del doctor (ej. traumatología, gastroenterología, etc.).
    experienceLevel: 'junior' | 'mid' | 'senior'; //nivel de experiencia del doctor (junior, medio, senior).
    patientsAttended: number; //número de pacientes que el doctor ha atendido.
    currentPatient: Patient | null; //el paciente que el doctor está atendiendo actualmente.

    // Constructor de la clase Doctor
    constructor(name: string, specialty: string, experienceLevel: 'junior' | 'mid' | 'senior') {
        this.name = name; //se asigna el nombre al doctor.
        this.specialty = specialty; //se asigna la especialidad al doctor.
        this.experienceLevel = experienceLevel; //asigna el nivel de experiencia al doctor.
        this.patientsAttended = 0; //inicializa el contador de pacientes atendidos a 0.
        this.currentPatient = null; //inicialmente, no tiene un paciente asignado.
    }

    // Método para asignar un paciente al doctor
    assignPatient(patient: Patient): void {
        // Si el doctor ya tiene un paciente asignado, no podrá recibir otro
        if (this.currentPatient) {
            console.log(`${this.name} ya está atendiendo a otro paciente.`); //mensaje informativo
        } else {
            this.currentPatient = patient; // Asigna al paciente al doctor.
            console.log(`${this.name} está atendiendo a ${patient.name}.`); //mensaje informativo
        }
    }

    //Método para que el doctor atienda a su paciente actual
    attendPatient(): void {
        // Si no hay paciente asignado, el doctor no puede atender a nadie
        if (!this.currentPatient) {
            console.log(`${this.name} no tiene un paciente asignado.`); //mensaje informativo
            return;
        }

        // Marca al paciente como atendido
        this.currentPatient.markAsAttended(); 
        console.log(`${this.name} atendió a ${this.currentPatient.name}.`); //mensaje informativo
        this.patientsAttended++; //incrementa el contador de pacientes atendidos.
        this.currentPatient = null; //se libera al doctor para atender a otro paciente.
    }

    // Método para verificar si el doctor puede atender a un paciente según su especialidad
    canHandlePatient(patient: Patient): boolean {
        //compara la especialidad del doctor con el tipo de paciente que se le asigna.
        //si la especialidad del doctor es compatible con el tipo de paciente, devuelve true.
        return this.specialty.toLowerCase().includes(patient.constructor.name.toLowerCase());
    }

    // Método para generar un informe del rendimiento del doctor
    checkPerformance(): string {
        //retorna un mensaje con la cantidad de pacientes atendidos por el doctor.
        return `${this.name} ha atendido a ${this.patientsAttended} pacientes hasta ahora.`;
    }
};