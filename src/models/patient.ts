// .src/models/patient.ts

//Se define una clase 'Patient' que representa a un paciente en el juego
export class Patient {
    //Propiedades de la clase:
    name: string;//nombre del paciente
    symptoms: string[];//lista de sintomas del paciente.
    urgency: 'high' | 'medium' | 'low';//nivel de urgencia del paciente
    timeLimit: number;//tiempo limite para atender al paciente, dependiendo de su urgencia
    attended: boolean;//indicador de si el paciente ya fue atendido o no

    //Costructor de la clase:
    //Se utiliza para inicializar un nuevo objeto 'Patient' con los valores proporcionados
    constructor(name: string, symptoms: string[], urgency:'high' | 'medium' | 'low') {
        this.name = name;//asigna el numbre
        this.symptoms = symptoms;//asigna los sintomas
        this.urgency = urgency;//asigna el nivel de urgencia
        
        //Se establece el tiempo limite segun el nivel de urgencia:
        // - Si la urgencia es 'high', el tiempo límite es de 5000 ms (5 segundos).
        // - Para otros niveles ('medium' o 'low'), el tiempo límite es de 10000 ms (10 segundos).
        this.timeLimit = urgency === 'high' ? 5000 : 10000;
        
        //Se inicializa la propiedad false ya que el paciente aun no ha sido atendido
        this.attended = false;
    }

    // Método para marcar al paciente como atendido:
    // Cuando este método se llama, cambia el valor de 'attended' a 'true'
    markAsAttended(): void {
        this.attended = true; // Marca al paciente como atendido.
    }
};

// Clase hija para pacientes traumatológicos.
export class TraumaPatient extends Patient {
    injuryType: string; // tipo de lesión (ejemplo: fractura, corte).

    constructor(name: string, symptoms: string[], injuryType: string) {
        super(name, symptoms, 'high'); //se asigna automaticamente high como nivel de urgencia.
        this.injuryType = injuryType; //se especifica el tipo de lesión.
    }

    // Método específico para pacientes traumatológicos.
    requireXRay(): boolean {
        //determina si necesita rayos X según el tipo de lesión.
        return this.injuryType === "fractura";
    }
};

// Clase hija para pacientes con infección respiratoria.
export class RespiratoryInfectionPatient extends Patient {
    contagious: boolean; // Indica si el paciente es contagioso.

    constructor(name: string, symptoms: string[], contagious: boolean) {
        super(name, symptoms, 'medium'); //se llama al constructor de la clase base.
        this.contagious = contagious; //se define si es contagioso.
    }

    // Método específico para pacientes con infecciones respiratorias.
    isolationRequired(): boolean {
        //si el paciente es contagioso, requiere aislamiento.
        return this.contagious;
    }
};

//
export class DermatologyPatient extends Patient {
    skinCondition: string; // Tipo de condición de la piel (ejemplo: dermatitis, psoriasis, melanoma).

    constructor(name: string, symptoms: string[], skinCondition: string) {
        super(name, symptoms, 'low'); //hereda el comportamiento del constructor base.
        this.skinCondition = skinCondition;
    }

    // Método específico para determinar si se necesita biopsia.
    requireBiopsy(): boolean {
        //se determina si requiere biopsia
        return this.skinCondition === "melanoma";
    }
};

//Se define la clase hija 'GastroenterologyPatient' que extiende de la clase 'Patient'
export class GastroenterologyPatient extends Patient {
    hasFever: boolean; //propiedad especifica que indica si el paciente tiene fiebre.

    constructor(name: string, symptoms: string[], urgency: 'high' | 'medium' | 'low', hasFever: boolean) {
        super(name, symptoms, urgency); //hereda el comportamiento del constructor base.
        this.hasFever = hasFever;
    }

    // Método específico para determinar si se necesita hospitalización.
    requiresHospitalization(): boolean {
        return this.hasFever && this.urgency === "high";
    }
};


